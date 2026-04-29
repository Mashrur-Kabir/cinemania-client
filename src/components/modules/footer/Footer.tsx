import Link from "next/link";
import { Mail } from "lucide-react";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/constants/footer-constants";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-[#FF00FF]/20 bg-black pt-16 sm:pt-24">
      {/* Sleek Deep Plum Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D0B3E]/10 to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand & Newsletter Section */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl font-bold tracking-widest text-white font-heading">
                CINE<span className="text-[#FF00FF]">MANIA</span>
              </span>
            </Link>
            <p className="text-sm leading-6 text-zinc-400 max-w-xs">
              Explore the multiverse of cinema. Track, review, and share your
              favorite moments with a community of film lovers.
            </p>

            {/* Newsletter Input */}
            <div className="relative mt-6 flex max-w-md items-center gap-x-4">
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="email"
                  placeholder="Subscribe for updates"
                  className="w-full rounded-none border border-zinc-800 bg-zinc-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#FF00FF] focus:outline-none focus:ring-1 focus:ring-[#FF00FF]"
                />
              </div>
              <button className="flex-none rounded-none bg-[#FF00FF] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#d900d9] hover:drop-shadow-[0_0_12px_rgba(255,0,255,0.6)]">
                Join
              </button>
            </div>
          </div>

          {/* Links Section */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {FOOTER_LINKS.slice(0, 2).map((section) => (
                <div key={section.title} className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white tracking-wider">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="group relative inline-flex items-center text-sm leading-6 text-zinc-400 transition-colors hover:text-[#FF00FF]"
                        >
                          <span className="relative overflow-hidden">
                            {item.label}
                            {/* Animated Underline */}
                            <span className="absolute bottom-0 left-0 h-[1px] w-full -translate-x-full bg-[#FF00FF] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              {FOOTER_LINKS.slice(2, 3).map((section) => (
                <div key={section.title} className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white tracking-wider">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="group relative inline-flex items-center text-sm leading-6 text-zinc-400 transition-colors hover:text-[#FF00FF]"
                        >
                          <span className="relative overflow-hidden">
                            {item.label}
                            <span className="absolute bottom-0 left-0 h-[1px] w-full -translate-x-full bg-[#FF00FF] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Socials & Copyright */}
        <div className="mt-16 border-t border-zinc-800/80 pt-8 sm:mt-20 lg:flex lg:items-center lg:justify-between">
          <div className="flex gap-x-6 lg:order-2">
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-zinc-500 transition-colors hover:text-[#FF00FF]"
                >
                  <span className="sr-only">{item.label}</span>
                  <Icon
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
          <p className="mt-8 text-xs leading-5 text-zinc-500 lg:order-1 lg:mt-0">
            &copy; {new Date().getFullYear()} Cinemania, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
