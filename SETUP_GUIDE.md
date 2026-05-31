# Quick Start Guide - TentPro Landing Page

## 🚀 Setup in 3 Minutes

### Step 1: Install Dependencies
```bash
cd /Users/apple/Desktop/tent-pro
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Visit: **http://localhost:3000**

---

## 📝 Customization Quick Tips

### Change Company Name
**File:** `landing.tsx` → Line 22
```jsx
<span className="text-xl font-bold text-gray-900">TentPro</span>
```

### Update Phone Number
**File:** `landing.tsx` → Line 390
```jsx
<p className="text-blue-100">+91 98765 43210</p>
```

### Update Email
**File:** `landing.tsx` → Line 398
```jsx
<p className="text-blue-100">info@tentpro.com</p>
```

### Change Prices
**File:** `landing.tsx` → Lines 270-320
```jsx
<span className="text-4xl font-bold">₹12,000</span>
```

### Modify Services
**File:** `landing.tsx` → Lines 135-165
Add or remove service items in the services grid

### Change Colors
**File:** `tailwind.config.js`
```js
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
}
```

---

## 🎨 Design Sections

| Section | Location | Purpose |
|---------|----------|---------|
| Navigation | Top fixed | Menu & booking button |
| Hero | Lines 50-95 | Main headline & CTA |
| Services | Lines 112-180 | 6 service offerings |
| Features | Lines 182-250 | Why choose us |
| Pricing | Lines 268-370 | 3 pricing tiers |
| Gallery | Lines 372-410 | Portfolio images |
| Testimonials | Lines 412-460 | Client reviews |
| Contact | Lines 462-540 | Contact form & info |
| Footer | Lines 542-600 | Links & copyright |

---

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts
```

### Option 2: Build & Deploy Manually
```bash
npm run build
npm start
```

---

## 📱 Responsive Design
- ✅ Mobile first
- ✅ Tablet optimized
- ✅ Desktop HD ready
- ✅ All breakpoints covered

---

## 🔧 Important Files

| File | Purpose |
|------|---------|
| `landing.tsx` | Main component |
| `app/page.tsx` | Home page |
| `tailwind.config.js` | Styling config |
| `package.json` | Dependencies |
| `README.md` | Full documentation |

---

## ✅ Features Included

- [x] Responsive design
- [x] Fast loading
- [x] SEO optimized
- [x] Contact form ready
- [x] Pricing plans
- [x] Testimonials
- [x] Mobile navigation
- [x] Google Maps ready
- [x] Social share ready

---

## 🆘 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind styles not appearing?**
```bash
npm run dev
# Wait 10-15 seconds for Tailwind to compile
```

---

## 📞 Need Help?

Refer to:
- Full documentation: `README.md`
- Next.js docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev

---

**You're all set! Happy coding! 🎪**
