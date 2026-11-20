import assert from 'node:assert/strict';
import {
  CATEGORIES,
  TOOLS,
  getCategoryBySlug,
  getLocalizedCategories,
  getLocalizedToolBySlug,
  getLocalizedTools,
} from '../src/lib/tools/registry';
import {
  convertCases,
  decodeBase64Utf8,
  decodeJwt,
  encodeBase64Utf8,
  runRegexTest,
} from '../src/lib/tools/engines/text';
import {
  convertStructuredData,
  computeHashes,
  computeLineDiff,
  inspectMagicBytes,
} from '../src/lib/tools/engines/file';
import { getColorSpaces, getContrastRatio } from '../src/lib/tools/engines/color';
import {
  analyzeCronExpression,
  analyzeTimestamp,
  chmodToOctal,
  chmodToSymbolic,
  convertBytes,
  convertNumberBase,
  octalToChmod,
} from '../src/lib/tools/engines/calculators';
import { optimizeSvgMarkup } from '../src/lib/tools/engines/image';
import {
  buildCollectionPageJsonLd,
  buildHomeMetadata,
  buildInfoPageJsonLd,
  buildInfoPageMetadata,
  buildNotFoundMetadata,
  buildToolJsonLd,
  buildWebSiteJsonLd,
} from '../src/lib/seo';
import {
  INFO_PAGES,
  INFO_PAGE_SLUGS,
  getInfoPageBySlug,
  getLocalizedInfoPages,
  isInfoPageSlug,
} from '../src/lib/info/pages';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import manifest from '../src/app/manifest';
import { DEFAULT_GITHUB_URL, DEFAULT_SITE_URL, resolveSiteConfig } from '../src/lib/site';
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  SUPPORTED_LOCALES,
  isValidLocale,
  localePath,
  stripLocalePrefix,
} from '../src/i18n/config';
import {
  detectBestLocale,
  parseAcceptLanguage,
  shouldBypassLocaleProxy,
} from '../src/i18n/detect';
import { getBundle, getFixedT } from '../src/i18n/translator';
import { CHEATSHEET_ENTRIES, getLocalizedCheatsheetEntries } from '../src/lib/tools/data/cheatsheets';
import {
  FEEDBACK_COOLDOWN_MS,
  aggregateToolRatings,
  buildSafeDebugContext,
  filterAdminRecords,
  sanitizePathname,
  validateAdminUpdate,
  validateFeedbackSubmission,
  validateRatingInput,
  type FeedbackSubmission,
  type ToolRatingEntry,
} from '../src/lib/feedback';
import {
  SPEED_TEST_DEFAULT_DOWNLOAD_BYTES,
  SPEED_TEST_MAX_DOWNLOAD_BYTES,
  SPEED_TEST_MAX_UPLOAD_BYTES,
  SPEED_TEST_MIN_DOWNLOAD_BYTES,
  assessNetworkSuitability,
  calculateAudioLevels,
  clampDownloadBytes,
  clampSafeMasterVolume,
  classifyMicNoiseFloor,
  computeBandwidthMbps,
  computeKeyboardStats,
  computePingStats,
  computeSweepFrequencyAtProgress,
  detectKeyChatter,
  generateIncompressibleBytes,
  getKeyboardLayout,
  getKeyboardLayoutKeyCodes,
  shouldPreventDefaultBrowserKey,
  validateSameOriginHeaders,
} from '../src/lib/tools/engines/diagnostics';
import {
  analyzeNotFoundPath,
  findNotFoundSuggestions,
  getNotFoundFallbackData,
} from '../src/lib/not-found';

async function runVerification() {
  console.log('1. Verifying Registry Integrity...');
  assert.equal(CATEGORIES.length, 7, 'Expected 7 categories');
  assert.equal(TOOLS.length, 28, 'Expected 28 tools');

  const ids = new Set<string>();
  const slugKeys = new Set<string>();
  for (const tool of TOOLS) {
    assert.ok(!ids.has(tool.id), `Duplicate tool id: ${tool.id}`);
    ids.add(tool.id);

    const slugKey = `${tool.category}/${tool.slug}`;
    assert.ok(!slugKeys.has(slugKey), `Duplicate route: ${slugKey}`);
    slugKeys.add(slugKey);

    assert.ok(getCategoryBySlug(tool.category), `Invalid category for ${tool.id}`);
    assert.ok(tool.keywords.length >= 3, `Missing keywords for ${tool.id}`);
    assert.ok(tool.howItWorks.length >= 2, `Missing howItWorks for ${tool.id}`);
    assert.ok(tool.faqs.length >= 2, `Missing FAQs for ${tool.id}`);
  }
  console.log('   ✓ All 7 categories and 28 tools validated.');

  console.log('2. Verifying Deterministic Tool Engines...');
  // Case converter
  const cases = convertCases('helloWorld_test');
  assert.equal(cases.snake_case, 'hello_world_test');
  assert.equal(cases['kebab-case'], 'hello-world-test');
  assert.equal(cases.PascalCase, 'HelloWorldTest');

  // Regex tester
  const rx = runRegexTest('(?<yr>\\d{4})-(\\d{2})', 'g', 'Date 2026-11');
  assert.equal(rx.valid, true);
  assert.equal(rx.matches.length, 1);
  assert.equal(rx.matches[0].namedGroups.yr, '2026');

  // JWT decoder
  const sampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE5OTk5OTk5OTl9.sig';
  const jwt = decodeJwt(sampleJwt, 1700000000000);
  assert.equal(jwt.valid, true);
  assert.equal(jwt.status, 'valid');
  assert.equal(jwt.payload?.sub, '123');

  // Base64 UTF-8
  const b64 = encodeBase64Utf8('OmniDev 🚀');
  assert.equal(decodeBase64Utf8(b64), 'OmniDev 🚀');

  // JSON <-> YAML <-> CSV
  const jsonSample = JSON.stringify([{ name: 'alpha', port: 80 }, { name: 'beta', port: 443 }]);
  const yamlOut = convertStructuredData(jsonSample, 'json', 'yaml');
  assert.equal(yamlOut.ok, true);
  if (yamlOut.ok) {
    const csvOut = convertStructuredData(yamlOut.output, 'yaml', 'csv');
    assert.equal(csvOut.ok, true);
    if (csvOut.ok) {
      assert.ok(csvOut.output.includes('name,port'));
      const backToJson = convertStructuredData(csvOut.output, 'csv', 'json');
      assert.equal(backToJson.ok, true);
    }
  }

  // SHA-256 hash
  const hashBytes = new TextEncoder().encode('abc');
  const hashes = await computeHashes(hashBytes.buffer);
  assert.equal(
    hashes['SHA-256'],
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  );

  // Magic bytes + Line diff + SVG
  const magic = inspectMagicBytes(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  assert.equal(magic.detectedMime, 'image/png');
  const diff = computeLineDiff('a\nb', 'a\nc');
  assert.ok(diff.some((d) => d.type === 'removed' && d.text === 'b'));
  assert.ok(diff.some((d) => d.type === 'added' && d.text === 'c'));
  const svgOpt = optimizeSvgMarkup('<!-- comment --><svg>  <rect />  </svg>');
  assert.equal(svgOpt.optimized, '<svg><rect/></svg>');

  // Color & WCAG contrast
  const spaces = getColorSpaces('#10b981');
  assert.ok(spaces);
  assert.equal(spaces.hex, '#10B981');
  assert.equal(spaces.cssRgb, 'rgb(16, 185, 129)');
  const contrast = getContrastRatio('#FFFFFF', '#000000');
  assert.ok(contrast);
  assert.equal(contrast.ratio, 21);
  assert.equal(contrast.aaaNormal, true);

  // Calculators
  const chmodState = octalToChmod('755');
  assert.ok(chmodState);
  assert.equal(chmodToOctal(chmodState), '755');
  assert.equal(chmodToSymbolic(chmodState), 'rwxr-xr-x');
  const cron = analyzeCronExpression('*/15 * * * *', 5, new Date('2026-01-01T00:00:00Z'));
  assert.equal(cron.valid, true);
  assert.equal(cron.nextRuns.length, 5);
  const ts = analyzeTimestamp('1700000000');
  assert.equal(ts.valid, true);
  assert.equal(ts.epochSeconds, 1700000000);
  assert.equal(convertBytes(1, 'KiB').B, '1,024');
  const base = convertNumberBase('FF', 16);
  assert.equal(base.dec, '255');
  assert.equal(base.bin, '11111111');
  console.log('   ✓ All deterministic algorithms verified.');

  console.log('3. Verifying SEO Sitemap & Schema.org JSON-LD...');
  const map = sitemap();
  assert.equal(map.length, 164, `Expected 164 sitemap URLs (4 locales × 41 routes), got ${map.length}`);
  assert.ok(map[0].alternates?.languages?.['zh-Hans'], 'Expected zh-Hans hreflang alternate');
  assert.ok(map[0].alternates?.languages?.['x-default'], 'Expected x-default hreflang alternate');
  assert.equal(
    map.some((entry) => entry.url.includes('/admin')),
    false,
    'Admin routes must never appear in sitemap()'
  );
  for (const loc of SUPPORTED_LOCALES) {
    for (const slug of INFO_PAGE_SLUGS) {
      const expectedPath = localePath(loc, `/${slug}`);
      assert.ok(
        map.some((entry) => entry.url.endsWith(expectedPath)),
        `Expected sitemap() to include info route ${expectedPath}`
      );
    }
  }

  assert.equal(INFO_PAGES.length, 5, 'Expected 5 info pages in INFO_PAGES');
  assert.equal(isInfoPageSlug('about'), true);
  assert.equal(isInfoPageSlug('unknown'), false);
  assert.equal(getInfoPageBySlug('help')?.schemaType, 'FAQPage');

  for (const loc of SUPPORTED_LOCALES) {
    const localizedInfo = getLocalizedInfoPages(loc);
    assert.equal(localizedInfo.length, 5, `Expected 5 localized info pages for ${loc}`);
    for (const page of localizedInfo) {
      assert.ok(page.navLabel.length > 0, `Expected navLabel for ${loc}/${page.slug}`);
      assert.ok(page.title.length > 0, `Expected title for ${loc}/${page.slug}`);

      const meta = buildInfoPageMetadata(page.slug, loc);
      assert.ok(meta.metadataBase instanceof URL, `Expected metadataBase URL for ${loc}/${page.slug}`);
      assert.ok(
        typeof meta.alternates?.canonical === 'string' &&
          meta.alternates.canonical.endsWith(localePath(loc, `/${page.slug}`)),
        `Expected canonical URL for ${loc}/${page.slug}`
      );
      const ogImgs = Array.isArray(meta.openGraph?.images)
        ? meta.openGraph.images
        : meta.openGraph?.images
          ? [meta.openGraph.images]
          : [];
      assert.ok(ogImgs.length > 0, `Expected openGraph.images for ${loc}/${page.slug}`);

      const jsonLd = buildInfoPageJsonLd(page.slug, loc);
      assert.equal(jsonLd.length, 2, `Expected 2 JSON-LD schemas for ${loc}/${page.slug}`);
      assert.equal(jsonLd[0]['@type'], 'BreadcrumbList');
      const pageNode = jsonLd[1] as { '@type': string; inLanguage?: string; mainEntity?: unknown[] };
      assert.equal(pageNode['@type'], page.schemaType);
      assert.equal(pageNode.inLanguage, LOCALE_META[loc].htmlLang);
      if (page.slug === 'help') {
        assert.ok(
          Array.isArray(pageNode.mainEntity) && pageNode.mainEntity.length >= 5,
          `Expected FAQPage.mainEntity.length >= 5 for ${loc}/help`
        );
      }
    }
  }

  const homeSchema = buildWebSiteJsonLd('vi');
  assert.equal(homeSchema['@type'], 'WebSite');
  assert.equal(homeSchema.inLanguage, 'vi');
  const catSchema = buildCollectionPageJsonLd(CATEGORIES[0], TOOLS.filter((t) => t.category === CATEGORIES[0].slug), 'ja');
  assert.equal(catSchema['@type'], 'CollectionPage');
  assert.equal(catSchema.inLanguage, 'ja');
  const toolSchema = buildToolJsonLd(TOOLS[0], CATEGORIES[0], 'zh');
  assert.equal(toolSchema.length, 3);
  assert.equal(toolSchema[0]['@type'], 'SoftwareApplication');
  assert.equal(toolSchema[0].inLanguage, 'zh-Hans');
  assert.equal(toolSchema[1]['@type'], 'BreadcrumbList');
  assert.equal(toolSchema[2]['@type'], 'FAQPage');

  const robotsConfig = robots();
  const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];
  const disallowList = rules.flatMap((r) => (Array.isArray(r.disallow) ? r.disallow : r.disallow ? [r.disallow] : []));
  for (const requiredDisallow of ['/*/admin', '/*/admin/*', '/admin', '/admin/*', '/api/*']) {
    assert.ok(disallowList.includes(requiredDisallow), `Expected robots.ts disallow to include ${requiredDisallow}`);
  }
  console.log('   ✓ SEO sitemap (164 routes across 4 locales), Info Pages SEO builders, robots.ts admin & /api/* guard, and Schema.org JSON-LD validated.');

  console.log('4. Verifying i18n Core Runtime, Locale Detection & Canonical English Bundle...');
  assert.deepEqual([...SUPPORTED_LOCALES], ['en', 'vi', 'ja', 'zh']);
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(LOCALE_META.zh.htmlLang, 'zh-Hans');
  assert.equal(LOCALE_META.zh.ogLocale, 'zh_CN');
  assert.equal(isValidLocale('vi'), true);
  assert.equal(isValidLocale('fr'), false);

  assert.equal(localePath('vi', '/'), '/vi');
  assert.equal(localePath('ja', '/tools/text/jwt-decoder'), '/ja/tools/text/jwt-decoder');
  assert.equal(localePath('zh', '/en/tools/text/jwt-decoder?q=jwt'), '/zh/tools/text/jwt-decoder?q=jwt');
  assert.deepEqual(stripLocalePrefix('/vi/categories/text'), {
    locale: 'vi',
    pathname: '/categories/text',
  });
  assert.deepEqual(stripLocalePrefix('/en'), { locale: 'en', pathname: '/' });
  assert.deepEqual(stripLocalePrefix('/tools/text/jwt-decoder'), {
    locale: null,
    pathname: '/tools/text/jwt-decoder',
  });

  assert.equal(parseAcceptLanguage('fr-CH, fr;q=0.9, vi-VN;q=0.8, en;q=0.7'), 'vi');
  assert.equal(parseAcceptLanguage('ja-JP,en-US;q=0.8'), 'ja');
  assert.equal(parseAcceptLanguage('zh-Hans-CN,zh;q=0.9,en;q=0.5'), 'zh');
  assert.equal(parseAcceptLanguage('de-DE,es;q=0.5'), null);
  assert.equal(
    detectBestLocale({ cookieLocale: 'ja', acceptLanguage: 'vi-VN,vi;q=0.9' }),
    'ja'
  );
  assert.equal(
    detectBestLocale({ cookieLocale: 'invalid', acceptLanguage: 'zh-CN,en;q=0.8' }),
    'zh'
  );
  assert.equal(detectBestLocale({ cookieLocale: null, acceptLanguage: 'fr-FR' }), 'en');

  const enBundle = getBundle('en');
  assert.equal(Object.keys(enBundle.catalog.categories).length, 7, 'Expected 7 categories in en catalog');
  assert.equal(Object.keys(enBundle.catalog.tools).length, 28, 'Expected 28 tools in en catalog');
  assert.equal(
    Object.keys(enBundle.cheatsheets.entries).length,
    CHEATSHEET_ENTRIES.length,
    `Expected ${CHEATSHEET_ENTRIES.length} cheatsheet entries in en dictionary`
  );
  for (const cat of CATEGORIES) {
    assert.ok(enBundle.catalog.categories[cat.slug], `Missing en catalog entry for category ${cat.slug}`);
  }
  for (const tool of TOOLS) {
    assert.ok(
      enBundle.catalog.tools[tool.id as keyof typeof enBundle.catalog.tools],
      `Missing en catalog entry for tool ${tool.id}`
    );
  }
  for (const entry of CHEATSHEET_ENTRIES) {
    assert.ok(
      enBundle.cheatsheets.entries[entry.id as keyof typeof enBundle.cheatsheets.entries],
      `Missing en cheatsheet entry for ${entry.id}`
    );
  }

  const tEn = getFixedT('en');
  assert.equal(tEn('brand.name'), 'OmniDev');
  assert.equal(tEn('nav.categoriesHeading', { count: 6 }), 'Categories (6)');
  assert.equal(
    tEn('tools:engines.text.jwtSegmentsError', { count: 2 }),
    'Expected 3 dot-separated segments, found 2.'
  );
  assert.equal(
    tEn('tools:engines.calculators.cronEveryNMinutes', { step: 15 }),
    'Every 15 minutes'
  );

  // UNIT-06: Verify 100% recursive key parity & interpolation placeholders across en, vi, ja, zh
  function collectLeafPaths(obj: unknown, prefix = ''): Map<string, string[]> {
    const result = new Map<string, string[]>();
    if (typeof obj === 'string') {
      const vars = Array.from(obj.matchAll(/\{\{(\w+)\}\}/g)).map((m) => m[1]).sort();
      result.set(prefix, vars);
      return result;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => {
        for (const [k, v] of collectLeafPaths(item, `${prefix}[${idx}]`)) {
          result.set(k, v);
        }
      });
      return result;
    }
    if (obj && typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        const nextPrefix = prefix ? `${prefix}.${key}` : key;
        for (const [k, v] of collectLeafPaths(val, nextPrefix)) {
          result.set(k, v);
        }
      }
    }
    return result;
  }

  const enLeaves = collectLeafPaths(enBundle);
  assert.ok(enLeaves.size > 400, `Expected >400 leaf translation strings, got ${enLeaves.size}`);

  for (const loc of ['vi', 'ja', 'zh'] as const) {
    const bundle = getBundle(loc);
    const locLeaves = collectLeafPaths(bundle);
    assert.equal(
      locLeaves.size,
      enLeaves.size,
      `Leaf key count mismatch for ${loc}: got ${locLeaves.size}, expected ${enLeaves.size}`
    );
    for (const [path, expectedVars] of enLeaves.entries()) {
      assert.ok(locLeaves.has(path), `Missing key ${path} in locale ${loc}`);
      assert.deepEqual(
        locLeaves.get(path),
        expectedVars,
        `Interpolation placeholder mismatch at ${loc}:${path}`
      );
    }
    const tLoc = getFixedT(loc);
    assert.equal(tLoc('brand.name'), 'OmniDev');
    assert.ok(tLoc('feedback.navButton').length > 0, `Expected feedback.navButton in ${loc}`);
    assert.ok(
      tLoc('feedback.errors.cooldown', { seconds: 15 }).includes('15'),
      `Expected feedback.errors.cooldown interpolation in ${loc}`
    );
    assert.ok(tLoc('adminFeedback.heading').length > 0, `Expected adminFeedback.heading in ${loc}`);
    assert.ok(
      tLoc('adminFeedback.kpiRatingsAvg', { avg: '4.8', count: 12 }).includes('4.8'),
      `Expected adminFeedback.kpiRatingsAvg interpolation in ${loc}`
    );
    assert.ok(
      tLoc('tools:diagnosticsSuite.keyboard.kpiTested', { tested: 50, total: 104, percent: 48.1 }).includes('50'),
      `Expected diagnosticsSuite.keyboard.kpiTested interpolation in ${loc}`
    );
    assert.ok(
      tLoc('tools:diagnosticsSuite.speed.selfHostedBadge').length > 0,
      `Expected diagnosticsSuite.speed.selfHostedBadge in ${loc}`
    );
    assert.ok(tLoc('commandPalette.pageBadge').length > 0, `Expected commandPalette.pageBadge in ${loc}`);
    assert.ok(
      tLoc('footer.copyrightLine', { year: 2026 }).includes('2026'),
      `Expected footer.copyrightLine interpolation in ${loc}`
    );
    assert.ok(tLoc('pages:about.title').length > 0, `Expected pages:about.title in ${loc}`);
    assert.ok(tLoc('pages:help.faqs.0.question').length > 0, `Expected pages:help.faqs in ${loc}`);
  }
  assert.equal(tEn('feedback.navButton'), 'Send Feedback');
  assert.equal(tEn('adminFeedback.heading'), 'Feedback Moderation Console');
  assert.equal(tEn('pages:about.navLabel'), 'About');
  console.log(`   ✓ i18n runtime, detection, URL helpers, and 4-locale parity (${enLeaves.size} keys × 4) validated.`);

  console.log('5. Verifying Locale-Aware Registry, Cheatsheets & Engines...');
  const viCats = getLocalizedCategories('vi');
  assert.equal(viCats.length, 7);
  assert.equal(viCats[0].name, 'Xử lý Ảnh');
  assert.equal(viCats[6].name, 'Thiết bị & Mạng');
  const jaTools = getLocalizedTools('ja');
  assert.equal(jaTools.length, 28);
  const zhJwt = getLocalizedToolBySlug('text', 'jwt-decoder', 'zh');
  assert.ok(zhJwt);
  assert.equal(zhJwt.name, 'JWT 解码器与载荷检查器');
  const zhSpeed = getLocalizedToolBySlug('diagnostics', 'speed-test', 'zh');
  assert.ok(zhSpeed);
  assert.equal(zhSpeed.name, '网络速度与延迟测试');

  const viSheets = getLocalizedCheatsheetEntries('vi', 'git-cheatsheet');
  assert.equal(viSheets.length, 7);
  assert.equal(viSheets[0].command, 'git rebase -i HEAD~5');
  assert.notEqual(viSheets[0].title, 'Interactive Rebase Last N Commits');

  const viMagic = inspectMagicBytes(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'vi');
  assert.equal(viMagic.formatName, 'Ảnh PNG');
  const jaJwtErr = decodeJwt('bad.token', Date.now(), 'ja');
  assert.equal(jaJwtErr.valid, false);
  assert.ok(jaJwtErr.error?.includes('2 個'));
  const zhCron = analyzeCronExpression('*/15 * * * *', 5, new Date('2026-01-01T00:00:00Z'), 'zh');
  assert.equal(zhCron.valid, true);
  assert.ok(zhCron.humanReadable.includes('每 15 分钟'));
  console.log('   ✓ Localized registry, cheatsheets, and pure engines validated.');

  const fs = await import('node:fs');
  const path = await import('node:path');
  const nextAppDir = path.join(process.cwd(), '.next', 'server', 'app');
  if (fs.existsSync(nextAppDir)) {
    console.log('6. Verifying Built Static HTML <html lang="..."> & Single-Root Structure...');
    for (const loc of SUPPORTED_LOCALES) {
      const htmlPath = path.join(nextAppDir, `${loc}.html`);
      assert.ok(fs.existsSync(htmlPath), `Missing built HTML file: ${htmlPath}`);
      const html = fs.readFileSync(htmlPath, 'utf8');
      const expectedLang = LOCALE_META[loc].htmlLang;
      const htmlTagMatches = html.match(/<html\b[^>]*>/g) ?? [];
      assert.equal(htmlTagMatches.length, 1, `Expected single <html> tag in ${loc}.html, got ${htmlTagMatches.length}`);
      assert.ok(
        htmlTagMatches[0].includes(`lang="${expectedLang}"`),
        `Expected lang="${expectedLang}" in ${loc}.html, got: ${htmlTagMatches[0]}`
      );

      const adminHtmlPath = path.join(nextAppDir, loc, 'admin', 'feedback.html');
      assert.ok(fs.existsSync(adminHtmlPath), `Missing built admin HTML file: ${adminHtmlPath}`);
      const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
      const adminHtmlTags = adminHtml.match(/<html\b[^>]*>/g) ?? [];
      assert.equal(
        adminHtmlTags.length,
        1,
        `Expected single <html> tag in ${loc}/admin/feedback.html, got ${adminHtmlTags.length}`
      );
      assert.ok(
        adminHtmlTags[0].includes(`lang="${expectedLang}"`),
        `Expected lang="${expectedLang}" in ${loc}/admin/feedback.html, got: ${adminHtmlTags[0]}`
      );
      assert.ok(
        /<meta[^>]+name="robots"[^>]+content="[^"]*noindex[^"]*nofollow[^"]*"/i.test(adminHtml),
        `Expected noindex, nofollow robots meta tag in ${loc}/admin/feedback.html`
      );

      for (const slug of INFO_PAGE_SLUGS) {
        const infoHtmlPath = path.join(nextAppDir, loc, `${slug}.html`);
        assert.ok(fs.existsSync(infoHtmlPath), `Missing built info HTML file: ${infoHtmlPath}`);
        const infoHtml = fs.readFileSync(infoHtmlPath, 'utf8');
        const infoHtmlTags = infoHtml.match(/<html\b[^>]*>/g) ?? [];
        assert.equal(
          infoHtmlTags.length,
          1,
          `Expected single <html> tag in ${loc}/${slug}.html, got ${infoHtmlTags.length}`
        );
        assert.ok(
          infoHtmlTags[0].includes(`lang="${expectedLang}"`),
          `Expected lang="${expectedLang}" in ${loc}/${slug}.html, got: ${infoHtmlTags[0]}`
        );
        assert.ok(
          new RegExp(`<link[^>]+rel="canonical"[^>]+href="[^"]*/${loc}/${slug}"`, 'i').test(infoHtml),
          `Expected canonical link containing /${loc}/${slug} in ${loc}/${slug}.html`
        );
        assert.ok(
          /<meta[^>]+property="og:image"[^>]+content="[^"]*\/opengraph-image[^"]*"/i.test(infoHtml),
          `Expected og:image containing /opengraph-image in ${loc}/${slug}.html`
        );
        assert.ok(
          infoHtml.includes('application/ld+json'),
          `Expected application/ld+json script in ${loc}/${slug}.html`
        );
      }
    }
    console.log('   ✓ Built HTML <html lang="...">, admin noindex meta, and 20 static info pages (canonical, og:image, JSON-LD) validated for en, vi, ja, zh-Hans.');
  }

  console.log('7. Verifying Pure Feedback Core (Validation, Debug Context, Aggregation & Filtering)...');
  // Honeypot triggered
  const honeypotRes = validateFeedbackSubmission({
    type: 'bug',
    toolId: 'jwt-decoder',
    title: 'Bot test',
    message: 'This message is definitely longer than 10 characters.',
    contactEmail: 'bot@example.com',
    website: 'https://spam.example.com',
  });
  assert.equal(honeypotRes.ok, false);
  assert.equal(honeypotRes.honeypotTriggered, true);

  // Cooldown < 30s
  const nowMs = 1_700_000_050_000;
  const cooldownRes = validateFeedbackSubmission(
    {
      type: 'feedback',
      toolId: 'general',
      title: 'Quick follow-up',
      message: 'Valid length feedback message here.',
    },
    { lastSubmittedAt: nowMs - (FEEDBACK_COOLDOWN_MS - 12_000), now: nowMs }
  );
  assert.equal(cooldownRes.ok, false);
  assert.equal(cooldownRes.honeypotTriggered, false);
  assert.ok(cooldownRes.cooldownRemainingSec >= 12);

  // Length & email validation + valid submission
  const shortMsgRes = validateFeedbackSubmission({
    type: 'bug',
    toolId: 'jwt-decoder',
    message: 'too short',
    contactEmail: 'not-an-email',
  });
  assert.equal(shortMsgRes.ok, false);
  assert.equal(shortMsgRes.fieldErrors.message, 'message_too_short');
  assert.equal(shortMsgRes.fieldErrors.contactEmail, 'invalid_email');

  const longTitleRes = validateFeedbackSubmission({
    type: 'feature',
    toolId: 'general',
    title: 'x'.repeat(141),
    message: 'A valid feature request message with enough characters.',
  });
  assert.equal(longTitleRes.ok, false);
  assert.equal(longTitleRes.fieldErrors.title, 'title_too_long');

  const validFeedbackRes = validateFeedbackSubmission(
    {
      type: 'bug',
      toolId: 'jwt-decoder',
      title: '  Expiry badge hint  ',
      message: '  Shows UTC instead of local timezone on hover.  ',
      contactEmail: '  dev@example.com  ',
      website: '',
    },
    { lastSubmittedAt: nowMs - FEEDBACK_COOLDOWN_MS - 1000, now: nowMs }
  );
  assert.equal(validFeedbackRes.ok, true);
  assert.equal(validFeedbackRes.sanitized?.toolId, 'jwt-decoder');
  assert.equal(validFeedbackRes.sanitized?.title, 'Expiry badge hint');
  assert.equal(validFeedbackRes.sanitized?.contactEmail, 'dev@example.com');

  // Rating validation
  assert.equal(validateRatingInput({ toolId: 'general', rating: 5 }).ok, false);
  assert.equal(validateRatingInput({ toolId: 'jwt-decoder', rating: 0 }).ok, false);
  assert.equal(validateRatingInput({ toolId: 'jwt-decoder', rating: 6 }).ok, false);
  assert.equal(validateRatingInput({ toolId: 'jwt-decoder', rating: 3.5 }).ok, false);
  assert.equal(
    validateRatingInput({ toolId: 'jwt-decoder', rating: 5, comment: 'c'.repeat(501) }).ok,
    false
  );
  const validRating = validateRatingInput({
    toolId: 'jwt-decoder',
    rating: 5,
    comment: '  Super fast!  ',
  });
  assert.equal(validRating.ok, true);
  assert.equal(validRating.sanitized?.rating, 5);
  assert.equal(validRating.sanitized?.comment, 'Super fast!');

  // Admin update validation
  assert.equal(validateAdminUpdate({ status: 'unknown', adminNote: '' }).ok, false);
  assert.equal(
    validateAdminUpdate({ status: 'resolved', adminNote: 'Fixed in v0.2' }).ok,
    true
  );

  // Safe debug context strips ?state= and #hash
  assert.equal(
    sanitizePathname('/vi/tools/text/jwt-decoder?state=SECRET_JWT#frag'),
    '/vi/tools/text/jwt-decoder'
  );
  const safeCtx = buildSafeDebugContext({
    toolId: 'jwt-decoder',
    locale: 'vi',
    pathname: '/vi/tools/text/jwt-decoder?state=SECRET_JWT#frag',
    theme: 'dark',
    viewport: '1440x900',
    platform: 'Linux x86_64',
    userAgent: 'Mozilla/5.0 ' + 'A'.repeat(200),
  });
  assert.equal(safeCtx.pathname, '/vi/tools/text/jwt-decoder');
  assert.ok(!safeCtx.pathname.includes('SECRET_JWT'));
  assert.ok(!safeCtx.pathname.includes('?'));
  assert.ok(!safeCtx.pathname.includes('#'));
  assert.ok(safeCtx.userAgentShort.length <= 120);

  // Rating aggregation (1-decimal rounding)
  const sampleRatings: ToolRatingEntry[] = [
    {
      id: 'r1',
      clientId: 'client-11111111',
      toolId: 'jwt-decoder',
      rating: 5,
      comment: 'Great',
      createdAt: '2026-11-18T00:00:00Z',
      updatedAt: '2026-11-18T00:00:00Z',
    },
    {
      id: 'r2',
      clientId: 'client-22222222',
      toolId: 'jwt-decoder',
      rating: 4,
      comment: 'Solid',
      createdAt: '2026-11-18T00:00:00Z',
      updatedAt: '2026-11-18T00:00:00Z',
    },
    {
      id: 'r3',
      clientId: 'client-33333333',
      toolId: 'jwt-decoder',
      rating: 4,
      comment: '',
      createdAt: '2026-11-18T00:00:00Z',
      updatedAt: '2026-11-18T00:00:00Z',
    },
  ];
  const agg = aggregateToolRatings(sampleRatings);
  assert.equal(agg['jwt-decoder'].ratingCount, 3);
  assert.equal(agg['jwt-decoder'].avgRating, 4.3);

  // Admin filter records
  const sampleSubmissions: FeedbackSubmission[] = [
    {
      id: 'f1',
      clientId: 'client-11111111',
      type: 'bug',
      toolId: 'jwt-decoder',
      title: 'JWT bug',
      message: 'Detailed bug description for jwt decoder.',
      contactEmail: '',
      debugContext: safeCtx,
      status: 'open',
      adminNote: '',
      createdAt: '2026-11-18T00:00:00Z',
      updatedAt: '2026-11-18T00:00:00Z',
    },
    {
      id: 'f2',
      clientId: 'client-22222222',
      type: 'feature',
      toolId: 'general',
      title: 'Add XML formatter',
      message: 'Please consider adding an XML formatter tool.',
      contactEmail: 'user@example.com',
      debugContext: null,
      status: 'resolved',
      adminNote: 'Planned',
      createdAt: '2026-11-18T00:00:00Z',
      updatedAt: '2026-11-18T00:00:00Z',
    },
  ];
  const bugOnly = filterAdminRecords({
    submissions: sampleSubmissions,
    ratings: sampleRatings,
    typeFilter: 'bug',
    statusFilter: 'open',
    toolFilter: 'jwt-decoder',
    query: 'jwt',
  });
  assert.equal(bugOnly.submissions.length, 1);
  assert.equal(bugOnly.submissions[0].id, 'f1');
  assert.equal(bugOnly.ratings.length, 0);

  const ratingOnly = filterAdminRecords({
    submissions: sampleSubmissions,
    ratings: sampleRatings,
    typeFilter: 'rating',
    toolFilter: 'jwt-decoder',
    query: 'solid',
  });
  assert.equal(ratingOnly.submissions.length, 0);
  assert.equal(ratingOnly.ratings.length, 1);
  assert.equal(ratingOnly.ratings[0].id, 'r2');

  console.log('   ✓ Pure feedback core (validation, honeypot, cooldown, debug context, aggregation, filters) validated.');

  console.log('8. Verifying Pure Diagnostics Engine (Keyboard, Audio & Speed Test Math)...');
  // Keyboard layouts (full-104 & tkl-80)
  const fullRows = getKeyboardLayout('full-104');
  const tklRows = getKeyboardLayout('tkl-80');
  assert.equal(fullRows.length, 6);
  assert.equal(tklRows.length, 6);

  const fullCodes = getKeyboardLayoutKeyCodes('full-104');
  const tklCodes = getKeyboardLayoutKeyCodes('tkl-80');
  assert.equal(fullCodes.length, 104, `Expected 104 keys in full-104, got ${fullCodes.length}`);
  assert.equal(tklCodes.length, 87, `Expected 87 keys in tkl-80, got ${tklCodes.length}`);
  assert.equal(new Set(fullCodes).size, fullCodes.length, 'Expected unique key codes in full-104');
  assert.equal(new Set(tklCodes).size, tklCodes.length, 'Expected unique key codes in tkl-80');
  assert.ok(fullCodes.includes('NumpadEnter'));
  assert.ok(!tklCodes.includes('NumpadEnter'));

  // Keyboard stats (ignores codes outside target layout)
  const kbStats = computeKeyboardStats({
    layout: 'tkl-80',
    testedCodes: ['KeyA', 'KeyS', 'Numpad0', 'NumpadEnter'],
    activeCodes: ['KeyA'],
    stuckCodes: [],
    maxSimultaneous: 3,
    totalPresses: 12,
  });
  assert.equal(kbStats.totalLayoutKeys, 87);
  assert.equal(kbStats.testedCount, 2);
  assert.equal(kbStats.coveragePercent, Math.round((2 / 87) * 1000) / 10);
  assert.equal(kbStats.activeCount, 1);
  assert.equal(kbStats.stuckCount, 0);
  assert.equal(kbStats.maxSimultaneous, 3);
  assert.equal(kbStats.totalPresses, 12);

  // Key chatter detection
  assert.equal(detectKeyChatter(null, 1000), false);
  assert.equal(detectKeyChatter(1000, 1025), true);
  assert.equal(detectKeyChatter(1000, 1040), false);
  assert.equal(detectKeyChatter(1000, 990), false);

  // Browser default-action prevention matrix (Space scroll, arrows, Tab, Alt, Quick Find, Capture Mode)
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'Space', key: ' ', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'ArrowDown', key: 'ArrowDown', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'PageDown', key: 'PageDown', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'Tab', key: 'Tab', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'AltLeft', key: 'Alt', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'ContextMenu', key: 'ContextMenu', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'F1', key: 'F1', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'Slash', key: '/', captureMode: false }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'Quote', key: "'", captureMode: false }), true);
  // Cmd/Ctrl+K and F5 stay available outside Capture Mode, but are captured when captureMode=true
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'KeyK', key: 'k', metaKey: true, captureMode: false }), false);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'F5', key: 'F5', captureMode: false }), false);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'KeyK', key: 'k', metaKey: true, captureMode: true }), true);
  assert.equal(shouldPreventDefaultBrowserKey({ code: 'F5', key: 'F5', captureMode: true }), true);

  // Audio levels & mic noise classification
  const emptyAudio = calculateAudioLevels(new Float32Array(0));
  assert.equal(emptyAudio.rms, 0);
  assert.equal(emptyAudio.dbfs, -100);
  assert.equal(emptyAudio.isClipping, false);

  const halfSineLike = calculateAudioLevels(new Float32Array([0.5, -0.5, 0.5, -0.5]));
  assert.ok(Math.abs(halfSineLike.rms - 0.5) < 1e-6);
  assert.ok(Math.abs(halfSineLike.peak - 0.5) < 1e-6);
  assert.ok(Math.abs(halfSineLike.dbfs - 20 * Math.log10(0.5)) < 1e-4);
  assert.equal(halfSineLike.isClipping, false);

  const clippedAudio = calculateAudioLevels(new Float32Array([0.99, -0.2]));
  assert.equal(clippedAudio.isClipping, true);
  assert.equal(classifyMicNoiseFloor(-5, true), 'clipping');
  assert.equal(classifyMicNoiseFloor(-70, false), 'silent');
  assert.equal(classifyMicNoiseFloor(-48, false), 'quiet');
  assert.equal(classifyMicNoiseFloor(-20, false), 'normal');
  assert.equal(classifyMicNoiseFloor(-5, false), 'loud');

  // Sweep frequency & safe master volume
  assert.equal(computeSweepFrequencyAtProgress(0), 20);
  assert.ok(Math.abs(computeSweepFrequencyAtProgress(1) - 20_000) < 1e-6);
  assert.ok(Math.abs(computeSweepFrequencyAtProgress(0.5) - Math.sqrt(20 * 20_000)) < 1e-4);
  assert.equal(clampSafeMasterVolume(35), 0.35);
  assert.equal(clampSafeMasterVolume(150), 1);
  assert.equal(clampSafeMasterVolume(-10), 0);
  assert.equal(clampSafeMasterVolume(Number.NaN), 0.35);

  // Speed test constants, clamping, ping, bandwidth, suitability & origin check
  assert.equal(SPEED_TEST_MIN_DOWNLOAD_BYTES, 65_536);
  assert.equal(SPEED_TEST_DEFAULT_DOWNLOAD_BYTES, 1_048_576);
  assert.equal(SPEED_TEST_MAX_DOWNLOAD_BYTES, 4_194_304);
  assert.equal(SPEED_TEST_MAX_UPLOAD_BYTES, 4_194_304);
  assert.equal(clampDownloadBytes(null), 1_048_576);
  assert.equal(clampDownloadBytes('bad'), 1_048_576);
  assert.equal(clampDownloadBytes('1024'), 65_536);
  assert.equal(clampDownloadBytes('99999999'), 4_194_304);
  assert.equal(clampDownloadBytes('2097152'), 2_097_152);

  const pingStats = computePingStats([10, 20, 14]);
  assert.equal(pingStats.minMs, 10);
  assert.equal(pingStats.maxMs, 20);
  assert.ok(Math.abs(pingStats.avgMs - 14.67) < 0.01);
  assert.equal(pingStats.jitterMs, 8);
  assert.deepEqual(computePingStats([]), { minMs: 0, avgMs: 0, maxMs: 0, jitterMs: 0 });
  assert.equal(computePingStats([15]).jitterMs, 0);

  assert.equal(computeBandwidthMbps(1_000_000, 1000), 8);
  assert.equal(computeBandwidthMbps(0, 1000), 0);
  assert.equal(computeBandwidthMbps(1_000_000, 0), 0);

  const fastNet = assessNetworkSuitability({
    pingMs: 12,
    jitterMs: 3,
    downloadMbps: 120,
    uploadMbps: 80,
  });
  assert.equal(fastNet.overallGrade, 'excellent');
  assert.equal(fastNet.useCases.length, 4);
  assert.ok(fastNet.useCases.every((u) => u.status === 'excellent'));

  const slowNet = assessNetworkSuitability({
    pingMs: 250,
    jitterMs: 90,
    downloadMbps: 1,
    uploadMbps: 0.4,
  });
  assert.equal(slowNet.overallGrade, 'poor');

  assert.equal(validateSameOriginHeaders(null, 'localhost:3000'), true);
  assert.equal(validateSameOriginHeaders('https://omnidev.app', 'omnidev.app'), true);
  assert.equal(validateSameOriginHeaders('http://localhost:3000', 'localhost:3000'), true);
  assert.equal(validateSameOriginHeaders('https://evil.example', 'omnidev.app'), false);
  assert.equal(validateSameOriginHeaders('not-a-url', 'omnidev.app'), false);

  const randomBuf = generateIncompressibleBytes(1025, 12345);
  assert.equal(randomBuf.byteLength, 1025);
  assert.ok(new Set(randomBuf).size > 100);
  console.log('   ✓ Pure diagnostics engine (keyboard, audio, speed test math & origin checks) validated.');

  console.log('9. Verifying Brand Assets, Starter SVG Cleanup, Site Config, Proxy Bypass & SEO Social Images...');
  // favicon.ico header (00 00 01 00) and count === 3
  const faviconPath = path.join(process.cwd(), 'src', 'app', 'favicon.ico');
  assert.ok(fs.existsSync(faviconPath), 'Missing src/app/favicon.ico');
  const icoBuf = fs.readFileSync(faviconPath);
  assert.ok(icoBuf.length >= 22, 'favicon.ico too small');
  assert.equal(icoBuf.readUInt16LE(0), 0, 'Invalid ICO reserved header');
  assert.equal(icoBuf.readUInt16LE(2), 1, 'Invalid ICO type header');
  assert.equal(icoBuf.readUInt16LE(4), 3, 'Expected 3 icon entries (16/32/48) in favicon.ico');

  // PNG icons signature & IHDR dimensions
  const pngExpectations = [
    { file: 'public/icons/icon-192.png', width: 192, height: 192 },
    { file: 'public/icons/icon-512.png', width: 512, height: 512 },
    { file: 'public/icons/icon-maskable-512.png', width: 512, height: 512 },
  ] as const;
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  for (const expected of pngExpectations) {
    const abs = path.join(process.cwd(), expected.file);
    assert.ok(fs.existsSync(abs), `Missing PNG asset: ${expected.file}`);
    const buf = fs.readFileSync(abs);
    assert.ok(buf.subarray(0, 8).equals(pngSig), `Invalid PNG signature in ${expected.file}`);
    assert.equal(buf.subarray(12, 16).toString('ascii'), 'IHDR', `Missing IHDR chunk in ${expected.file}`);
    assert.equal(buf.readUInt32BE(16), expected.width, `Unexpected PNG width in ${expected.file}`);
    assert.equal(buf.readUInt32BE(20), expected.height, `Unexpected PNG height in ${expected.file}`);
  }

  // icon.svg colors
  const iconSvgPath = path.join(process.cwd(), 'src', 'app', 'icon.svg');
  assert.ok(fs.existsSync(iconSvgPath), 'Missing src/app/icon.svg');
  const iconSvg = fs.readFileSync(iconSvgPath, 'utf8');
  assert.ok(iconSvg.includes('#09090b'), 'icon.svg must include #09090b');
  assert.ok(iconSvg.includes('#10b981'), 'icon.svg must include #10b981');

  // 5 starter SVGs deleted
  for (const starter of ['next.svg', 'vercel.svg', 'globe.svg', 'file.svg', 'window.svg']) {
    const starterPath = path.join(process.cwd(), 'public', starter);
    assert.equal(fs.existsSync(starterPath), false, `Starter SVG should be removed: public/${starter}`);
  }

  // resolveSiteConfig()
  assert.deepEqual(resolveSiteConfig({}), {
    siteUrl: DEFAULT_SITE_URL,
    githubUrl: DEFAULT_GITHUB_URL,
    supportEmail: null,
  });
  assert.deepEqual(
    resolveSiteConfig({
      NEXT_PUBLIC_SITE_URL: 'https://omnidev.example.com///',
      NEXT_PUBLIC_GITHUB_URL: 'https://github.com/custom/repo/',
      NEXT_PUBLIC_SUPPORT_EMAIL: '  support@omnidev.dev  ',
    }),
    {
      siteUrl: 'https://omnidev.example.com',
      githubUrl: 'https://github.com/custom/repo',
      supportEmail: 'support@omnidev.dev',
    }
  );
  assert.deepEqual(
    resolveSiteConfig({
      NEXT_PUBLIC_SITE_URL: 'ftp://invalid.example.com',
      NEXT_PUBLIC_GITHUB_URL: 'not-a-url',
      NEXT_PUBLIC_SUPPORT_EMAIL: 'invalid-email',
    }),
    {
      siteUrl: DEFAULT_SITE_URL,
      githubUrl: DEFAULT_GITHUB_URL,
      supportEmail: null,
    }
  );

  // shouldBypassLocaleProxy()
  for (const bypassPath of [
    '/apple-icon',
    '/opengraph-image',
    '/twitter-image',
    '/icon.svg',
    '/icon',
    '/favicon.ico',
    '/icons/icon-192.png',
    '/manifest.webmanifest',
    '/sitemap.xml',
    '/robots.txt',
    '/api/speedtest/ping',
    '/_next/static/chunk.js',
  ]) {
    assert.equal(shouldBypassLocaleProxy(bypassPath), true, `Expected proxy bypass for ${bypassPath}`);
  }
  for (const routedPath of ['/', '/tools/text/jwt-decoder', '/en/about']) {
    assert.equal(shouldBypassLocaleProxy(routedPath), false, `Expected proxy routing for ${routedPath}`);
  }

  // manifest()
  const webManifest = manifest();
  assert.equal(webManifest.background_color, '#09090b');
  assert.equal(webManifest.theme_color, '#10b981');
  assert.equal(webManifest.icons?.length, 5, 'Expected 5 icon entries in manifest()');
  assert.ok(
    webManifest.icons?.some((ic) => ic.purpose === 'maskable'),
    'Expected maskable icon entry in manifest()'
  );

  // buildHomeMetadata('en')
  const homeMeta = buildHomeMetadata('en');
  assert.ok(homeMeta.metadataBase instanceof URL, 'Expected metadataBase to be URL');
  const ogImages = Array.isArray(homeMeta.openGraph?.images)
    ? homeMeta.openGraph.images
    : homeMeta.openGraph?.images
      ? [homeMeta.openGraph.images]
      : [];
  assert.ok(ogImages.length > 0, 'Expected openGraph.images on home metadata');
  const twImages = Array.isArray(homeMeta.twitter?.images)
    ? homeMeta.twitter.images
    : homeMeta.twitter?.images
      ? [homeMeta.twitter.images]
      : [];
  assert.ok(twImages.length > 0, 'Expected twitter.images on home metadata');

  console.log('   ✓ Brand assets, starter SVG cleanup, site config, proxy bypass, manifest & SEO social images validated.');

  console.log('10. Verifying Pure 404 Suggestion Engine, Fallback Data & Not-Found Metadata...');
  const analyzedJwt = analyzeNotFoundPath('/vi/tools/text/jwt-decode?state=secret_token_123#frag');
  assert.equal(analyzedJwt.cleanPath, '/vi/tools/text/jwt-decode');
  assert.equal(analyzedJwt.strippedPath, '/tools/text/jwt-decode');
  assert.equal(analyzedJwt.context, 'tool');
  assert.equal(analyzedJwt.categorySlugCandidate, 'text');
  assert.equal(analyzedJwt.slugCandidate, 'jwt-decode');
  assert.ok(!analyzedJwt.cleanPath.includes('secret_token_123'));
  assert.ok(!analyzedJwt.cleanPath.includes('?'));
  assert.ok(!analyzedJwt.cleanPath.includes('#'));

  const analyzedTextCat = analyzeNotFoundPath('/vi/tools/text');
  assert.equal(analyzedTextCat.context, 'tool');
  assert.equal(analyzedTextCat.categorySlugCandidate, 'text');

  const analyzedCatMissing = analyzeNotFoundPath('/ja/categories/security');
  assert.equal(analyzedCatMissing.context, 'category');
  assert.equal(analyzedCatMissing.categorySlugCandidate, null);

  const analyzedGeneral = analyzeNotFoundPath('/en/faq');
  assert.equal(analyzedGeneral.context, 'general');
  assert.equal(analyzedGeneral.categorySlugCandidate, null);

  const jwtSuggestions = findNotFoundSuggestions('/vi/tools/text/jwt-decode?state=secret#hash', 'vi', 4);
  assert.ok(jwtSuggestions.length >= 1, 'Expected suggestions for /vi/tools/text/jwt-decode');
  assert.equal(jwtSuggestions[0].id, 'jwt-decoder');
  assert.equal(jwtSuggestions[0].href, '/vi/tools/text/jwt-decoder');

  const faqSuggestions = findNotFoundSuggestions('/en/faq', 'en', 4);
  assert.ok(faqSuggestions.length >= 1, 'Expected suggestions for /en/faq');
  assert.equal(faqSuggestions[0].kind, 'page');
  assert.equal(faqSuggestions[0].id, 'help');
  assert.equal(faqSuggestions[0].href, '/en/help');

  const securityCatSuggestions = findNotFoundSuggestions('/ja/categories/security', 'ja', 4);
  assert.ok(securityCatSuggestions.length >= 1, 'Expected suggestions for /ja/categories/security');
  assert.equal(securityCatSuggestions[0].kind, 'category');
  assert.equal(securityCatSuggestions[0].id, 'text');

  const jsonFormaterSuggestions = findNotFoundSuggestions('/en/tools/text/json-formater', 'en', 4);
  assert.ok(jsonFormaterSuggestions.length >= 1, 'Expected suggestions for /en/tools/text/json-formater');
  assert.equal(jsonFormaterSuggestions[0].id, 'data-converter');

  const garbageSuggestions = findNotFoundSuggestions('/en/zzzzqqqqxxxx9999', 'en', 4);
  assert.deepEqual(garbageSuggestions, [], 'Expected empty suggestions for random garbage path');

  for (const probe of [
    '/en/admin',
    '/vi/admin/feedback',
    '/en/api/speedtest/ping',
    '/vi/tools/text/jwt-decode',
    '/en/tools',
  ]) {
    const res = findNotFoundSuggestions(probe, 'en', 10);
    for (const item of res) {
      assert.ok(!item.href.includes('/admin'), `Suggestion must never expose /admin: ${item.href}`);
      assert.ok(!item.href.includes('/api'), `Suggestion must never expose /api: ${item.href}`);
    }
  }

  const fallbackTool = getNotFoundFallbackData('vi', analyzedJwt);
  assert.equal(fallbackTool.matchedCategory?.slug, 'text');
  assert.ok(fallbackTool.categoryTools.length > 0 && fallbackTool.categoryTools.length <= 6);
  assert.equal(fallbackTool.featuredTools.length, 6);
  assert.equal(fallbackTool.categories.length, 7);
  assert.equal(fallbackTool.infoPages.length, 5);

  const nfMeta = buildNotFoundMetadata('vi', 'tool');
  assert.ok(nfMeta.metadataBase instanceof URL, 'Expected metadataBase on notFound metadata');
  assert.equal(typeof nfMeta.title, 'string');
  assert.ok((nfMeta.title as string).includes('404'));
  assert.deepEqual(nfMeta.robots, { index: false, follow: false, nocache: true });

  const requiredNotFoundFiles = [
    'src/app/global-not-found.tsx',
    'src/app/[locale]/not-found.tsx',
    'src/app/[locale]/[...rest]/page.tsx',
    'src/app/[locale]/categories/[category]/not-found.tsx',
    'src/app/[locale]/tools/[category]/[slug]/not-found.tsx',
  ];
  for (const relPath of requiredNotFoundFiles) {
    assert.ok(fs.existsSync(path.join(process.cwd(), relPath)), `Missing 404 route file: ${relPath}`);
  }
  const localeNfSource = fs.readFileSync(
    path.join(process.cwd(), 'src/app/[locale]/not-found.tsx'),
    'utf8'
  );
  assert.ok(!localeNfSource.includes('glass-btn'), 'Legacy .glass-btn stub must be removed from [locale]/not-found.tsx');

  console.log('   ✓ Pure 404 suggestion engine, sanitization, /admin & /api exclusion, fallback data, route boundaries, and noindex metadata validated.');

  console.log('\nALL AIDLC VERIFICATION CHECKS PASSED!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
