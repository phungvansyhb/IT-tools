import type { PagesDictionary } from '../../types';

export const enPages: PagesDictionary = {
  shared: {
    breadcrumbHome: 'Home',
    lastUpdatedLabel: 'Last updated',
    lastUpdatedDate: '2026-11-19',
    exploreToolsHeading: 'Explore Tool Suites',
    relatedPagesHeading: 'More Information & Policies',
    openFeedbackBtn: 'Send Feedback',
    viewMyFeedbackBtn: 'My Feedback',
    openGithubBtn: 'View on GitHub',
    emailLabel: 'Support Email',
    copyEmailBtn: 'Copy Email',
    copiedEmailBtn: 'Copied Email',
    noEmailNotice:
      'Direct support email is not configured for this deployment. Please use the in-app Feedback Modal or GitHub Issues.',
    privacyFirstBadge: '100% Client-Side Processing',
  },
  about: {
    navLabel: 'About',
    title: 'About OmniDev IT-Tools',
    metaTitle: 'About OmniDev IT-Tools — 100% Client-Side Developer Workspace',
    metaDescription:
      'Learn about OmniDev IT-Tools: 28 browser-native developer utilities across 7 suites built for speed, zero payload uploads, and multilingual accessibility.',
    subtitle:
      'A privacy-first, monochrome Bento workspace bringing 28 essential developer, design, DevOps, and hardware diagnostic utilities directly into your browser.',
    keywords: [
      'about omnidev',
      'client-side developer tools',
      'browser utilities',
      'privacy-first it tools',
      'offline web dev tools',
    ],
    sections: [
      {
        heading: 'Built for Absolute Local Privacy',
        body: 'Developers routinely paste sensitive JWTs, internal configs, SSH/Nginx snippets, hashes, and local media into random online utilities. OmniDev eliminates that risk by executing every transformation strictly inside your browser memory using standard Web APIs.',
        bullets: [
          'HTML5 Canvas & Web Crypto APIs handle image conversion, compression, and SHA-1/256/384/512 hashing locally.',
          'Structured JSON, YAML, CSV, Regex, JWT, OKLCH, Chmod, and Cron engines run synchronously in client memory with zero external API calls.',
          'Network Speed & Latency Test probes strictly hit same-origin `/api/speedtest/*` endpoints (<= 4 MiB per request) with zero payload retention.',
        ],
      },
      {
        heading: '28 Utilities Across 7 Specialized Suites',
        body: 'Every tool is organized in a responsive Bento workspace with instant command palette search (Cmd/Ctrl + K), pinned favorites, saved presets, URL state sharing, and full localization across English, Vietnamese, Japanese, and Simplified Chinese.',
        bullets: [
          'Image Handle (4 tools): Image Converter, Image Compressor, Image to Base64, SVG Optimizer.',
          'File Handle (4 tools): JSON/YAML/CSV Converter, File Hash & Checksum, Magic Bytes Inspector, Line Diff.',
          'Text Handle (5 tools): Case Converter, Regex Tester, JWT Decoder, ID Generator, Text Encoder.',
          'Color Handle (4 tools): Color Space & OKLCH Converter, WCAG Contrast Checker, Palette Generator, CSS Glassmorphism.',
          'Calculators (4 tools): Chmod Calculator, Cron Expression Parser, Unix Timestamp Converter, Unit & Number Base Calculator.',
          'Cheatsheets (3 tools): Git & GitHub CLI, HTTP Status & Headers, Linux / Docker / Regex Reference.',
          'Hardware & Network Diagnostics (4 tools): Keyboard Tester, Mic Tester, Speaker Tester, Self-Hosted Speed Test.',
        ],
      },
      {
        heading: 'Open Architecture & Optional Cloud Sync',
        body: 'By default, OmniDev persists your pinned tools, presets, usage counters, and feedback locally in browser storage. When a maintainer connects Supabase, anonymous workspace preferences (`user_favorites`, `saved_presets`, `tool_metrics`, `tool_ratings`, `feedback_submissions`) can sync seamlessly without requiring user sign-up.',
      },
    ],
  },
  help: {
    navLabel: 'Help & FAQ',
    title: 'Help & Frequently Asked Questions',
    metaTitle: 'Help & FAQ — Keyboard, Audio, Speed Test & Workspace Guide | OmniDev IT-Tools',
    metaDescription:
      'Troubleshooting and usage guide for OmniDev IT-Tools: client-side privacy, Keyboard Capture Mode (Esc × 2), Mic HTTPS permissions, Speaker 35% safe limiter, and Speed Test.',
    subtitle:
      'Practical answers on how OmniDev handles browser permissions, hardware diagnostics, local state persistence, and keyboard shortcuts.',
    keywords: [
      'omnidev help',
      'it tools faq',
      'keyboard capture esc',
      'microphone permission https',
      'speaker setsinkid',
      'speed test self-hosted',
    ],
    sections: [
      {
        heading: 'Getting Started & Workspace Shortcuts',
        body: 'Use the global command palette (`Cmd/Ctrl + K`) from anywhere in the hub to jump straight to any of the 28 tools, 20 DevOps/Git/HTTP cheatsheet snippets, or information pages.',
        bullets: [
          'Click the star icon on any tool card or workspace header to pin it to your sidebar and Favorites drawer.',
          'Use "Save Preset" inside any tool to store reusable inputs locally (or via Supabase sync if configured).',
          'Use "Share State" to encode the current tool parameters into a shareable `?state=` URL.',
        ],
      },
      {
        heading: 'Hardware & Network Diagnostics Notes',
        body: 'Hardware and network diagnostics rely on modern browser Web APIs and may ask for explicit one-time device permissions before accessing local audio hardware.',
        bullets: [
          'Keyboard Tester: Toggle Capture Mode to intercept browser shortcuts like Cmd/Ctrl+K or F5 while testing switches; press `Esc` twice quickly or click Unlock to exit.',
          'Mic Tester: Requires a secure context (`https://` or `http://localhost`) and explicit browser microphone permission; audio never leaves your device.',
          'Speaker Tester: Starts at a hearing-safe `35%` master volume limiter and supports `setSinkId` output routing in Chromium-based browsers.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is my data really processed 100% client-side with zero uploads?',
        answer:
          'Yes. All 24 transformation, file, text, color, calculator, and cheatsheet tools plus Keyboard, Mic, and Speaker diagnostics run exclusively inside your browser memory using Web Crypto, HTML5 Canvas, Web Audio, and MediaRecorder APIs. Only the optional Speed Test exchanges ephemeral pseudo-random bytes with same-origin `/api/speedtest/*` routes.',
      },
      {
        question: 'How do I exit Keyboard Capture Mode in the Keyboard Tester?',
        answer:
          'While Keyboard Capture Mode is active, shortcuts like Tab, F5, and Cmd/Ctrl+K are intercepted so you can test every switch cleanly. Press `Esc` twice within a short interval (`Esc × 2`) or click the Unlock button on screen to release keyboard capture.',
      },
      {
        question: 'Why does the Mic Tester ask for HTTPS or Microphone Permission?',
        answer:
          'Browsers restrict `navigator.mediaDevices.getUserMedia` to secure contexts (`https://` or `localhost`) to protect user hardware. Once you grant permission, OmniDev renders real-time waveform/spectrum levels and optional local playback without uploading any audio stream.',
      },
      {
        question: 'How do Speaker Tester output switching (`setSinkId`) and the 35% limiter work?',
        answer:
          'OmniDev defaults the master gain to a hearing-safe `35%` ceiling so test tones, sweeps, and noise bursts do not startle you or damage headphones. On supported browsers (such as Chrome/Edge with `HTMLMediaElement.setSinkId`), you can also switch audio output devices directly.',
      },
      {
        question: 'How does the Self-Hosted Speed Test work without third-party servers?',
        answer:
          'The Speed Test measures latency, jitter, download, and upload throughput strictly against same-origin `/api/speedtest/ping`, `/api/speedtest/download`, and `/api/speedtest/upload` endpoints. Each payload is capped at `<= 4 MiB` (`4,194,304` bytes), generated ephemerally, and immediately discarded with zero server retention.',
      },
      {
        question: 'Does switching display language wipe my current tool inputs?',
        answer:
          'No. Before navigating to the new locale route (`en`, `vi`, `ja`, `zh`), ToolWorkspace saves a temporary `sessionStorage` draft (`omnidev:draft:<toolId>`) and restores it automatically after the locale switch completes.',
      },
    ],
  },
  privacy: {
    navLabel: 'Privacy Policy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy — Local Storage, Cookies & Optional Supabase | OmniDev IT-Tools',
    metaDescription:
      'Transparent privacy policy for OmniDev IT-Tools: zero third-party analytics, localStorage & sessionStorage usage, strictly necessary omnidev_locale cookie, and optional Supabase sync.',
    subtitle:
      'Complete transparency on what stays in your browser memory, what is saved in local/session storage, and what is synced only when you opt in.',
    keywords: [
      'omnidev privacy policy',
      'client-side privacy',
      'localstorage keys',
      'omnidev_locale cookie',
      'zero tracking developer tools',
    ],
    sections: [
      {
        heading: 'Zero Payload Tracking & Client-Side Execution',
        body: 'OmniDev does not embed third-party ad trackers, behavioral analytics scripts, or telemetry beacons. Inputs pasted into tools (JWT tokens, hashes, regexes, images, JSON/YAML/CSV files, microphone streams) remain inside your local browser runtime.',
      },
      {
        heading: 'Browser Storage (`localStorage` & `sessionStorage`)',
        body: 'To provide a persistent workspace without requiring accounts, OmniDev stores preferences and drafts strictly in your browser storage:',
        bullets: [
          '`localStorage`: `omnidev_client_id`, `omnidev_theme`, `omnidev_locale`, `omnidev_favorites`, `omnidev_pinned_snippets`, `omnidev_presets`, `omnidev_metrics`, `omnidev_speedtest_history`, `omnidev_tool_ratings`, `omnidev_feedback_submissions`, `omnidev_feedback_last_submit_at`, and `omnidev_admin_supabase_auth` (admin console only).',
          '`sessionStorage`: Temporary `omnidev:draft:<toolId>` drafts created right before switching languages so your work-in-progress survives locale navigation.',
        ],
      },
      {
        heading: 'Strictly Necessary Cookie (`omnidev_locale`)',
        body: 'OmniDev sets a single strictly necessary first-party cookie (`omnidev_locale`, `SameSite=Lax`, 1-year expiry) solely to remember your chosen display language (`en`, `vi`, `ja`, `zh`) during SSR/proxy route resolution. No advertising or cross-site tracking cookies are used.',
      },
      {
        heading: 'Optional Supabase Sync, Feedback & Speed Test Endpoints',
        body: 'When Supabase environment variables are configured by the host deployment, OmniDev syncs anonymous workspace records (`user_favorites`, `saved_presets`, `tool_metrics`, `tool_ratings`, `feedback_submissions`) keyed by your random `omnidev_client_id`.',
        bullets: [
          'Feedback Modal: Contact email and diagnostic debug context are strictly opt-in; debug context automatically strips `?state=` query strings and `#hash` fragments so sensitive tool payloads are never sent.',
          'Speed Test (`/api/speedtest/*`): Validates same-origin headers and streams/discards `<= 4 MiB` ephemeral buffers in memory without logging or storing test payloads.',
        ],
      },
    ],
  },
  terms: {
    navLabel: 'Terms of Use',
    title: 'Terms of Use',
    metaTitle: 'Terms of Use — Open-Source Utilities & Diagnostics Disclaimer | OmniDev IT-Tools',
    metaDescription:
      'Terms of Use for OmniDev IT-Tools covering acceptable use, client-side calculation disclaimers, hardware audio safety, and same-origin speed test limits.',
    subtitle:
      'Simple, clear terms governing the use of OmniDev browser utilities, diagnostic tools, and self-hosted endpoints.',
    keywords: [
      'omnidev terms of use',
      'developer tools disclaimer',
      'open source license',
      'speed test fair use',
    ],
    sections: [
      {
        heading: '1. License & Permitted Use',
        body: 'OmniDev IT-Tools is provided as a free, open-source developer utility suite for personal, educational, and commercial engineering workflows. You may inspect, self-host, and customize the codebase in accordance with the repository license.',
      },
      {
        heading: '2. Accuracy & "As-Is" Disclaimer',
        body: 'All tools and calculations are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Always independently verify cryptographic checksums, file permissions (`chmod`), cron schedules, color contrast compliance, and security tokens before deploying to production.',
      },
      {
        heading: '3. Audio Hardware Safety & Permissions',
        body: 'The Speaker Tester includes a default `35%` volume limiter for hearing protection, but you remain responsible for verifying output volume on external amplifiers, studio monitors, and headphones before raising gain or playing high-frequency sweeps.',
      },
      {
        heading: '4. Fair Use of Same-Origin Speed Test APIs',
        body: 'The `/api/speedtest/ping`, `/api/speedtest/download`, and `/api/speedtest/upload` routes are restricted to same-origin browser sessions and capped at `<= 4 MiB` per probe. Automated scraping, cross-origin hotlinking, or intentional bandwidth abuse against hosted instances is prohibited.',
      },
    ],
  },
  contact: {
    navLabel: 'Contact',
    title: 'Contact & Community Support',
    metaTitle: 'Contact & Bug Reports — Feedback Modal, GitHub & Support | OmniDev IT-Tools',
    metaDescription:
      'Reach the OmniDev IT-Tools maintainers: submit bug reports or feature requests via the built-in Feedback Modal, open GitHub issues, or contact support.',
    subtitle:
      'Found an edge case, translation glitch, or have an idea for tool #29? Reach us directly through the channel that fits best.',
    keywords: [
      'contact omnidev',
      'report bug it tools',
      'feature request omnidev',
      'github issues',
    ],
    sections: [
      {
        heading: 'Fastest Way to Report Bugs',
        body: 'Use the built-in Feedback Modal directly inside the app so you can link the exact tool ID and optionally attach sanitized diagnostic context (locale, theme, viewport, and clean route path without `?state=` payloads).',
        bullets: [
          'Track replies and status updates (`Open`, `In Progress`, `Resolved`, `Closed`) inside the "My Feedback" tab.',
          'For open-source contributions, pull requests, or reproducible test cases, open an issue on the GitHub repository.',
        ],
      },
    ],
    channelsHeading: 'Support & Contribution Channels',
    feedbackCardTitle: 'In-App Feedback & Bug Tracker',
    feedbackCardDesc:
      'Submit a bug report, feature request, or general feedback right here and monitor maintainer replies.',
    githubCardTitle: 'GitHub Repository & Issues',
    githubCardDesc:
      'Browse the source code, inspect the AI-DLC documentation, or file reproducible bug reports and PRs.',
    emailCardTitle: 'Direct Support Email',
    emailCardDesc:
      'Reach the deployment maintainer directly via email when configured for this instance.',
  },
};
