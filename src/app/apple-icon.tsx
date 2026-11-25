import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
        }}
      >
        <div
          style={{
            width: '156px',
            height: '156px',
            borderRadius: '36px',
            backgroundColor: '#09090b',
            border: '4px solid #27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
            <path
              d="M17 21L29 32L17 43"
              stroke="#f4f4f5"
              strokeWidth="5.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="33" y="40" width="15" height="5" rx="2" fill="#10b981" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
