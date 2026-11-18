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
import { buildCollectionPageJsonLd, buildToolJsonLd, buildWebSiteJsonLd } from '../src/lib/seo';
import sitemap from '../src/app/sitemap';
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  SUPPORTED_LOCALES,
  isValidLocale,
  localePath,
  stripLocalePrefix,
} from '../src/i18n/config';
import { detectBestLocale, parseAcceptLanguage } from '../src/i18n/detect';
import { getBundle, getFixedT } from '../src/i18n/translator';
import { CHEATSHEET_ENTRIES, getLocalizedCheatsheetEntries } from '../src/lib/tools/data/cheatsheets';

async function runVerification() {
  console.log('1. Verifying Registry Integrity...');
  assert.equal(CATEGORIES.length, 6, 'Expected 6 categories');
  assert.equal(TOOLS.length, 24, 'Expected 24 tools');

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
  console.log('   ✓ All 6 categories and 24 tools validated.');

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
  assert.equal(map.length, 124, `Expected 124 sitemap URLs (4 locales × 31 routes), got ${map.length}`);
  assert.ok(map[0].alternates?.languages?.['zh-Hans'], 'Expected zh-Hans hreflang alternate');
  assert.ok(map[0].alternates?.languages?.['x-default'], 'Expected x-default hreflang alternate');
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
  console.log('   ✓ SEO sitemap (124 routes across 4 locales) and Schema.org JSON-LD validated.');

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
  assert.equal(Object.keys(enBundle.catalog.categories).length, 6, 'Expected 6 categories in en catalog');
  assert.equal(Object.keys(enBundle.catalog.tools).length, 24, 'Expected 24 tools in en catalog');
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
  }
  console.log(`   ✓ i18n runtime, detection, URL helpers, and 4-locale parity (${enLeaves.size} keys × 4) validated.`);

  console.log('5. Verifying Locale-Aware Registry, Cheatsheets & Engines...');
  const viCats = getLocalizedCategories('vi');
  assert.equal(viCats.length, 6);
  assert.equal(viCats[0].name, 'Xử lý Ảnh');
  const jaTools = getLocalizedTools('ja');
  assert.equal(jaTools.length, 24);
  const zhJwt = getLocalizedToolBySlug('text', 'jwt-decoder', 'zh');
  assert.ok(zhJwt);
  assert.equal(zhJwt.name, 'JWT 解码器与载荷检查器');

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
    }
    console.log('   ✓ Built HTML <html lang="..."> validated for en, vi, ja, zh-Hans.');
  }

  console.log('\nALL AIDLC VERIFICATION CHECKS PASSED!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
