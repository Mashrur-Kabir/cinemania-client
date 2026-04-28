export const metadata = {
  title: "Cookie Policy | Cinemania",
  description: "Information about how Cinemania uses cookies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Cookie <span className="text-[#FF00FF]">Policy</span>
          </h1>
          <p className="mt-4 text-zinc-400">Last updated: April 29, 2026</p>
        </div>

        <div className="space-y-10 text-zinc-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small pieces of text sent to your web browser by a
              website you visit. A cookie file is stored in your web browser and
              allows the Service or a third-party to recognize you and make your
              next visit easier and the Service more useful to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              2. How Cinemania Uses Cookies
            </h2>
            <p>
              When you use and access the Cinemania platform, we may place a
              number of cookies files in your web browser. We use cookies for
              the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong className="text-white">Essential Cookies:</strong> We
                use essential cookies to authenticate users and prevent
                fraudulent use of user accounts. These are critical for your
                secure login sessions.
              </li>
              <li>
                <strong className="text-white">Preferences Cookies:</strong> To
                remember information that changes the way the platform behaves
                or looks, such as your preferred theme or default sorting
                options.
              </li>
              <li>
                <strong className="text-white">Analytics Cookies:</strong> We
                use analytics to track information on how the platform is used
                so that we can make improvements and fix bugs.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              3. Your Choices Regarding Cookies
            </h2>
            <p>
              If you&apos;d like to delete cookies or instruct your web browser
              to delete or refuse cookies, please visit the help pages of your
              web browser. Please note, however, that if you delete cookies or
              refuse to accept them, you might not be able to use all of the
              features we offer, you may not be able to store your preferences,
              and some of our pages might not display properly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
