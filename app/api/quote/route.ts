import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const recipientEmail = process.env.QUOTE_RECIPIENT_EMAIL || 'kuldeepsinghwork1@gmail.com';
const rateLimitWindowMs = 60 * 1000;
const maxRequestsPerWindow = 2;
const rateLimitStore = new Map<string, number[]>();

type QuotePayload = {
  name?: string;
  phone?: string;
  eventDate?: string;
  eventType?: string;
  message?: string;
  recaptchaToken?: string;
};

type QuoteFields = Required<Omit<QuotePayload, 'recaptchaToken'>>;

const eventTypeOptions = ['Wedding', 'Party / Birthday', 'Corporate Event', 'Jagran / Religious Event', 'Other'];

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as QuotePayload;
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

    const recaptchaError = await verifyRecaptcha(recaptchaToken, getClientIp(request));

    if (recaptchaError) {
      return NextResponse.json({ error: recaptchaError }, { status: 400 });
    }

    const rateLimitResult = checkRateLimit(getClientIp(request));

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Only 2 queries can be sent per minute. Please wait before sending again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(maxRequestsPerWindow),
            'X-RateLimit-Remaining': '0',
          },
        },
      );
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
          'X-RateLimit-Limit': String(maxRequestsPerWindow),
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
    return 'Unable to verify reCAPTCHA right now. Please try again.';
  }

  const result = (await response.json()) as { success?: boolean };

  if (!result.success) {
    return 'reCAPTCHA verification failed. Please try again.';
  }

  return '';
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

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowStart = now - rateLimitWindowMs;
  const recentRequests = (rateLimitStore.get(ip) || []).filter((timestamp) => timestamp > windowStart);

  if (recentRequests.length >= maxRequestsPerWindow) {
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
    remaining: maxRequestsPerWindow - recentRequests.length,
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
