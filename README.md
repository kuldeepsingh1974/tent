# TentPro - Premium Tent House Landing Page

A modern, responsive landing page for a tent house business built with Next.js and Tailwind CSS.

## Features

- 🎨 Modern, professional design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Built with Next.js for optimal performance
- 🎯 Conversion-focused layout
- 💨 Tailwind CSS for styling
- 🚀 Fast load times
- 📊 Optimized SEO

## Sections Included

1. **Navigation** - Fixed header with navigation links
2. **Hero Section** - Eye-catching introduction
3. **Services** - 6 key service offerings
4. **Features** - Why choose us section
5. **Pricing** - 3-tier pricing plans
6. **Gallery** - Portfolio of past events
7. **Testimonials** - Client reviews
8. **Contact** - Contact form and information
9. **Footer** - Links and additional info

## Project Structure

```
tent-pro/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles with Tailwind
├── landing.tsx             # Main landing page component
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd tent-pro
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Customization

### Update Business Information

Edit these sections in `landing.tsx`:

- **Contact Details**: Line 370-390 (Phone, Email, Address)
- **Business Name**: Line 22 (Change "TentPro" to your name)
- **Pricing**: Line 270-320 (Modify prices and features)
- **Services**: Line 135-165 (Add/remove services)

### Colors

Modify Tailwind colors in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#2563eb',    // Change primary color
      secondary: '#4f46e5',  // Change secondary color
    },
  },
}
```

### Font

To change fonts, edit `app/layout.tsx`:

```tsx
import { YourFont } from 'next/font/google';
const font = YourFont({ subsets: ['latin'] });
```

## Components Used

- **Lucide React Icons**: [lucide-react](https://lucide.dev) for beautiful icons

## Hosting Options

### Recommended Platforms

1. **Vercel** (recommended for Next.js)
   - Deploy directly from GitHub
   - Zero configuration
   - [https://vercel.com](https://vercel.com)

2. **Netlify**
   - Easy deployment
   - Free SSL
   - [https://netlify.com](https://netlify.com)

3. **AWS Amplify**
   - Scalable
   - Multiple hosting options
   - [https://aws.amazon.com/amplify](https://aws.amazon.com/amplify)

### Deploy to Vercel (Quick Start)

1. Push code to GitHub
2. Connect Vercel to your GitHub account
3. Click "Import Project"
4. Vercel auto-detects Next.js and deploys

## SEO & Meta Tags

Edit meta information in `app/page.tsx`:

```tsx
export const metadata = {
  title: 'Your Title',
  description: 'Your description',
  keywords: 'your, keywords',
};
```

## Performance Tips

- Images are optimized with Next.js Image component
- CSS is minified and optimized
- Code splitting is automatic
- API routes available for backend integration

## Adding Email Notifications

To add backend contact form handling:

1. Create `app/api/contact/route.ts`:

```typescript
export async function POST(request: Request) {
  const data = await request.json();
  
  // Send email using nodemailer, SendGrid, etc.
  
  return Response.json({ success: true });
}
```

2. Update form in `landing.tsx` to call the API

## License

MIT License - Feel free to use this for your business

## Support

For questions or customizations, contact: support@tentpro.com

---

**Happy Tent Booking! 🎪**
