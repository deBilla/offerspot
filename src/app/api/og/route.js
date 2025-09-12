// app/api/og/route.js
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const bankColors = {
  "People's Bank": '#1e40af',
  "Commercial Bank": '#dc2626', 
  "HNB": '#f59e0b',
  "Bank of Ceylon": '#eab308',
  "Sampath Bank": '#059669',
  "DFCC Bank": '#7c3aed'
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Card Promotion';
    const bank = searchParams.get('bank') || 'Sri Lanka';
    const discount = searchParams.get('discount') || '';
    const category = searchParams.get('category') || '';
    
    const bankColor = bankColors[bank] || '#6366f1';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            backgroundImage: `linear-gradient(135deg, ${bankColor}15 0%, ${bankColor}25 100%)`,
            fontFamily: 'system-ui',
          }}
        >
          {/* Header with logo area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: bankColor,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              💳 Card Promotions LK
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '900px',
              textAlign: 'center',
              padding: '0 60px',
            }}
          >
            {/* Bank name */}
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: bankColor,
                marginBottom: '20px',
                backgroundColor: `${bankColor}15`,
                padding: '8px 24px',
                borderRadius: '25px',
                border: `2px solid ${bankColor}30`,
              }}
            >
              {bank}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                lineHeight: '1.2',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {title.length > 80 ? title.substring(0, 80) + '...' : title}
            </div>

            {/* Category and Discount */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              {category && (
                <div
                  style={{
                    fontSize: '20px',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '6px 18px',
                    borderRadius: '15px',
                  }}
                >
                  📂 {category}
                </div>
              )}
              {discount && (
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#059669',
                    backgroundColor: '#10b98115',
                    padding: '8px 20px',
                    borderRadius: '15px',
                    border: '2px solid #10b98130',
                  }}
                >
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                fontSize: '18px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <span>🇱🇰 Sri Lanka's Best Card Offers</span>
              <span>•</span>
              <span>💰 Save More Today</span>
            </div>
          </div>

          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: `${bankColor}10`,
              border: `3px solid ${bankColor}20`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: `${bankColor}15`,
              border: `2px solid ${bankColor}25`,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log('Error generating OG image:', e);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}