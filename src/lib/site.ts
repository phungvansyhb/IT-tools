export const DEFAULT_SITE_URL = 'http://localhost:3000';
export const DEFAULT_GITHUB_URL = 'https://github.com/phungvansyhb/IT-tools';

export interface SiteConfig {
  siteUrl: string;
  githubUrl: string;
  supportEmail: string | null;
}

const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeHttpUrl(raw: string | undefined, fallback: string): string {
  const trimmed = raw?.trim();
  if (!trimmed) return fallback;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return fallback;
    }
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return fallback;
  }
}

function normalizeSupportEmail(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed.length > 160) return null;
  if (!SIMPLE_EMAIL_REGEX.test(trimmed)) return null;
  return trimmed;
}

export function resolveSiteConfig(env: {
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_GITHUB_URL?: string;
  NEXT_PUBLIC_SUPPORT_EMAIL?: string;
}): SiteConfig {
  return {
    siteUrl: normalizeHttpUrl(env.NEXT_PUBLIC_SITE_URL, DEFAULT_SITE_URL),
    githubUrl: normalizeHttpUrl(env.NEXT_PUBLIC_GITHUB_URL, DEFAULT_GITHUB_URL),
    supportEmail: normalizeSupportEmail(env.NEXT_PUBLIC_SUPPORT_EMAIL),
  };
}

export function getSiteConfig(): SiteConfig {
  return resolveSiteConfig({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  });
}
