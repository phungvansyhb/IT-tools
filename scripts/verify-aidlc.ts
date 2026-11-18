import assert from 'node:assert/strict';
import { CATEGORIES, TOOLS, getCategoryBySlug } from '../src/lib/tools/registry';
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
  assert.equal(map.length, 31, `Expected 31 sitemap URLs (1 + 6 + 24), got ${map.length}`);
  const homeSchema = buildWebSiteJsonLd();
  assert.equal(homeSchema['@type'], 'WebSite');
  const catSchema = buildCollectionPageJsonLd(CATEGORIES[0], TOOLS.filter((t) => t.category === CATEGORIES[0].slug));
  assert.equal(catSchema['@type'], 'CollectionPage');
  const toolSchema = buildToolJsonLd(TOOLS[0], CATEGORIES[0]);
  assert.equal(toolSchema.length, 3);
  assert.equal(toolSchema[0]['@type'], 'SoftwareApplication');
  assert.equal(toolSchema[1]['@type'], 'BreadcrumbList');
  assert.equal(toolSchema[2]['@type'], 'FAQPage');
  console.log('   ✓ SEO sitemap (31 routes) and Schema.org JSON-LD validated.');
  console.log('\nALL AIDLC VERIFICATION CHECKS PASSED!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
