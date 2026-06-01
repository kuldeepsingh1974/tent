import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const recipientEmail = process.env.QUOTE_RECIPIENT_EMAIL || 'kuldeepsinghwork1@gmail.com';
const rateLimitWindowMs = 60 * 1000;
const maxRequestsPerWindow = 2;
const rateLimitStore = new Map<string, number[]>();
const fingerprintStore = new Map<string, { count: number; lastSeen: number }>();
const submissionTimingStore = new Map<string, number[]>();

// Rate limiting thresholds
const REQUESTS_PER_MINUTE_PER_IP = 2;
const REQUESTS_PER_HOUR_PER_IP = 10;
const MIN_SUBMISSION_TIME_MS = 1000; // Minimum time to fill form
const MAX_SUBMISSIONS_PER_FINGERPRINT = 5; // Per hour

type QuotePayload = {
  name?: string;
  phone?: string;
  eventDate?: string;
  eventType?: string;
  message?: string;
  recaptchaToken?: string;
  honeypot?: string;
  submissionTime?: number;
};

type QuoteFields = Required<Omit<QuotePayload, 'recaptchaToken' | 'honeypot' | 'submissionTime'>>;

const eventTypeOptions = ['Wedding', 'Party / Birthday', 'Corporate Event', 'Jagran / Religious Event', 'Other'];

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as QuotePayload;
    const clientIp = getClientIp(request);

    // Check honeypot field
    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn(`[SECURITY] Honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Check submission timing (form filled too fast = likely bot)
    const submissionTime = data.submissionTime || 0;
    if (submissionTime < MIN_SUBMISSION_TIME_MS && submissionTime > 0) {
      console.warn(`[SECURITY] Suspiciously fast submission (${submissionTime}ms) from IP: ${clientIp}`);
      return NextResponse.json({ error: 'Form submitted too quickly. Please try again.' }, { status: 429 });
    }

    const name = data.name?.trim() || '';
    const phone = data.phone?.trim() || '';
    const eventDate = data.eventDate?.trim() || '';
    const eventType = data.eventType?.trim() || '';
    const message = data.message?.trim() || '';
    const recaptchaToken = data.recaptchaToken?.trim() || '';

    const validationError = validateQuotePayload({ name, phone, eventDate, eventType, message });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Create device fingerprint from request data
    const fingerprint = generateFingerprint(request, name, phone);

    // Check fingerprint-based rate limiting
    const fingerprintCheck = checkFingerprintLimit(fingerprint);
    if (!fingerprintCheck.allowed) {
      console.warn(`[SECURITY] Fingerprint rate limit exceeded: ${fingerprint}`);
      return NextResponse.json(
        { error: 'Too many requests from your device. Please wait before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(fingerprintCheck.retryAfter),
          },
        },
      );
    }

    // IP-based rate limiting (1 minute window)
    const rateLimitResult = checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        { error: 'Only 2 queries can be sent per minute. Please wait before sending again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(REQUESTS_PER_MINUTE_PER_IP),
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }

    // Check hourly rate limit per IP
    const hourlyLimitResult = checkHourlyRateLimit(clientIp);
    if (!hourlyLimitResult.allowed) {
      console.warn(`[SECURITY] Hourly rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        { error: 'Too many requests from your IP address today. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(hourlyLimitResult.retryAfter),
          },
        },
      );
    }

    // Verify reCAPTCHA (with fallback behavior)
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaError = await verifyRecaptcha(recaptchaToken, clientIp);
      if (recaptchaError) {
        console.warn(`[SECURITY] reCAPTCHA verification failed from IP: ${clientIp}`);
        return NextResponse.json({ error: recaptchaError }, { status: 400 });
      }
    } else if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.warn('[WARNING] RECAPTCHA_SECRET_KEY not configured - relying on alternative security');
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: 'Email service is not configured. Add SMTP_USER and SMTP_PASS in .env.local.' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM || `"Chaman Tent House" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: process.env.SMTP_USER,
      subject: `New Quote Request - ${eventType} - ${name}`,
      text: [
        'New quote request received from Chaman Tent House website.',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Event Date: ${eventDate}`,
        `Event Type: ${eventType}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Event Date:</strong> ${escapeHtml(eventDate)}</p>
          <p><strong>Event Type:</strong> ${escapeHtml(eventType)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'X-RateLimit-Limit': String(REQUESTS_PER_MINUTE_PER_IP),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      },
    );
  } catch (error) {
    console.error('Quote email error:', error);
    return NextResponse.json({ error: 'Unable to send quote request right now.' }, { status: 500 });
  }
}

function validateQuotePayload(data: QuoteFields) {
  if (!data.name || data.name.length < 2) {
    return 'Please enter your name.';
  }

  if (!/^[a-zA-Z\s.'-]+$/.test(data.name)) {
    return 'Please enter a valid name.';
  }

  if (!/^[6-9]\d{9}$/.test(data.phone)) {
    return 'Please enter a valid 10 digit Indian mobile number.';
  }

  if (!data.eventDate) {
    return 'Please select the event date.';
  }

  if (data.eventDate < getTodayDateString()) {
    return 'Event date cannot be in the past.';
  }

  if (!eventTypeOptions.includes(data.eventType)) {
    return 'Please select a valid event type.';
  }

  if (!data.message || data.message.length < 10) {
    return 'Please share your requirement in at least 10 characters.';
  }

  if (data.message.length > 500) {
    return 'Requirement cannot be more than 500 characters.';
  }

  return '';
}

async function verifyRecaptcha(token: string, remoteIp: string) {
  if (!token) {
    return 'Please verify that you are not a robot.';
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    return 'reCAPTCHA secret key is not configured. Add RECAPTCHA_SECRET_KEY in .env.local.';
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
        remoteip: remoteIp,
      }),
    });

    if (!response.ok) {
      console.warn('[RECAPTCHA] API error:', response.status);
      return 'Unable to verify reCAPTCHA right now. Please try again.';
    }

    const result = (await response.json()) as { success?: boolean; score?: number };

    if (!result.success) {
      console.warn('[RECAPTCHA] Verification failed');
      return 'reCAPTCHA verification failed. Please try again.';
    }

    return '';
  } catch (error) {
    console.error('[RECAPTCHA] Error during verification:', error);
    return 'Unable to verify reCAPTCHA. Please try again.';
  }
}

function getTodayDateString() {
  const today = new Date();
  const timezoneOffsetMs = today.getTimezoneOffset() * 60 * 1000;
  return new Date(today.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const vercelIp = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();

  return forwardedFor || realIp || vercelIp || 'unknown';
}

function generateFingerprint(request: Request, name: string, phone: string): string {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLanguage = request.headers.get('accept-language') || 'unknown';
  const ip = getClientIp(request);

  // Create a hash of device/request characteristics
  const fingerprintData = `${ip}|${userAgent}|${acceptLanguage}`;
  return crypto.createHash('sha256').update(fingerprintData).digest('hex');
}

function checkFingerprintLimit(fingerprint: string) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;

  const fpData = fingerprintStore.get(fingerprint) || { count: 0, lastSeen: now };

  // Reset count if last seen was more than an hour ago
  if (fpData.lastSeen < hourAgo) {
    fingerprintStore.set(fingerprint, { count: 1, lastSeen: now });
    return { allowed: true, retryAfter: 0 };
  }

  if (fpData.count >= MAX_SUBMISSIONS_PER_FINGERPRINT) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((fpData.lastSeen + 60 * 60 * 1000 - now) / 1000)),
    };
  }

  fpData.count++;
  fpData.lastSeen = now;
  fingerprintStore.set(fingerprint, fpData);

  return { allowed: true, retryAfter: 0 };
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowStart = now - rateLimitWindowMs;
  const recentRequests = (rateLimitStore.get(ip) || []).filter((timestamp) => timestamp > windowStart);

  if (recentRequests.length >= REQUESTS_PER_MINUTE_PER_IP) {
    const oldestRequest = recentRequests[0] || now;
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((oldestRequest + rateLimitWindowMs - now) / 1000)),
    };
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);

  rateLimitStore.forEach((timestamps, storedIp) => {
    const activeTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);
    if (activeTimestamps.length === 0) {
      rateLimitStore.delete(storedIp);
    } else if (activeTimestamps.length !== timestamps.length) {
      rateLimitStore.set(storedIp, activeTimestamps);
    }
  });

  return {
    allowed: true,
    remaining: REQUESTS_PER_MINUTE_PER_IP - recentRequests.length,
    retryAfter: 0,
  };
}

function checkHourlyRateLimit(ip: string) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const recentSubmissions = (submissionTimingStore.get(ip) || []).filter((timestamp) => timestamp > hourAgo);

  if (recentSubmissions.length >= REQUESTS_PER_HOUR_PER_IP) {
    const oldestRequest = recentSubmissions[0] || now;
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((oldestRequest + 60 * 60 * 1000 - now) / 1000)),
    };
  }

  recentSubmissions.push(now);
  submissionTimingStore.set(ip, recentSubmissions);

  // Cleanup old entries
  submissionTimingStore.forEach((timestamps, storedIp) => {
    const activeTimestamps = timestamps.filter((timestamp) => timestamp > hourAgo);
    if (activeTimestamps.length === 0) {
      submissionTimingStore.delete(storedIp);
    } else if (activeTimestamps.length !== timestamps.length) {
      submissionTimingStore.set(storedIp, activeTimestamps);
    }
  });

  return {
    allowed: true,
    retryAfter: 0,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

