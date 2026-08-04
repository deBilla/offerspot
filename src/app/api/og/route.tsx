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

    const accent = (bank && bankAccents[bank]) || '#14b8a6';
    // Long titles need a smaller face to stay inside three lines.
    const titleSize = title.length > 78 ? 46 : title.length > 48 ? 56 : 66;
    const family = fontFamily[locale];

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '56px 64px',
            backgroundColor: '#0b1120',
            backgroundImage: `radial-gradient(1000px 520px at 88% -10%, ${accent}55 0%, transparent 62%), radial-gradient(760px 460px at -8% 108%, #1d4ed855 0%, transparent 60%)`,
            fontFamily: family,
            color: '#f8fafc',
          }}
        >
          {/* Header: brand mark on the left, bank pill on the right */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
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
                maxWidth: 1010,
              }}
            >
              {title}
            </div>

            {discount && (
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
