export const metadata = {
  title: "Terms & Conditions | Cinemania",
  description: "Terms and conditions for using the Cinemania platform.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Terms & <span className="text-[#FF00FF]">Conditions</span>
          </h1>
          <p className="mt-4 text-zinc-400">Last updated: April 29, 2026</p>
        </div>

        <div className="space-y-10 text-zinc-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Cinemania, you accept and agree to be bound
              by the terms and provision of this agreement. In addition, when
              using this platform&apos;s particular services (such as submitting
              reviews, logging watch history, or purchasing premium
              subscriptions), you shall be subject to any posted guidelines or
              rules applicable to such services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              2. User Accounts & Subscriptions
            </h2>
            <p>
              To use certain features of the platform, you must register for an
              account. You agree to provide accurate, current, and complete
              information during the registration process. If you subscribe to
              our Basic, Pro, or Premium tiers, you agree to pay the applicable
              fees and taxes. Subscriptions automatically renew unless canceled
              prior to the renewal date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              3. User-Generated Content
            </h2>
            <p>
              Cinemania allows users to post reviews, comments, and curate
              watchlists. You retain all rights to your content, but you grant
              Cinemania a worldwide, non-exclusive, royalty-free license to use,
              reproduce, and display your content in connection with the
              service. We reserve the right to remove any content that violates
              our community guidelines, including hate speech, spoilers without
              proper tags, or targeted harassment.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              4. Termination
            </h2>
            <p>
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
