import { DEFAULT_LOCALE, localePath, stripLocalePrefix, type Locale } from '@/i18n/config';
import type { CategoryId } from '@/i18n/types';
import { sanitizePathname } from '@/lib/feedback/debug-context';
import {
  getLocalizedInfoPages,
  INFO_PAGES,
  type LocalizedInfoPage,
} from '@/lib/info/pages';
import {
  CATEGORIES,
  getCategoryBySlug,
  getLocalizedCategories,
  getLocalizedTools,
  TOOLS,
  type CategoryDefinition,
  type ToolDefinition,
} from '@/lib/tools/registry';

export type NotFoundContext = 'tool' | 'category' | 'general';

export type NotFoundSuggestionKind = 'tool' | 'category' | 'page';

export interface AnalyzedNotFoundPath {
  rawPath: string;
  cleanPath: string;
  strippedPath: string;
  segments: string[];
  context: NotFoundContext;
  categorySlugCandidate: CategoryId | null;
  slugCandidate: string | null;
  tokens: string[];
}

export interface NotFoundSuggestion {
  kind: NotFoundSuggestionKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  score: number;
  categoryId?: CategoryId;
}

export type LocalizedCategoryMeta = CategoryDefinition;
export type LocalizedToolMeta = ToolDefinition;
export type LocalizedInfoPageMeta = LocalizedInfoPage;

export interface NotFoundFallbackData {
  matchedCategory: LocalizedCategoryMeta | null;
  categoryTools: LocalizedToolMeta[];
  featuredTools: LocalizedToolMeta[];
  categories: LocalizedCategoryMeta[];
  infoPages: LocalizedInfoPageMeta[];
}

const STOPWORDS = new Set([
  'tools',
  'tool',
  'categories',
  'category',
  'admin',
  'api',
  'page',
  'pages',
]);

const ALIAS_MAP: Record<string, { kind: NotFoundSuggestionKind; id: string }> = {
  faq: { kind: 'page', id: 'help' },
  faqs: { kind: 'page', id: 'help' },
  docs: { kind: 'page', id: 'help' },
  doc: { kind: 'page', id: 'help' },
  guide: { kind: 'page', id: 'help' },
  tos: { kind: 'page', id: 'terms' },
  terms: { kind: 'page', id: 'terms' },
  'terms-of-service': { kind: 'page', id: 'terms' },
  'privacy-policy': { kind: 'page', id: 'privacy' },
  privacypolicy: { kind: 'page', id: 'privacy' },
  'about-us': { kind: 'page', id: 'about' },
  aboutus: { kind: 'page', id: 'about' },
  'contact-us': { kind: 'page', id: 'contact' },
  contactus: { kind: 'page', id: 'contact' },
  support: { kind: 'page', id: 'contact' },
};

const CATEGORY_ALIAS_MAP: Record<string, CategoryId> = {
  security: 'text',
  crypto: 'text',
  hardware: 'diagnostics',
  network: 'diagnostics',
  device: 'diagnostics',
  devices: 'diagnostics',
  audio: 'diagnostics',
  speed: 'diagnostics',
  images: 'image',
  img: 'image',
  files: 'file',
  data: 'file',
  colors: 'color',
  colour: 'color',
  calc: 'calculators',
  calculator: 'calculators',
  cheatsheet: 'cheatsheets',
  reference: 'cheatsheets',
};

const EN_TOOL_MAP = new Map<string, ToolDefinition>(TOOLS.map((tool) => [tool.id, tool]));
const EN_CATEGORY_MAP = new Map<CategoryId, CategoryDefinition>(
  CATEGORIES.map((category) => [category.slug, category])
);
const EN_INFO_MAP = new Map<string, LocalizedInfoPage>(
  getLocalizedInfoPages('en').map((page) => [page.slug, page])
);

const FEATURED_TOOL_IDS = [
  'jwt-decoder',
  'data-converter',
  'regex-tester',
  'color-converter',
  'cron-calculator',
  'speed-test',
] as const;

function normalizeText(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function splitTokens(value: string): string[] {
  return normalizeText(value)
    .split('-')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function safeDecodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    const chA = a.charCodeAt(i - 1);
    for (let j = 1; j <= b.length; j += 1) {
      const cost = chA === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) {
      prev[j] = curr[j];
    }
  }

  return prev[b.length];
}

function normalizedSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 0;
  const dist = levenshteinDistance(a, b);
  return Math.max(0, 1 - dist / maxLen);
}

function isRestrictedPath(href: string): boolean {
  const lower = href.toLowerCase();
  return (
    lower === '/admin' ||
    lower.startsWith('/admin/') ||
    lower.includes('/admin/') ||
    lower.endsWith('/admin') ||
    lower === '/api' ||
    lower.startsWith('/api/') ||
    lower.includes('/api/')
  );
}

export function analyzeNotFoundPath(rawPath: string): AnalyzedNotFoundPath {
  const cleanPath = sanitizePathname(rawPath);
  const { pathname: strippedPath } = stripLocalePrefix(cleanPath);
  const segments = strippedPath
    .split('/')
    .map((seg) => safeDecodeSegment(seg).trim())
    .filter((seg) => seg.length > 0);

  const lowerSegments = segments.map((seg) => seg.toLowerCase());
  let context: NotFoundContext = 'general';
  let categorySlugCandidate: CategoryId | null = null;
  let slugCandidate: string | null = null;

  if (lowerSegments[0] === 'tools') {
    context = 'tool';
    if (lowerSegments[1]) {
      const matchedCat = getCategoryBySlug(lowerSegments[1]);
      if (matchedCat) {
        categorySlugCandidate = matchedCat.slug;
      }
    }
    if (lowerSegments.length >= 3) {
      slugCandidate = lowerSegments[lowerSegments.length - 1];
    } else if (lowerSegments.length === 2 && !categorySlugCandidate) {
      slugCandidate = lowerSegments[1];
    }
  } else if (lowerSegments[0] === 'categories') {
    context = 'category';
    if (lowerSegments[1]) {
      const matchedCat = getCategoryBySlug(lowerSegments[1]);
      if (matchedCat) {
        categorySlugCandidate = matchedCat.slug;
      } else {
        slugCandidate = lowerSegments[1];
      }
    }
  } else if (lowerSegments.length > 0) {
    slugCandidate = lowerSegments[lowerSegments.length - 1];
  }

  const tokenSet = new Set<string>();
  for (let idx = 0; idx < lowerSegments.length; idx += 1) {
    const seg = lowerSegments[idx];
    // Skip the category segment when it is merely the container in `/tools/<category>/<slug>`
    if (
      context === 'tool' &&
      categorySlugCandidate &&
      idx === 1 &&
      lowerSegments.length >= 3 &&
      seg === categorySlugCandidate
    ) {
      continue;
    }
    const normalizedSeg = normalizeText(seg);
    if (!normalizedSeg) continue;
    for (const part of splitTokens(normalizedSeg)) {
      if (part && !STOPWORDS.has(part)) {
        tokenSet.add(part);
      }
    }
  }

  return {
    rawPath,
    cleanPath,
    strippedPath,
    segments,
    context,
    categorySlugCandidate,
    slugCandidate,
    tokens: Array.from(tokenSet),
  };
}

interface CandidateTerms {
  primaryIdentifiers: string[];
  phrases: string[];
  tokens: string[];
}

function scoreCandidate(
  analyzed: AnalyzedNotFoundPath,
  terms: CandidateTerms,
  kind: NotFoundSuggestionKind,
  id: string,
  candidateCategoryId?: CategoryId
): number {
  const queryParts: string[] = [];
  if (analyzed.slugCandidate) {
    const normSlug = normalizeText(analyzed.slugCandidate);
    if (normSlug && !STOPWORDS.has(normSlug)) {
      queryParts.push(normSlug);
    }
  }

  const meaningfulSegments = analyzed.segments
    .map((s) => normalizeText(s))
    .filter((s) => s.length > 0 && !STOPWORDS.has(s) && s !== analyzed.categorySlugCandidate);
  for (const seg of meaningfulSegments) {
    if (!queryParts.includes(seg)) {
      queryParts.push(seg);
    }
  }

  const combinedTokens = analyzed.tokens.join('-');
  if (combinedTokens && !queryParts.includes(combinedTokens)) {
    queryParts.push(combinedTokens);
  }

  const queryTokens = analyzed.tokens;
  if (queryParts.length === 0 && queryTokens.length === 0) {
    return 0;
  }

  let bestScore = 0;

  // Alias match (exact or close)
  for (const q of [...queryParts, ...queryTokens]) {
    const aliasHit = ALIAS_MAP[q];
    if (aliasHit && aliasHit.kind === kind && aliasHit.id === id) {
      bestScore = Math.max(bestScore, 0.96);
    }
    if (kind === 'category' && CATEGORY_ALIAS_MAP[q] === id) {
      bestScore = Math.max(bestScore, 0.88);
    }
  }

  // Primary slug/id comparison
  for (const query of queryParts) {
    for (const identifier of terms.primaryIdentifiers) {
      if (!identifier) continue;
      if (query === identifier) {
        bestScore = Math.max(bestScore, 1.0);
        continue;
      }
      if (query.length >= 3 && (identifier.startsWith(query) || query.startsWith(identifier))) {
        const lenRatio = Math.min(query.length, identifier.length) / Math.max(query.length, identifier.length);
        bestScore = Math.max(bestScore, 0.72 + 0.2 * lenRatio);
      }
      if (query.length >= 3 && (identifier.includes(query) || query.includes(identifier))) {
        const lenRatio = Math.min(query.length, identifier.length) / Math.max(query.length, identifier.length);
        bestScore = Math.max(bestScore, 0.65 + 0.18 * lenRatio);
      }
      const sim = normalizedSimilarity(query, identifier);
      if (sim >= 0.54) {
        bestScore = Math.max(bestScore, sim * 0.92);
      }
    }

    for (const phrase of terms.phrases) {
      if (!phrase) continue;
      if (query === phrase) {
        bestScore = Math.max(bestScore, 0.94);
        continue;
      }
      if (query.length >= 3 && (phrase.includes(query) || query.includes(phrase))) {
        const lenRatio = Math.min(query.length, phrase.length) / Math.max(query.length, phrase.length);
        bestScore = Math.max(bestScore, 0.58 + 0.22 * lenRatio);
      }
      const sim = normalizedSimilarity(query, phrase);
      if (sim >= 0.6) {
        bestScore = Math.max(bestScore, sim * 0.85);
      }
    }
  }

  // Token overlap + per-token fuzzy matching
  if (queryTokens.length > 0 && terms.tokens.length > 0) {
    let tokenScoreSum = 0;
    let strongTokenHits = 0;

    for (const qt of queryTokens) {
      let bestTokenScore = 0;
      for (const ct of terms.tokens) {
        if (qt === ct) {
          bestTokenScore = 1;
          break;
        }
        if (qt.length >= 3 && (ct.startsWith(qt) || qt.startsWith(ct))) {
          const ratio = Math.min(qt.length, ct.length) / Math.max(qt.length, ct.length);
          bestTokenScore = Math.max(bestTokenScore, 0.72 + 0.2 * ratio);
        } else if (qt.length >= 3 && ct.length >= 3) {
          const sim = normalizedSimilarity(qt, ct);
          if (sim >= 0.64) {
            bestTokenScore = Math.max(bestTokenScore, sim * 0.86);
          }
        }
      }
      if (bestTokenScore >= 0.65) {
        strongTokenHits += 1;
      }
      tokenScoreSum += bestTokenScore;
    }

    if (strongTokenHits > 0) {
      const avgTokenScore = tokenScoreSum / queryTokens.length;
      const coverage = strongTokenHits / Math.max(queryTokens.length, 1);
      const compositeTokenScore = avgTokenScore * 0.74 + coverage * 0.16;
      bestScore = Math.max(bestScore, compositeTokenScore);
    }
  }

  if (bestScore <= 0) {
    return 0;
  }

  // Context & category boosts
  if (
    analyzed.categorySlugCandidate &&
    candidateCategoryId &&
    analyzed.categorySlugCandidate === candidateCategoryId &&
    kind === 'tool'
  ) {
    bestScore = Math.min(1.08, bestScore + 0.08);
  }
  if (analyzed.context === 'tool' && kind === 'tool') {
    bestScore += 0.03;
  } else if (analyzed.context === 'category' && kind === 'category') {
    bestScore += 0.05;
  } else if (analyzed.context === 'general' && kind === 'page') {
    bestScore += 0.02;
  }

  return Math.round(bestScore * 1000) / 1000;
}

const MIN_SUGGESTION_SCORE = 0.52;

export function findNotFoundSuggestions(
  rawPath: string,
  locale: Locale = DEFAULT_LOCALE,
  limit = 4
): NotFoundSuggestion[] {
  const analyzed = analyzeNotFoundPath(rawPath);
  if (analyzed.tokens.length === 0 && !analyzed.slugCandidate) {
    return [];
  }

  const localizedTools = getLocalizedTools(locale);
  const localizedCategories = getLocalizedCategories(locale);
  const localizedPages = getLocalizedInfoPages(locale);
  const localizedCatMap = new Map(localizedCategories.map((cat) => [cat.slug, cat]));

  const candidates: NotFoundSuggestion[] = [];

  for (const tool of localizedTools) {
    const enTool = EN_TOOL_MAP.get(tool.id);
    const localizedCat = localizedCatMap.get(tool.category);
    const enCat = EN_CATEGORY_MAP.get(tool.category);
    const href = localePath(locale, `/tools/${tool.category}/${tool.slug}`);
    if (isRestrictedPath(href)) continue;

    const primaryIdentifiers = [normalizeText(tool.slug), normalizeText(tool.id)];
    const phrases = Array.from(
      new Set(
        [
          tool.name,
          enTool?.name ?? '',
          ...tool.keywords,
          ...(enTool?.keywords ?? []),
        ]
          .map(normalizeText)
          .filter(Boolean)
      )
    );
    const tokens = Array.from(
      new Set(
        [
          tool.slug,
          tool.id,
          tool.name,
          tool.shortDescription,
          enTool?.name ?? '',
          enTool?.shortDescription ?? '',
          localizedCat?.name ?? '',
          enCat?.name ?? '',
          ...tool.keywords,
          ...(enTool?.keywords ?? []),
        ].flatMap(splitTokens)
      )
    );

    const score = scoreCandidate(
      analyzed,
      { primaryIdentifiers, phrases, tokens },
      'tool',
      tool.id,
      tool.category
    );

    if (score >= MIN_SUGGESTION_SCORE) {
      candidates.push({
        kind: 'tool',
        id: tool.id,
        title: tool.name,
        subtitle: tool.shortDescription,
        href,
        icon: localizedCat?.iconName ?? 'Wrench',
        score,
        categoryId: tool.category,
      });
    }
  }

  for (const cat of localizedCategories) {
    const enCat = EN_CATEGORY_MAP.get(cat.slug);
    const href = localePath(locale, `/categories/${cat.slug}`);
    if (isRestrictedPath(href)) continue;

    const primaryIdentifiers = [normalizeText(cat.slug)];
    const phrases = Array.from(
      new Set(
        [cat.name, cat.shortName ?? '', enCat?.name ?? '', enCat?.shortName ?? '']
          .map(normalizeText)
          .filter(Boolean)
      )
    );
    const tokens = Array.from(
      new Set(
        [
          cat.slug,
          cat.name,
          cat.shortName ?? '',
          cat.tagline,
          cat.description,
          enCat?.name ?? '',
          enCat?.tagline ?? '',
          enCat?.description ?? '',
        ].flatMap(splitTokens)
      )
    );

    const score = scoreCandidate(
      analyzed,
      { primaryIdentifiers, phrases, tokens },
      'category',
      cat.slug,
      cat.slug
    );

    if (score >= MIN_SUGGESTION_SCORE) {
      candidates.push({
        kind: 'category',
        id: cat.slug,
        title: cat.name,
        subtitle: cat.tagline,
        href,
        icon: cat.iconName,
        score,
        categoryId: cat.slug,
      });
    }
  }

  for (const page of localizedPages) {
    const enPage = EN_INFO_MAP.get(page.slug);
    const pageDef = INFO_PAGES.find((p) => p.slug === page.slug);
    const href = localePath(locale, `/${page.slug}`);
    if (isRestrictedPath(href)) continue;

    const primaryIdentifiers = [normalizeText(page.slug)];
    const phrases = Array.from(
      new Set(
        [
          page.navLabel,
          page.title,
          enPage?.navLabel ?? '',
          enPage?.title ?? '',
          ...page.keywords,
          ...(enPage?.keywords ?? []),
        ]
          .map(normalizeText)
          .filter(Boolean)
      )
    );
    const tokens = Array.from(
      new Set(
        [
          page.slug,
          page.navLabel,
          page.title,
          page.subtitle,
          enPage?.navLabel ?? '',
          enPage?.title ?? '',
          ...page.keywords,
          ...(enPage?.keywords ?? []),
        ].flatMap(splitTokens)
      )
    );

    const score = scoreCandidate(
      analyzed,
      { primaryIdentifiers, phrases, tokens },
      'page',
      page.slug
    );

    if (score >= MIN_SUGGESTION_SCORE) {
      candidates.push({
        kind: 'page',
        id: page.slug,
        title: page.title,
        subtitle: page.subtitle,
        href,
        icon: pageDef?.iconName ?? page.iconName,
        score,
      });
    }
  }

  return candidates
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.id.localeCompare(b.id);
    })
    .slice(0, Math.max(0, limit));
}

export function getNotFoundFallbackData(
  locale: Locale = DEFAULT_LOCALE,
  analyzed: AnalyzedNotFoundPath
): NotFoundFallbackData {
  const categories = getLocalizedCategories(locale);
  const allTools = getLocalizedTools(locale);
  const infoPages = getLocalizedInfoPages(locale);

  const matchedCategory = analyzed.categorySlugCandidate
    ? categories.find((cat) => cat.slug === analyzed.categorySlugCandidate) ?? null
    : null;

  const categoryTools = matchedCategory
    ? allTools.filter((tool) => tool.category === matchedCategory.slug).slice(0, 6)
    : [];

  const toolMap = new Map(allTools.map((tool) => [tool.id, tool]));
  const featuredTools: LocalizedToolMeta[] = [];
  for (const id of FEATURED_TOOL_IDS) {
    const tool = toolMap.get(id);
    if (tool) featuredTools.push(tool);
  }
  if (featuredTools.length < 6) {
    for (const tool of allTools) {
      if (!featuredTools.some((existing) => existing.id === tool.id)) {
        featuredTools.push(tool);
      }
      if (featuredTools.length >= 6) break;
    }
  }

  return {
    matchedCategory,
    categoryTools,
    featuredTools: featuredTools.slice(0, 6),
    categories,
    infoPages,
  };
}
