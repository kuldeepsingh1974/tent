'use client';

import React, { type FormEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Tent,
  Users,
  X,
} from 'lucide-react';
import Script from 'next/script';

type BookingForm = {
  name: string;
  phone: string;
  eventDate: string;
  eventType: string;
  message: string;
};

type RecaptchaApi = {
  getResponse: () => string;
  reset: () => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

type Service = {
  title: string;
  description: string;
  icon: typeof Tent;
  color: string;
  background: string;
};

const initialBookingForm: BookingForm = {
  name: '',
  phone: '',
  eventDate: '',
  eventType: '',
  message: '',
};

const eventTypeOptions = ['Wedding', 'Party / Birthday', 'Corporate Event', 'Jagran / Religious Event', 'Other'];
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const services: Service[] = [
  {
    title: 'Wedding Tents',
    description: 'Waterproof tent, designer entrance, stage, aisle and seating arrangement for wedding functions.',
    icon: Tent,
    color: 'from-[#736C7F] to-[#D09D9D]',
    background: 'bg-[#FFF9E9]',
  },
  {
    title: 'Mandap & Stage Decor',
    description: 'Traditional and modern mandap setups with floral backdrops, varmala stage and warm lighting.',
    icon: Sparkles,
    color: 'from-[#D09D9D] to-[#FAD9BB]',
    background: 'bg-[#F7EDF7]',
  },
  {
    title: 'Family Celebrations',
    description: 'Birthday, ring ceremony, jagran and family functions with furniture, lights and dining layout.',
    icon: Users,
    color: 'from-[#736C7F] to-[#FAD9BB]',
    background: 'bg-[#FFF9E9]',
  },
  {
    title: 'Corporate Events',
    description: 'Professional event setup with stage, registration desk, seating plan and audio support.',
    icon: CalendarCheck,
    color: 'from-[#D09D9D] to-[#736C7F]',
    background: 'bg-[#F7EDF7]',
  },
  {
    title: 'Furniture & Lighting',
    description: 'Sofa sets, chairs, dining tables, buffet counters, ambient lighting and guest flow planning.',
    icon: ShieldCheck,
    color: 'from-[#FAD9BB] to-[#D09D9D]',
    background: 'bg-[#FFF9E9]',
  },
  {
    title: 'Dining Layout',
    description: 'Kitchen tent, buffet line, counters and dining area planned according to guest count.',
    icon: Check,
    color: 'from-[#736C7F] to-[#D09D9D]',
    background: 'bg-[#F7EDF7]',
  },
];

export const gallery = [
  {
    title: 'Premium Wedding Stage Decor',
    image: '/gallery/480013500_17910041862085426_6843520720484698242_n.webp',
  },
  {
    title: 'Traditional Event Decoration',
    image: '/gallery/480481143_17910041871085426_4059805525147874967_n.webp',
  },
  {
    title: 'Colorful Wedding Setup',
    image: '/gallery/626156735_17948292717085426_6524832806745751138_n.webp',
  },
  {
    title: 'Festive Tent Decoration',
    image: '/gallery/628729179_17949067299085426_7043889862876488136_n.webp',
  },
  {
    title: 'Bright Event Stage Setup',
    image: '/gallery/629425330_17949067380085426_5448455976344403205_n.webp',
  },
  {
    title: 'Navratri Interior Decoration',
    image: '/gallery/navratri-interior-decoration.jpg',
  },
  {
    title: 'Open Lounge Tent Setup',
    image: '/gallery/open-lounge-tent-hd.jpg',
  },
  {
    title: 'Traditional Fabric Marriage Stage 1',
    image: '/gallery/marriage-stage-adorned-with-vibrant-traditional-fabrics-that-represent-couples-cultural-heritage (1).jpg',
  },
  {
    title: 'Evening Canopy Decoration Original',
    image: '/gallery/evening-canopy-decor.jpg',
  },
  {
    title: 'Elegant Wedding Set Up',
    image: '/gallery/elegant-wedding-set-up.jpg',
  },
  {
    title: 'Curtain Stage Setup',
    image: '/gallery/stage-with-curtain-that-says-pom-it.jpg',
  },
  {
    title: 'Wedding Ceremony Arch Chairs',
    image: '/gallery/wedding-ceremony-area-arch-chairs-decor.jpg',
  },
  {
    title: 'Open Air Terrace Floral Arch',
    image: '/gallery/light-wedding-open-air-terrace-with-floral-arch.jpg',
  },
  {
    title: 'Colorful Bride Stage Decoration',
    image: '/gallery/colorful-stage-decoration-bride.jpg',
  },
  {
    title: 'Indian Marriage Stage 1',
    image: '/gallery/wedding-stage-indian-marriage (1).jpg',
  },
  {
    title: 'Navratri Door Decoration',
    image: '/gallery/navratri-highly-detailed-door-decoration.jpg',
  },
  {
    title: 'White Couch Yellow Curtain Stage',
    image: '/gallery/stage-with-white-couch-yellow-curtain-with-words-love-it.jpg',
  },
  {
    title: 'Yellow Stage Setup',
    image: '/gallery/yellow-stage.avif',
  },
  {
    title: 'Outdoor Flower Tent Decor',
    image: '/gallery/outdoor-wedding-tent-decorated-with-flowers-outdoor-wedding.jpg',
  },
  {
    title: 'Red Curtain Flower Stage',
    image: '/gallery/stage-with-red-curtain-that-says-flowers-it.jpg',
  },
  {
    title: 'Elegant Flower Curtain Stage',
    image: '/gallery/elegant-wedding-stage-decoration-design-with-flowers-curtains-wedding-ceremony.jpg',
  },
  {
    title: 'Traditional Fabric Marriage Stage',
    image: '/gallery/marriage-stage-adorned-with-vibrant-traditional-fabrics-that-represent-couples-cultural-heritage.jpg',
  },
  {
    title: 'Traditional Sofa Flower Stage 1',
    image: '/gallery/wedding-ceremony-stage-decoration-background-with-sofa-flowers-indian-pakistani-traditional (1).jpg',
  },
  {
    title: 'Elegant Indian Wedding Stage',
    image: '/gallery/elegant-indian-wedding-stage-decoration.jpg',
  },
  {
    title: 'Indian Marriage Stage 2',
    image: '/gallery/wedding-stage-indian-marriage (2).jpg',
  },
  {
    title: 'Indian Marriage Stage',
    image: '/gallery/wedding-stage-indian-marriage.jpg',
  },
  {
    title: 'Navratri Door Decoration 1',
    image: '/gallery/navratri-highly-detailed-door-decoration (1).jpg',
  },
  {
    title: 'Traditional Sofa Flower Stage',
    image: '/gallery/wedding-ceremony-stage-decoration-background-with-sofa-flowers-indian-pakistani-traditional.jpg',
  },
  {
    title: 'Floral Stage Sofa HD',
    image: '/gallery/stage-floral-sofa-hd.jpg',
  },
  {
    title: 'Photorealistic Wedding Venue',
    image: '/gallery/photorealistic-wedding-venue-with-intricate-decor-ornaments.jpg',
  },
  {
    title: 'Haldi Ceremony Background',
    image: '/gallery/haldi-background-indian-wedding-time-haldi-ceremony.jpg',
  },
  {
    title: 'Canopy Name Stage',
    image: '/gallery/stage-with-canopy-that-says-name-company.jpg',
  },
  {
    title: 'Gold White Chandelier Bed Decor',
    image: '/gallery/bed-with-gold-white-bed-chandelier-with-flowers-it.jpg',
  },
];

const homepageGallery = gallery.slice(0, 7);

const testimonials = [
  {
    name: 'Mahesh Mahtno',
    event: 'Shaadi Function',
    text: 'Shaadi ka pura tent aur decoration bahut badhiya tha. Sab guests ne setup ki tarif ki. Team ne time se pehle saara kaam complete kar diya tha.',
  },
  {
    name: 'Palak',
    event: 'Birthday Party',
    text: 'Decoration dekh kar bachche aur family sab bahut khush hue. Lighting aur seating arrangement bhi kaafi accha tha. Service se hum poori tarah satisfied hain.',
  },
  {
    name: 'Sachin Kumar',
    event: 'Jagran Program',
    text: 'Rate bhi theek tha aur kaam bhi bahut professional tha. Jo promise kiya tha wahi setup diya. Aage bhi function hoga to inhi ko book karenge.',
  },
  {
    name: 'Prakash Chand',
    event: 'Engagement Ceremony',
    text: 'Stage decoration aur flower work bahut sundar tha. Har cheez saaf-suthri aur well managed thi. Guests ne bhi kaafi tarif ki.',
  },
  {
    name: 'Ritik Kumar',
    event: 'Family Function',
    text: 'Pura arrangement ekdum tension-free raha. Tent, chairs, lighting aur dining setup sab perfect tha. Team ka behaviour bhi bahut accha tha.',
  },
  { name: 'Niharika nigam', event: 'Ring Ceremony', text: 'Decoration dekhkar sabhi guests impress ho gaye. Team ne har chhoti-badi cheez ka dhyan rakha aur pura setup time par complete kar diya. Zarurat padne par dobara inhi ki service lenge.' }
];


export default function TentHouseLanding() {
  const [bookingForm, setBookingForm] = useState<BookingForm>(initialBookingForm);
  const [bookingErrors, setBookingErrors] = useState<Partial<BookingForm>>({});
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingSubmitError, setBookingSubmitError] = useState('');
  const [recaptchaError, setRecaptchaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  const updateBookingField = (field: keyof BookingForm, value: string) => {
    const nextValue = field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;

    setBookingForm((current) => ({ ...current, [field]: nextValue }));
    setBookingErrors((current) => ({ ...current, [field]: '' }));
    setBookingSuccess('');
    setBookingSubmitError('');
    setRecaptchaError('');
  };

  const validateBookingForm = () => {
    const errors: Partial<BookingForm> = {};
    const trimmedName = bookingForm.name.trim();
    const trimmedMessage = bookingForm.message.trim();
    const today = getTodayDateString();

    if (!trimmedName) {
      errors.name = 'Please enter your name.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name should be at least 2 characters.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.name = 'Name can only contain letters and spaces.';
    }

    if (!bookingForm.phone) {
      errors.phone = 'Please enter your phone number.';
    } else if (bookingForm.phone.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    } else if (!/^[6-9]\d{9}$/.test(bookingForm.phone)) {
      errors.phone = 'Please enter a valid Indian mobile number.';
    }

    if (!bookingForm.eventDate) {
      errors.eventDate = 'Please select the event date.';
    } else if (bookingForm.eventDate < today) {
      errors.eventDate = 'Event date cannot be in the past.';
    }

    if (!bookingForm.eventType) {
      errors.eventType = 'Please select the event type.';
    } else if (!eventTypeOptions.includes(bookingForm.eventType)) {
      errors.eventType = 'Please select a valid event type.';
    }

    if (!trimmedMessage) {
      errors.message = 'Please share your requirement.';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Requirement should be at least 10 characters.';
    } else if (trimmedMessage.length > 500) {
      errors.message = 'Requirement cannot be more than 500 characters.';
    }

    return errors;
  };

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateBookingForm();
    setBookingErrors(errors);

    if (Object.keys(errors).length > 0) {
      setBookingSuccess('');
      setBookingSubmitError('');
      setRecaptchaError('');
      return;
    }

    const recaptchaToken = window.grecaptcha?.getResponse() || '';

    if (!recaptchaSiteKey) {
      setBookingSuccess('');
      setBookingSubmitError('');
      setRecaptchaError('reCAPTCHA site key is missing. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY.');
      return;
    }

    if (!recaptchaToken) {
      setBookingSuccess('');
      setBookingSubmitError('');
      setRecaptchaError('Please verify that you are not a robot.');
      return;
    }

    setIsSubmitting(true);
    setBookingSuccess('');
    setBookingSubmitError('');
    setRecaptchaError('');

    try {
      const payload = {
        name: bookingForm.name.trim(),
        phone: bookingForm.phone,
        eventDate: bookingForm.eventDate,
        eventType: bookingForm.eventType,
        message: bookingForm.message.trim(),
        recaptchaToken,
      };

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'We could not send your request. Please try again.');
      }

      setBookingSuccess('Thank you. Your request has been sent and our team will contact you shortly.');
      setBookingForm(initialBookingForm);
      window.grecaptcha?.reset();
    } catch (error) {
      setBookingSubmitError(error instanceof Error ? error.message : 'We could not send your request. Please try again.');
      window.grecaptcha?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeGallery = () => setActiveGalleryIndex(null);

  const showPreviousImage = () => {
    setActiveGalleryIndex((current) => {
      if (current === null) return current;
      return current === 0 ? homepageGallery.length - 1 : current - 1;
    });
  };

  const showNextImage = () => {
    setActiveGalleryIndex((current) => {
      if (current === null) return current;
      return current === homepageGallery.length - 1 ? 0 : current + 1;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.getElementById('services');
      setShowBackToTop(Boolean(servicesSection && window.scrollY >= servicesSection.offsetTop - 120));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFF9E9] text-black">
      <section className="relative overflow-hidden px-4 pb-16 pt-28 text-black sm:px-6 sm:pb-24 sm:pt-32 lg:min-h-[92vh] lg:px-8 lg:pb-28">
        <img
          src="gallery/stage-with-canopy-that-says-name-company.jpg"
          alt="Decorated outdoor event tent"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9E9]/92 via-[#F7EDF7]/78 to-[#FAD9BB]/58" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FFF9E9] to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="animate-fade-in text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FAD9BB] px-5 py-3 text-sm font-black text-black shadow-xl">

            </p>
            <h1 className="mx-auto max-w-4xl text-3xl font-black leading-tight sm:text-5xl lg:mx-0 lg:text-5xl">
              Chaman Tent House Services For Memorable Events.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-black sm:mt-6 sm:text-xl sm:leading-8 lg:mx-0">
              Chaman Tent House provides wedding tents, mandap decoration, lighting,
              furniture and dining layouts for functions across Jawala-mukhi Kangra and nearby areas.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FAD9BB] bg-[#FFF9E9] px-6 py-4 text-base font-black text-black shadow-2xl transition hover:scale-105 hover:bg-[#F7EDF7] sm:px-8 sm:text-lg">
                Any Query
              </a>
              <a href="#gallery" className="inline-flex items-center justify-center rounded-full border-2 border-[#FAD9BB] bg-[#FFF9E9] px-6 py-4 text-base font-black text-black shadow-xl backdrop-blur transition hover:bg-[#F7EDF7] sm:px-8 sm:text-lg">
                View Work
              </a>
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 lg:mx-0">
              {[
                ['4.9/5', 'Client rating'],
                ['1000+', 'Events handled'],
                ['24/7', 'Booking support'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-black text-black sm:text-3xl">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-black">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div >
              <div className="rounded-[1.55rem] bg-[#FFF9E9] p-1 text-black">
                <img
                  src="/indian-wedding-pooja.jpg"
                  alt="Indian wedding pooja ceremony"
                  className="h-80 w-full rounded-2xl object-cover sm:h-[28rem] lg:h-[34rem]"
                />
                {/* <div className="mt-5 grid grid-cols-2 gap-3">
                  <FeatureCard icon={CalendarCheck} title="Planned setup" text="Before-event handover" />
                  <FeatureCard icon={ShieldCheck} title="Safe structure" text="Waterproof materials" tone="pink" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#FFF9E9] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Our Services" title="Complete event setup from one experienced team" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#F7EDF7] via-[#FFF9E9] to-[#FAD9BB]/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <img
              src="/indian-bride-s-parents-hold-bowl-with-coconut-her-hands.jpg"
              alt="Indian wedding pooja ceremony"
              className="h-80 w-full rounded-3xl object-cover shadow-2xl transition hover:scale-[1.02] sm:h-[28rem] sm:rounded-[2rem]"
            />
          </div>

          <div>
            <p className="mb-4 inline-block rounded-full bg-[#FFF9E9] px-5 py-2 text-sm font-black text-black shadow">
              Why Clients Choose Us
            </p>
            <h2 className="text-3xl font-black text-black sm:text-5xl">Practical planning, clean execution and clear pricing</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                'Weather-resistant tent materials',
                'Layouts customized to venue size',
                'Transparent pricing before work starts',
                'Support team available on event day',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl bg-[#FFF9E9] p-4 font-bold text-black shadow-lg shadow-[#D09D9D]/20">
                  <Check className="h-5 w-5 shrink-0 text-black" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gradient-to-br from-[#FFF9E9] to-[#F7EDF7] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Book Your Event"
            title="Professional Tent House & Event Setup Services"
          />
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-3xl font-black leading-tight text-black sm:text-4xl">
              Complete Tent & Event Management for Every Occasion.
            </h2>
            <p className="mt-5 text-base font-semibold leading-7 sm:text-xl sm:leading-8">
              Shaadi, birthday, religious aur corporate events ke liye decoration, lighting, stage aur seating ki complete tent house service — professional setup aur time par delivery ke saath.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="tel:+919805448091"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#FAD9BB] bg-[#FFF9E9] px-4 py-4 text-sm font-black text-black shadow-2xl shadow-[#736C7F]/15 transition hover:scale-105 hover:bg-[#F7EDF7] sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                Call Now: +91 98054-48091
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FAD9BB] bg-[#FFF9E9] px-4 py-4 text-sm font-black text-black shadow-lg transition hover:border-[#D09D9D] hover:bg-[#F7EDF7] sm:w-auto"
              >
                Free Enquire
              </a>
            </div>
          </div>

          <div className="grid gap-5">
            {[
              [
                'Custom Setup for Every Event',
                'From small family functions to grand weddings, we create the perfect setup according to your requirements and budget.',
              ],
              [
                'Premium Decoration & Seating',
                'Beautiful decorations, comfortable seating, dining arrangements and elegant event styling for all occasions.',
              ],
            ].map(([title, text], index) => (
              <div
                key={title}
                className="rounded-3xl border-2 border-white bg-[#FFF9E9] p-6 shadow-xl shadow-[#D09D9D]/20 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#D09D9D] to-[#736C7F] text-xl font-black text-black">
                    {index + 1}
                  </span>

                  <div>
                    <h3 className="text-2xl font-black text-black">{title}</h3>
                    <p className="mt-2 text-base font-semibold leading-7 text-black">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>


      <section id="gallery" className="bg-gradient-to-br from-[#F7EDF7] via-[#FFF9E9] to-[#FAD9BB]/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Gallery" title="Event setups with real venue impact" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {homepageGallery.map((item, index) => (
              <figure
                key={item.title}
                onClick={() => setActiveGalleryIndex(index)}
                className={`group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-xl ${index === 0 ? 'lg:col-span-2' : ''}`}
              >
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-72" />
              </figure>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href="/gallery" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FAD9BB] bg-[#FFF9E9] px-6 py-4 text-base font-black text-black shadow-2xl shadow-[#736C7F]/15 transition hover:scale-105 hover:bg-[#F7EDF7] sm:px-8 sm:text-lg">
              View All Gallery
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {activeGalleryIndex !== null && (
        <GalleryLightbox
          activeIndex={activeGalleryIndex}
          onClose={closeGallery}
          onPrevious={showPreviousImage}
          onNext={showNextImage}
          onSelect={setActiveGalleryIndex}
        />
      )}

      <section className="bg-[#FFF9E9] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Client Feedback" title="What customers say after their events" />

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-gradient-to-br from-[#FFF9E9] via-[#F7EDF7] to-[#FAD9BB] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {recaptchaSiteKey && <Script src="https://www.google.com/recaptcha/api.js" strategy="lazyOnload" />}
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black text-black sm:text-5xl">Plan your next function with us.</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-black sm:text-xl">Share the event details and we will respond with availability and package options.</p>
          </div>

          <div className="contact-booking-grid grid gap-10">
            <ContactPanel />

            <form onSubmit={handleBookingSubmit} noValidate className="rounded-3xl bg-[#FFF9E9] p-5 shadow-2xl sm:p-6 md:p-10">
              <h3 className="mb-8 text-2xl font-black text-black sm:text-3xl">Quick Booking Form</h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Your Name" error={bookingErrors.name}>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(event) => updateBookingField('name', event.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass(bookingErrors.name)}
                  />
                </Field>

                <Field label="Phone Number" error={bookingErrors.phone}>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(event) => updateBookingField('phone', event.target.value)}
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10 digit mobile number"
                    className={inputClass(bookingErrors.phone)}
                  />
                </Field>

                <Field label="Event Date" error={bookingErrors.eventDate}>
                  <input
                    type="date"
                    value={bookingForm.eventDate}
                    min={getTodayDateString()}
                    onChange={(event) => updateBookingField('eventDate', event.target.value)}
                    className={inputClass(bookingErrors.eventDate)}
                  />
                </Field>

                <Field label="Event Type" error={bookingErrors.eventType}>
                  <select value={bookingForm.eventType} onChange={(event) => updateBookingField('eventType', event.target.value)} className={inputClass(bookingErrors.eventType)}>
                    <option value="">Select Event Type</option>
                    {eventTypeOptions.map((eventType) => (
                      <option key={eventType} value={eventType}>
                        {eventType}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Message" error={bookingErrors.message}>
                  <textarea
                    value={bookingForm.message}
                    onChange={(event) => updateBookingField('message', event.target.value)}
                    placeholder="Tent size, location, decoration theme..."
                    rows={4}
                    maxLength={500}
                    className={`${inputClass(bookingErrors.message)} resize-none`}
                  />
                </Field>
              </div>

              <div className="mt-5">
                {recaptchaSiteKey ? (
                  <div className="max-w-full overflow-hidden">
                    <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
                  </div>
                ) : (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">
                    reCAPTCHA is not configured.
                  </p>
                )}
                {recaptchaError && <p className="mt-2 text-sm font-bold text-red-600">{recaptchaError}</p>}
              </div>

              {bookingSuccess && <StatusMessage tone="success" message={bookingSuccess} />}
              {bookingSubmitError && <StatusMessage tone="error" message={bookingSubmitError} />}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#FAD9BB] bg-[#FFF9E9] py-4 text-lg font-black text-black transition hover:scale-[1.01] hover:bg-[#F7EDF7] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Sending request...' : 'Query Send'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full border-2 border-[#FAD9BB] bg-[#FFF9E9] text-black shadow-2xl shadow-[#736C7F]/20 transition hover:-translate-y-1 hover:scale-105 hover:bg-[#F7EDF7] focus:outline-none focus:ring-4 focus:ring-[#FAD9BB]"
        >
          <ArrowUp className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-10 text-center sm:mb-16">
      <p className="mb-4 inline-block rounded-full bg-[#F7EDF7] px-5 py-2 text-sm font-black text-black">{eyebrow}</p>
      <h3 className="mx-auto max-w-3xl text-3xl font-black text-black sm:text-5xl">
        {title}
      </h3>
      {text && <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-7 text-black sm:text-xl">{text}</p>}
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-5 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl sm:rounded-[2rem] sm:p-6">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-orange-100 transition-all duration-500 group-hover:scale-150"></div>

      <div className="relative z-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-2xl text-white shadow-lg">
          <service.icon size={28} />
        </div>

        <h3 className="mb-3 text-xl font-extrabold text-slate-900">
          {service.title}
        </h3>

        <p className="text-sm leading-7 text-slate-600">
          {service.description}
        </p>

        {/* <div className="mt-6 flex items-center gap-2 font-bold text-orange-600">
          <span>View Details</span>
        </div> */}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) {

  return (
    <article className="rounded-3xl border-2 border-white bg-gradient-to-br from-[#FFF9E9] to-[#F7EDF7] p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl sm:p-8">
      <div className="mb-5 flex gap-1">
        {[...Array(5)].map((_, star) => (
          <Star key={star} className="h-5 w-5 fill-[#FFC107] text-[#F59E0B]" />
        ))}
      </div>
      <p className="text-base font-semibold italic leading-7 text-black sm:text-lg sm:leading-8">"{testimonial.text}"</p>
      <div className="mt-7 flex items-center gap-4 border-t-2 border-white/70 pt-5">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#D09D9D] to-[#736C7F] font-black text-black">
          {testimonial.name[0]}
        </div>
        <div>
          <p className="font-black text-black">{testimonial.name}</p>
          <p className="text-xs font-bold text-black">{testimonial.event}</p>
        </div>
      </div>
    </article>
  );
}

function GalleryLightbox({
  activeIndex,
  onClose,
  onPrevious,
  onNext,
  onSelect,
}: {
  activeIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  const activeImage = homepageGallery[activeIndex];

  return (
    <div className="fixed inset-0 z-[70] bg-[#736C7F]/90 px-3 py-4 backdrop-blur-sm sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <div className="mb-4 flex items-center justify-between gap-4 text-black">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-black sm:text-sm sm:tracking-[0.22em]">Gallery Preview</p>
            <h3 className="mt-1 truncate text-lg font-black sm:text-2xl">{activeImage.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#FAD9BB] bg-[#FFF9E9] text-black transition hover:bg-[#F7EDF7]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black sm:rounded-3xl">
          <img src={activeImage.image} alt={activeImage.title} decoding="async" className="h-full w-full object-contain" />

          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#FAD9BB] bg-[#FFF9E9] text-black shadow-xl transition hover:bg-[#F7EDF7] sm:left-4 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#FAD9BB] bg-[#FFF9E9] text-black shadow-xl transition hover:bg-[#F7EDF7] sm:right-4 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>

        <div className="mt-5 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4">
            {homepageGallery.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onSelect(index)}
                className={`w-32 overflow-hidden rounded-2xl border-2 bg-[#FFF9E9] text-left text-black transition hover:bg-[#F7EDF7] sm:w-40 ${activeIndex === index ? 'border-[#FAD9BB]' : 'border-white/10 hover:border-white/50'
                  }`}
              >
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="h-24 w-full object-cover" />
                <span className="block truncate px-3 py-2 text-xs font-bold text-black">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPanel() {
  const contactItems = [
    { icon: Phone, title: 'Call or WhatsApp', value: '+91 98054-48091', note: 'Available for bookings' },
    { icon: MapPin, title: 'Location', value: 'Gummer (Jawala-Mukhi), Kangra', note: 'Serving Himachal Pradesh nearby areas' },
    { icon: Clock, title: 'Response Time', value: 'Same-day callback', note: 'Site visit support available' },
    { icon: Users, title: 'Event Types', value: 'Wedding, party, corporate', note: 'Complete tent house arrangement' },
  ];

  return (
    <div className="contact-details-panel">
      <h3 className="contact-details-title">Contact Details</h3>
      <div className="contact-details-list">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="contact-details-card">
              <span className="contact-details-icon">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="contact-details-card-title">{item.title}</p>
                <p className="contact-details-card-value">{item.value}</p>
                <p className="contact-details-card-note">{item.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
  tone = 'blue',
}: {
  icon: typeof CalendarCheck;
  title: string;
  text: string;
  tone?: 'blue' | 'pink';
}) {
  const classes = tone === 'blue' ? 'bg-[#F7EDF7] text-black' : 'bg-[#FAD9BB]/55 text-black';

  return (
    <div className={`rounded-2xl p-4 ${classes}`}>
      <Icon className="mb-2 h-7 w-7" />
      <p className="font-black text-black">{title}</p>
      <p className="text-sm font-semibold text-black">{text}</p>
    </div>
  );
}

function StatusMessage({ tone, message }: { tone: 'success' | 'error'; message: string }) {
  const classes = tone === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';

  return <p className={`mt-5 rounded-xl px-4 py-3 text-center text-sm font-black ${classes}`}>{message}</p>;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-black text-black">
      <span className="mb-3 block">{label}</span>
      {children}
      {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
    </label>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-xl border-2 px-3 py-3 text-base font-semibold text-black outline-none placeholder-[#736C7F]/70 focus:border-[#736C7F] sm:text-lg ${error ? 'border-red-500 bg-red-50' : 'border-[#FAD9BB]'
    }`;
}

function getTodayDateString() {
  const today = new Date();
  const timezoneOffsetMs = today.getTimezoneOffset() * 60 * 1000;
  return new Date(today.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}
