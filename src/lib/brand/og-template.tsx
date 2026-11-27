import React from 'react';
import { getSiteConfig } from '@/lib/site';

const FEATURE_PILLS = [
  '100% Client-Side',
  '7 Categories',
  '4 Locales',
  'Diagnostics & Speed Test',
] as const;

export function BrandOgTemplate() {
  const siteHost = new URL(getSiteConfig().siteUrl).host;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        position: 'relative',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top badge bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          {/* Terminal Mark >_ */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              backgroundColor: '#18181b',
              border: '2px solid #27272a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
              <path
                d="M15 20L29 32L15 44"
                stroke="#f4f4f5"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="33" y="40" width="16" height="5.5" rx="2.5" fill="#10b981" />
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              borderRadius: '999px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              color: '#10b981',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            ZERO-EXFILTRATION WORKSPACE
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 18px',
            borderRadius: '999px',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            color: '#a1a1aa',
            fontSize: '20px',
            fontWeight: 500,
          }}
        >
          EN • VI • JA • ZH
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '980px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '68px',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#f4f4f5',
          }}
        >
          TienIchDev / IT-Tools Hub
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '30px',
            lineHeight: 1.38,
            color: '#a1a1aa',
          }}
        >
          28 Privacy-First Browser-Native Developer &amp; Diagnostic Tools
        </div>
      </div>

      {/* Bottom Feature Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '24px',
          borderTop: '1px solid #27272a',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {FEATURE_PILLS.map((pill) => (
            <div
              key={pill}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                color: '#f4f4f5',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {pill}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#10b981',
            fontSize: '20px',
            fontWeight: 700,
          }}
        >
          <span>&gt;_</span>
          <span style={{ color: '#a1a1aa', fontWeight: 500 }}>{siteHost}</span>
        </div>
      </div>
    </div>
  );
}
