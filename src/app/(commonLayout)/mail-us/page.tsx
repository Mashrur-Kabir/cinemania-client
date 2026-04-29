import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Mail Us | Cinemania",
  description: "Contact the Cinemania support and development team.",
};

export default function MailUsPage() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 font-heading">
              Get in <span className="text-[#FF00FF]">Touch</span>
            </h1>
            <p className="text-zinc-400 mb-12 leading-relaxed">
              Have a feature request, experiencing a bug, or just want to talk
              cinema? Drop us a line. Our support team operates in the shadows
              but replies at the speed of light.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2D0B3E] border border-[#FF00FF]/30">
                  <Mail className="h-5 w-5 text-[#FF00FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Email Us</p>
                  <p className="text-zinc-400 text-sm">support@cinemania.app</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2D0B3E] border border-[#FF00FF]/30">
                  <Phone className="h-5 w-5 text-[#FF00FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Direct Line
                  </p>
                  <p className="text-zinc-400 text-sm">+880 1700-000000</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2D0B3E] border border-[#FF00FF]/30">
                  <MapPin className="h-5 w-5 text-[#FF00FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Studio Location
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Ashulia, Dhaka Division, Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-8">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Transmission Designation (Name)
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-2 block w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-[#FF00FF] focus:ring-1 focus:ring-[#FF00FF] focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Comms Link (Email)
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 block w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-[#FF00FF] focus:ring-1 focus:ring-[#FF00FF] focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-2 block w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-[#FF00FF] focus:ring-1 focus:ring-[#FF00FF] focus:outline-none transition-colors"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="button"
                className="w-full bg-[#FF00FF] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#d900d9] transition-all hover:drop-shadow-[0_0_12px_rgba(255,0,255,0.6)]"
              >
                Send Transmission
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
