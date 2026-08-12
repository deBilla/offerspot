import fs from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { resolveLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

/**
 * Social preview image generator (1200x630).
 *
 * Runs on the Node runtime rather than the edge so the Noto font binaries can
 * be read from disk. Sinhala and Tamil have no glyphs in the default Satori
 * font, so without loading the matching Noto face every localized preview
 * renders as a row of tofu boxes.
 */
export const runtime = 'nodejs';

const FONT_DIR = path.join(process.cwd(), 'src', 'assets', 'fonts');
const fontCache = new Map<string, Buffer>();

function loadFont(file: string): Buffer {
  const cached = fontCache.get(file);
  if (cached) return cached;
  const buffer = fs.readFileSync(path.join(FONT_DIR, file));
  fontCache.set(file, buffer);
  return buffer;
}

/** Latin always loads; the Indic face is added only for the locale that needs it. */
function fontsFor(locale: Locale) {
  const fonts = [
    { name: 'Noto Sans', data: loadFont('NotoSans-400.ttf'), weight: 400 as const, style: 'normal' as const },
    { name: 'Noto Sans', data: loadFont('NotoSans-700.ttf'), weight: 700 as const, style: 'normal' as const },
  ];

  if (locale === 'si') {
    fonts.push(
      { name: 'Noto Sans Sinhala', data: loadFont('NotoSansSinhala-400.ttf'), weight: 400, style: 'normal' },
      { name: 'Noto Sans Sinhala', data: loadFont('NotoSansSinhala-700.ttf'), weight: 700, style: 'normal' },
    );
  }

  if (locale === 'ta') {
    fonts.push(
      { name: 'Noto Sans Tamil', data: loadFont('NotoSansTamil-400.ttf'), weight: 400, style: 'normal' },
      { name: 'Noto Sans Tamil', data: loadFont('NotoSansTamil-700.ttf'), weight: 700, style: 'normal' },
    );
  }

  return fonts;
}

/*
 * Latin face first in every stack. Satori resolves fallbacks per glyph, so the
 * Indic face still supplies its own script while Latin runs (bank names, "20%",
 * merchant names) keep Noto Sans' metrics. With the Indic face first, Satori
 * measured Latin against it and produced visibly stretched letter-spacing.
 */
const fontFamily: Record<Locale, string> = {
  en: '"Noto Sans"',
  si: '"Noto Sans", "Noto Sans Sinhala"',
  ta: '"Noto Sans", "Noto Sans Tamil"',
};

const bankAccents: Record<string, string> = {
  "People's Bank": '#2563eb',
  'Commercial Bank': '#dc2626',
  HNB: '#f59e0b',
  'Bank of Ceylon': '#ca8a04',
  'Sampath Bank': '#059669',
  'DFCC Bank': '#7c3aed',
  HSBC: '#e11d48',
  'Seylan Bank': '#0891b2',
};

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * How loudly the expiry is drawn. The caller sends the day count rather than a
 * colour so the thresholds live here with the rest of the styling, and the
 * wording stays with the caller alongside every other localized string.
 */
function urgencyOf(days: number | null): { bg: string; fg: string; rail: string } {
  if (days === null) return { bg: 'rgba(248,250,252,0.12)', fg: '#e2e8f0', rail: '#334155' };
  if (days <= 2) return { bg: '#ef4444', fg: '#ffffff', rail: '#ef4444' };
  if (days <= 7) return { bg: '#f59e0b', fg: '#1c1917', rail: '#f59e0b' };
  return { bg: 'rgba(94,234,212,0.16)', fg: '#5eead4', rail: '#14b8a6' };
}

/**
 * The perforation between the poster and its tear-off stub. Satori has no
 * clip-path and no repeating-linear-gradient, so the dashes are real nodes.
 */
function Perforation({ color }: { color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 2,
        height: '100%',
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      {Array.from({ length: 19 }, (_, i) => (
        <div key={i} style={{ display: 'flex', width: 2, height: 14, backgroundColor: color, opacity: 0.5 }} />
      ))}
    </div>
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = resolveLocale(searchParams.get('lang') ?? undefined);
    const dict = getDictionary(locale);

    const title = truncate(searchParams.get('title') || dict.pages.homeTitle, 110);
    const subtitle = searchParams.get('subtitle') ? truncate(searchParams.get('subtitle')!, 60) : null;
    const badge = searchParams.get('badge') ? truncate(searchParams.get('badge')!, 32) : null;
    // Pre-formatted and already localized by the caller ("20% OFF", "20% වට්ටමක්").
    const discount = searchParams.get('discount') ? truncate(searchParams.get('discount')!, 28) : null;
    const bank = searchParams.get('bank') ? truncate(searchParams.get('bank')!, 32) : null;
    // Pre-formatted and already localized, like `discount` ("3 days left").
    const expiry = searchParams.get('expiry') ? truncate(searchParams.get('expiry')!, 26) : null;

    // Drives the expiry colour only. Absent for undated offers and hub pages,
    // which still show their expiry text — just without the alarm.
    const daysRaw = searchParams.get('days');
    const days = daysRaw !== null && /^\d+$/.test(daysRaw) ? Number(daysRaw) : null;
    const urgency = urgencyOf(days);

    const accent = (bank && bankAccents[bank]) || '#14b8a6';
    const family = fontFamily[locale];

    /*
     * Offers get a voucher layout: poster on the left, tear-off stub on the
     * right carrying the discount and the deadline. Hub and article previews
     * have neither, so they keep the full-width poster and the stub is dropped
     * rather than rendered empty.
     */
    const hasStub = Boolean(discount || expiry);
    // The stub takes 340px, so titles beside one need to break earlier.
    const titleSize = hasStub
      ? title.length > 64 ? 40 : title.length > 40 ? 48 : 56
      : title.length > 78 ? 46 : title.length > 48 ? 56 : 66;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#0b1120',
            backgroundImage: `radial-gradient(1000px 520px at 88% -10%, ${accent}55 0%, transparent 62%), radial-gradient(760px 460px at -8% 108%, #1d4ed855 0%, transparent 60%)`,
            fontFamily: family,
            color: '#f8fafc',
          }}
        >
        {/* Deadline rail: a full-height edge in the urgency colour. The first
            thing read at thumbnail size, where text is already illegible. */}
        <div style={{ display: 'flex', width: 12, height: '100%', backgroundColor: urgency.rail }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            /*
             * Explicit, not flexGrow. Satori sizes a flex child to its content
             * before honouring a sibling's flexShrink:0, so a long unwrapped
             * title widens this column and shoves the stub off the canvas.
             * 1200 = 12 rail + 846 poster + 2 perforation + 340 stub.
             */
            width: hasStub ? 846 : 1188,
            height: '100%',
            padding: '52px 56px',
          }}
        >
          {/* Header: brand mark on the left, bank pill on the right */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {/* minWidth:0 + marginRight keep the wider Tamil and Sinhala brand
                names from running into the bank pill on the narrower poster. */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, marginRight: 20 }}>
              <div
                style={{
                  display: 'flex',
                  flexShrink: 0,
                  width: 56,
                  height: 40,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%)',
                  marginRight: 18,
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ display: 'flex', width: '100%', height: 9, backgroundColor: 'rgba(15,23,42,0.55)' }} />
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>{dict.siteName}</div>
            </div>

            {bank && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#f8fafc',
                  backgroundColor: accent,
                  padding: '10px 26px',
                  borderRadius: 999,
                }}
              >
                {bank}
              </div>
            )}
          </div>

          {/* Body: the offer itself */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {subtitle && (
              <div
                style={{
                  display: 'flex',
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#5eead4',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: 16,
                }}
              >
                {subtitle}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: -1,
                // Must be bounded or the text node sets the column's width.
                maxWidth: hasStub ? 734 : 1010,
              }}
            >
              {title}
            </div>

            {/* Without a stub the discount has nowhere else to go. */}
            {discount && !hasStub && (
              <div style={{ display: 'flex', marginTop: 30 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 44,
                    fontWeight: 700,
                    color: '#052e16',
                    backgroundColor: '#4ade80',
                    padding: '12px 34px',
                    borderRadius: 16,
                  }}
                >
                  {discount}
                </div>
              </div>
            )}
          </div>

          {/* Footer: category badge and the domain */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {/* minWidth:0 lets this side shrink instead of overrunning the domain. */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, marginRight: 24 }}>
              {badge && (
                <div
                  style={{
                    display: 'flex',
                    flexShrink: 0,
                    fontSize: 22,
                    color: '#e2e8f0',
                    backgroundColor: 'rgba(248,250,252,0.12)',
                    border: '1px solid rgba(248,250,252,0.22)',
                    padding: '8px 22px',
                    borderRadius: 999,
                    marginRight: 16,
                  }}
                >
                  {badge}
                </div>
              )}
              {/*
               * Only shown when there is no category badge. Satori does not
               * reliably clip an overflowing nowrap text node, and Tamil glyphs
               * are wide enough that badge + tagline + domain ran past the right
               * padding. Dropping the tagline is deterministic; truncating by
               * character count is not, because character width varies by script.
               */}
              {!badge && subtitle !== dict.tagline && (
                <div style={{ display: 'flex', fontSize: 22, color: '#94a3b8' }}>{truncate(dict.tagline, 64)}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexShrink: 0, fontSize: 22, fontWeight: 700, color: '#5eead4' }}>
              cardpromotions.org
            </div>
          </div>
        </div>

        {hasStub && (
          <>
            <Perforation color="#94a3b8" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                width: 340,
                height: '100%',
                padding: '52px 32px',
                backgroundColor: 'rgba(248,250,252,0.06)',
              }}
            >
              {/* The number is the reason anyone clicks, so it is the largest
                  thing on the card and survives being thumbnailed in a feed. */}
              {discount && (
                <div
                  style={{
                    display: 'flex',
                    textAlign: 'center',
                    fontSize: discount.length > 12 ? 48 : discount.length > 8 ? 60 : 76,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: -2,
                    color: '#4ade80',
                  }}
                >
                  {discount}
                </div>
              )}

              {expiry && (
                <div
                  style={{
                    display: 'flex',
                    textAlign: 'center',
                    fontSize: 26,
                    fontWeight: 700,
                    color: urgency.fg,
                    backgroundColor: urgency.bg,
                    padding: '12px 24px',
                    borderRadius: 999,
                    marginTop: discount ? 28 : 0,
                  }}
                >
                  {expiry}
                </div>
              )}
            </div>
          </>
        )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontsFor(locale),
        headers: {
          // Previews are pure functions of the query string; let the CDN and the
          // social scrapers hold on to them.
          'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
        },
      },
    );
  } catch (error) {
    console.error('Failed to generate OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
