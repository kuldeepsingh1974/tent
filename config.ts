// Configuration file for easy customization
// Update these values to customize your landing page

export const SITE_CONFIG = {
  // Business Info
  businessName: 'TentPro',
  tagline: 'Premium Tent House Solutions for Every Occasion',
  description: 'From intimate gatherings to grand events, we provide high-quality, elegant tents and complete party solutions.',
  
  // Contact Info
  phone: '+91 98765 43210',
  email: 'info@tentpro.com',
  address: 'Delhi NCR Region, India',
  
  // Social Links (for future implementation)
  social: {
    facebook: '#',
    instagram: '#',
    whatsapp: '#',
    youtube: '#'
  },
  
  // Ratings & Reviews
  rating: 4.9,
  totalReviews: 500,
  reviewText: '500+ Happy Events',
  
  // Pricing
  pricing: {
    basic: {
      name: 'Basic Tent',
      size: '20x30 ft',
      price: '₹5,000',
      capacity: '50-100 guests',
      features: [
        'Basic tent setup',
        'Seating arrangement',
        'Simple lighting',
        '4-hour event'
      ]
    },
    premium: {
      name: 'Premium Tent',
      size: '30x40 ft',
      price: '₹12,000',
      capacity: '100-200 guests',
      features: [
        'Luxury tent design',
        'AC/Heating option',
        'Elegant flooring',
        'Professional lighting',
        '8-hour event',
        'Furniture included'
      ]
    },
    luxury: {
      name: 'Luxury Marquee',
      size: '40x60 ft',
      price: '₹25,000',
      capacity: '200-500 guests',
      features: [
        'Premium marquee tent',
        'Full climate control',
        'Custom decor',
        'Professional staff',
        '24-hour event',
        'Complete catering setup'
      ]
    }
  },
  
  // Services
  services: [
    {
      title: 'Luxury Tents',
      desc: 'High-end marquee tents with elegant interiors',
      icon: '🎪'
    },
    {
      title: 'Party Tents',
      desc: 'Spacious tents perfect for celebrations and gatherings',
      icon: '🎉'
    },
    {
      title: 'Wedding Mandap',
      desc: 'Traditional & modern mandap designs with full decor',
      icon: '💒'
    },
    {
      title: 'Corporate Events',
      desc: 'Professional setup for conferences and exhibitions',
      icon: '🏢'
    },
    {
      title: 'Furniture & Decor',
      desc: 'Complete furniture rentals with interior decoration',
      icon: '🪑'
    },
    {
      title: 'Catering Setup',
      desc: 'Kitchen tents, serving counters, and dining arrangements',
      icon: '🍽️'
    }
  ],
  
  // Features/Why Choose Us
  features: [
    'Professional installation & removal',
    'Weather-resistant premium quality tents',
    'Customizable designs & sizes',
    'On-time delivery guaranteed',
    'Expert event coordination support',
    'Affordable pricing with no hidden charges',
    '24/7 customer support',
    'Insurance coverage included'
  ],
  
  // Testimonials
  testimonials: [
    {
      name: 'Rajesh Kumar',
      event: 'Wedding Reception',
      text: 'TentPro made our wedding reception unforgettable. The tent setup was perfect and the team was very professional!'
    },
    {
      name: 'Priya Sharma',
      event: 'Corporate Event',
      text: 'Excellent service and quality. They delivered on time and the pricing was very reasonable. Highly recommended!'
    },
    {
      name: 'Amit Patel',
      event: 'Birthday Party',
      text: 'Amazing experience! The tent was beautifully decorated and the entire event went smoothly without any issues.'
    }
  ],
  
  // SEO
  seo: {
    title: 'TentPro - Premium Tent House Solutions',
    description: 'Book professional tent house services for weddings, parties, corporate events and more.',
    keywords: 'tent house, tent rental, wedding tent, event tent, party tent, marquee tent'
  }
};

// Color Configuration
export const COLORS = {
  primary: '#2563eb',      // Blue
  secondary: '#4f46e5',    // Indigo
  success: '#16a34a',      // Green
  warning: '#ea580c',      // Orange
  danger: '#dc2626',       // Red
  
  // Gradients
  gradients: {
    primary: 'from-blue-50 to-indigo-50',
    dark: 'from-blue-400 to-indigo-600'
  }
};

// Navigation Links
export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' }
];

// Footer Links
export const FOOTER_LINKS = {
  services: [
    { label: 'Wedding Tents', href: '#' },
    { label: 'Party Tents', href: '#' },
    { label: 'Corporate Events', href: '#' }
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' }
  ]
};
