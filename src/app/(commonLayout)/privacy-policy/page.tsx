export const metadata = {
  title: "Privacy Policy | Cinemania",
  description: "How Cinemania collects and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy <span className="text-[#FF00FF]">Policy</span>
          </h1>
          <p className="mt-4 text-zinc-400">Last updated: April 29, 2026</p>
        </div>

        <div className="space-y-10 text-zinc-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us when you create
              an account, update your profile, post reviews, or log your watch
              history. This includes your name, email address, password, profile
              picture, and all interaction data within the multiverse of
              Cinemania.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect to provide, maintain, and
              improve our services. Specifically, we use your watch history and
              interactions to generate personalized movie recommendations,
              calculate achievement badges, and populate the trending algorithms
              on the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              3. Information Sharing
            </h2>
            <p>
              As a social platform, your profile, reviews, and public watchlists
              are visible to other users. You can adjust the visibility of
              certain activities in your privacy settings. We do not sell your
              personal data to third parties. Payment processing is securely
              handled by Stripe, and we do not store your raw credit card
              information on our servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              4. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              personal information, including encrypted password storage and
              secure database protocols. However, no method of transmission over
              the Internet or electronic storage is 100% secure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
