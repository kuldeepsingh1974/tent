const navigation = ['Services', 'Pricing', 'Gallery', 'Contact'];

export default function SiteFooter() {
  return (
    <footer id="footer" className="bg-gradient-to-br from-[#FFF9E9] via-[#F7EDF7] to-[#FAD9BB] px-4 py-10 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pt-0">
            <div className="mb-5 flex h-12 items-start">
              <span className="flex h-16 w-52 items-start justify-start sm:w-48">
                <img
                  src="/logo-2.png"
                  alt="Chaman Tent House logo"
                  className="h-full w-full object-contain object-left-top mix-blend-multiply contrast-125 saturate-110"
                />
              </span>
            </div>
            <p className="max-w-sm text-sm font-semibold leading-6 text-black">
              Premium tent, decor, lighting and event setup services for functions in Kangra, Himachal Pradesh.
            </p>
          </div>
          <div>
            <h4 className="mb-5 text-lg font-black">Quick Links</h4>
            <div className="grid gap-3">
              {navigation.map((link) => (
                <a key={link} href={`/#${link.toLowerCase()}`} className="font-semibold text-black hover:text-black">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-5 text-lg font-black">Services</h4>
            <div className="grid gap-3 font-semibold text-black">
              <span>Wedding Tents</span>
              <span>Mandap Decoration</span>
              <span>Corporate Events</span>
              <span>Furniture Rental</span>
            </div>
          </div>
          <div>
            <h4 className="mb-5 text-lg font-black">Contact Info</h4>
            <div className="grid gap-3 font-semibold text-black">
              <span>+91 98054-48091</span>
              <span>Gummer Jawala-Mukhi, Kangra</span>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-white/20 pt-1 text-sm font-semibold leading-6 text-black">
          © 2026 Chaman Tent House. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
