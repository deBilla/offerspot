import JsonLd from './JsonLd';
import type { Locale } from '@/i18n/config';
import { getPhrases, type HubCopy } from '@/i18n/hub-copy';

/**
 * Renders hub-page prose, FAQs and (optionally) a how-to.
 *
 * The FAQ and HowTo JSON-LD emitted here mirrors the text rendered directly
 * beside it. Google requires structured data to match visible content, and
 * marking up copy the user cannot see is a spam violation — so the two are
 * generated from the same object rather than maintained separately.
 *
 * A caveat worth recording: since Google's 2023 change, FAQ rich results are
 * limited to well-known government and health sites and HowTo rich results
 * were retired. This markup is therefore unlikely to produce a SERP feature
 * here. It is kept because it is accurate, costs nothing, and helps machine
 * readers (including AI answer engines) parse the page. The ranking value is
 * in the visible copy below, not the markup.
 */
export default function HubContent({ locale, copy }: { locale: Locale; copy: HubCopy }) {
  const phrases = getPhrases(locale);
  const hasIntro = copy.intro.length > 0;
  const hasFaqs = copy.faqs.length > 0;

  if (!hasIntro && !hasFaqs) return null;

  const faqJsonLd = hasFaqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: copy.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  const howToJsonLd = copy.howTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: copy.howTo.name,
        step: copy.howTo.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      }
    : null;

  return (
    <>
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {howToJsonLd && <JsonLd data={howToJsonLd} />}

      <div className="mt-12 border-t border-gray-200 pt-8">
        {hasIntro && (
          <div className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-gray-600">
            {copy.intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {copy.howTo && (
          <section className="mt-10 max-w-3xl">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{phrases.howToHeading}</h2>
            <ol className="space-y-4">
              {copy.howTo.steps.map((step, index) => (
                <li key={step.name} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.name}</h3>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-gray-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {hasFaqs && (
          <section className="mt-10 max-w-3xl">
            <h2 className="mb-4 text-lg font-bold text-gray-800">{phrases.faqHeading}</h2>
            <dl className="space-y-4">
              {copy.faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <dt className="font-semibold text-gray-900">{faq.question}</dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </>
  );
}
