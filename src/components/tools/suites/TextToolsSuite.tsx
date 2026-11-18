'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { CopyButton } from '@/components/common/CopyButton';
import {
  convertCases,
  decodeBase64Utf8,
  decodeHtmlEntities,
  decodeJwt,
  encodeBase64Utf8,
  encodeHtmlEntities,
  generateNanoId,
  generateSecureToken,
  generateUlid,
  generateUuidV4,
  getTextStats,
  runRegexTest,
} from '@/lib/tools/engines/text';
import { useI18n } from '@/i18n/client';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

// Sample HS256 JWT (no real secret, standard example payload)
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMDFKUVhZIiwibmFtZSI6IkFsZXggRGV2ZWxvcGVyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export function TextToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
  const { locale, t } = useI18n();

  // 1. Case converter
  const [caseInput, setCaseInput] = useState<string>(
    typeof initialState?.caseInput === 'string' ? initialState.caseInput : 'userProfile_apiResponse v2'
  );

  // 2. Regex tester
  const [regexPattern, setRegexPattern] = useState<string>(
    typeof initialState?.regexPattern === 'string'
      ? initialState.regexPattern
      : '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})'
  );
  const [regexFlags, setRegexFlags] = useState<string>(
    typeof initialState?.regexFlags === 'string' ? initialState.regexFlags : 'g'
  );
  const [regexText, setRegexText] = useState<string>(
    typeof initialState?.regexText === 'string'
      ? initialState.regexText
      : 'Release dates: 2026-11-18 and 2027-01-05.'
  );

  // 3. JWT Decoder
  const [jwtToken, setJwtToken] = useState<string>(
    typeof initialState?.jwtToken === 'string' ? initialState.jwtToken : SAMPLE_JWT
  );

  // 4. ID Generator
  const [idKind, setIdKind] = useState<'uuid' | 'ulid' | 'nanoid' | 'token'>(
    initialState?.idKind === 'uuid' ||
      initialState?.idKind === 'ulid' ||
      initialState?.idKind === 'nanoid' ||
      initialState?.idKind === 'token'
      ? initialState.idKind
      : 'uuid'
  );
  const [idCount, setIdCount] = useState<number>(
    typeof initialState?.idCount === 'number' ? initialState.idCount : 6
  );
  const [idLength, setIdLength] = useState<number>(
    typeof initialState?.idLength === 'number' ? initialState.idLength : 21
  );
  const [tokenCharset, setTokenCharset] = useState<'alphanumeric' | 'hex' | 'base64url' | 'symbols'>(
    initialState?.tokenCharset === 'alphanumeric' ||
      initialState?.tokenCharset === 'hex' ||
      initialState?.tokenCharset === 'base64url' ||
      initialState?.tokenCharset === 'symbols'
      ? initialState.tokenCharset
      : 'alphanumeric'
  );
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);

  // 5. Text Encoder
  const [encMode, setEncMode] = useState<'base64' | 'url' | 'html'>(
    initialState?.encMode === 'base64' ||
      initialState?.encMode === 'url' ||
      initialState?.encMode === 'html'
      ? initialState.encMode
      : 'base64'
  );
  const [encDir, setEncDir] = useState<'encode' | 'decode'>(
    initialState?.encDir === 'encode' || initialState?.encDir === 'decode'
      ? initialState.encDir
      : 'encode'
  );
  const [encInput, setEncInput] = useState<string>(
    typeof initialState?.encInput === 'string'
      ? initialState.encInput
      : 'OmniDev <IT-Tools> & Privacy 🚀'
  );

  useEffect(() => {
    onStateChange?.({
      caseInput,
      regexPattern,
      regexFlags,
      regexText,
      jwtToken,
      idKind,
      idCount,
      idLength,
      tokenCharset,
      encMode,
      encDir,
      encInput,
    });
  }, [
    caseInput,
    regexPattern,
    regexFlags,
    regexText,
    jwtToken,
    idKind,
    idCount,
    idLength,
    tokenCharset,
    encMode,
    encDir,
    encInput,
    onStateChange,
  ]);

  const regenerateIds = () => {
    const list: string[] = [];
    for (let i = 0; i < idCount; i++) {
      if (idKind === 'uuid') list.push(generateUuidV4());
      else if (idKind === 'ulid') list.push(generateUlid());
      else if (idKind === 'nanoid') list.push(generateNanoId(idLength));
      else list.push(generateSecureToken(idLength, tokenCharset));
    }
    setGeneratedIds(list);
    onRun?.();
  };

  useEffect(() => {
    if (toolId === 'id-generator') {
      queueMicrotask(() => {
        const list: string[] = [];
        for (let i = 0; i < idCount; i++) {
          if (idKind === 'uuid') list.push(generateUuidV4());
          else if (idKind === 'ulid') list.push(generateUlid());
          else if (idKind === 'nanoid') list.push(generateNanoId(idLength));
          else list.push(generateSecureToken(idLength, tokenCharset));
        }
        setGeneratedIds(list);
      });
    }
  }, [toolId, idKind, idCount, idLength, tokenCharset]);

  const cases = useMemo(() => convertCases(caseInput), [caseInput]);
  const stats = useMemo(() => getTextStats(caseInput), [caseInput]);
  const regexRes = useMemo(
    () => runRegexTest(regexPattern, regexFlags, regexText, locale),
    [regexPattern, regexFlags, regexText, locale]
  );
  const jwtRes = useMemo(() => decodeJwt(jwtToken, undefined, locale), [jwtToken, locale]);

  const encOutput = useMemo(() => {
    try {
      if (encMode === 'base64') {
        return { ok: true, value: encDir === 'encode' ? encodeBase64Utf8(encInput) : decodeBase64Utf8(encInput) };
      }
      if (encMode === 'url') {
        return { ok: true, value: encDir === 'encode' ? encodeURIComponent(encInput) : decodeURIComponent(encInput) };
      }
      return { ok: true, value: encDir === 'encode' ? encodeHtmlEntities(encInput) : decodeHtmlEntities(encInput) };
    } catch (err) {
      return {
        ok: false,
        value: err instanceof Error ? err.message : t('tools:textSuite.conversionFailed'),
      };
    }
  }, [encInput, encMode, encDir, t]);

  if (toolId === 'case-converter') {
    return (
      <BentoGrid>
        <BentoCard span="5">
          <h2 className="section-title">{t('tools:textSuite.inputStringTitle')}</h2>
          <textarea
            className="textarea-field font-mono"
            value={caseInput}
            onChange={(e) => setCaseInput(e.target.value)}
            placeholder={t('tools:textSuite.casePlaceholder')}
            style={{ minHeight: '160px' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">{t('tools:textSuite.statCharacters')}</div>
              <div style={{ fontWeight: 600 }}>{stats.characters}</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">{t('tools:textSuite.statBytes')}</div>
              <div style={{ fontWeight: 600 }}>{stats.bytes}</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">{t('tools:textSuite.statWords')}</div>
              <div style={{ fontWeight: 600 }}>{stats.words}</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">{t('tools:textSuite.statLines')}</div>
              <div style={{ fontWeight: 600 }}>{stats.lines}</div>
            </div>
          </div>
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">{t('tools:textSuite.convertedConventionsTitle')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.6rem' }}>
            {Object.entries(cases).map(([label, val]) => (
              <div key={label} className="glass-panel" style={{ padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="subtle-text">{label}</span>
                  <CopyButton value={val} label={t('actions.copy')} onCopied={onRun} />
                </div>
                <code className="font-mono" style={{ fontSize: '0.84rem', wordBreak: 'break-all' }}>
                  {val || '—'}
                </code>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'regex-tester') {
    return (
      <BentoGrid>
        <BentoCard span="6">
          <h2 className="section-title">{t('tools:textSuite.patternPayloadTitle')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field font-mono"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder={t('tools:textSuite.regexPatternPlaceholder')}
              aria-label={t('tools:textSuite.regexPatternAria')}
            />
            <input
              type="text"
              className="input-field font-mono"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              placeholder={t('tools:textSuite.regexFlagsPlaceholder')}
              aria-label={t('tools:textSuite.regexFlagsAria')}
            />
          </div>
          {!regexRes.valid && (
            <div className="glass-panel badge-danger" style={{ padding: '0.6rem 0.8rem', fontSize: '0.82rem' }}>
              {regexRes.error}
            </div>
          )}
          <textarea
            className="textarea-field font-mono"
            value={regexText}
            onChange={(e) => setRegexText(e.target.value)}
            style={{ minHeight: '190px' }}
            aria-label={t('tools:textSuite.regexTextAria')}
          />
        </BentoCard>

        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">
              {t('tools:textSuite.matchesTitle', { count: regexRes.matches.length })}
            </h2>
            <span className="glass-pill glass-pill-active">{t('tools:textSuite.regexEngineBadge')}</span>
          </div>
          {regexRes.matches.length === 0 ? (
            <p className="muted-text">{t('tools:textSuite.noMatches')}</p>
          ) : (
            <div style={{ overflowX: 'auto', maxHeight: '280px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('tools:textSuite.thIndex')}</th>
                    <th>{t('tools:textSuite.thMatch')}</th>
                    <th>{t('tools:textSuite.thSpan')}</th>
                    <th>{t('tools:textSuite.thGroups')}</th>
                  </tr>
                </thead>
                <tbody>
                  {regexRes.matches.map((m, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <code className="font-mono" style={{ color: 'var(--accent)' }}>{m.match}</code>
                      </td>
                      <td className="subtle-text">{m.index}..{m.end}</td>
                      <td className="font-mono" style={{ fontSize: '0.78rem' }}>
                        {Object.keys(m.namedGroups).length > 0
                          ? JSON.stringify(m.namedGroups)
                          : m.groups.length > 0
                            ? JSON.stringify(m.groups)
                            : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'jwt-decoder') {
    const badgeClass =
      jwtRes.status === 'valid'
        ? 'badge-success'
        : jwtRes.status === 'expired'
          ? 'badge-danger'
          : 'badge-warning';
    const jwtStatusLabel =
      jwtRes.status === 'valid'
        ? t('tools:textSuite.jwtStatusValid')
        : jwtRes.status === 'expired'
          ? t('tools:textSuite.jwtStatusExpired')
          : jwtRes.status === 'not-yet-valid'
            ? t('tools:textSuite.jwtStatusNotYetValid')
            : t('tools:textSuite.jwtStatusNoExpiry');

    return (
      <BentoGrid>
        <BentoCard span="5">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">{t('tools:textSuite.encodedJwtTitle')}</h2>
            <CopyButton value={jwtToken} label={t('tools:textSuite.copyTokenBtn')} />
          </div>
          <textarea
            className="textarea-field font-mono"
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIs..."
            style={{ minHeight: '230px', fontSize: '0.8rem', wordBreak: 'break-all' }}
          />
          {jwtRes.valid && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`glass-pill ${badgeClass}`}>
                {t('tools:textSuite.jwtStatusPrefix', { status: jwtStatusLabel })}
              </span>
              {jwtRes.expiresAt && <span className="glass-pill">exp: {jwtRes.expiresAt}</span>}
            </div>
          )}
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">{t('tools:textSuite.decodedClaimsTitle')}</h2>
          {!jwtRes.valid ? (
            <div className="glass-panel badge-danger" style={{ padding: '1rem' }}>
              {jwtRes.error}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="glass-panel" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="subtle-text">{t('tools:textSuite.joseHeader')}</span>
                  <CopyButton value={JSON.stringify(jwtRes.header, null, 2)} label={t('actions.copy')} onCopied={onRun} />
                </div>
                <pre className="font-mono" style={{ margin: 0, fontSize: '0.8rem', overflowX: 'auto' }}>
                  {JSON.stringify(jwtRes.header, null, 2)}
                </pre>
              </div>
              <div className="glass-panel" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="subtle-text">{t('tools:textSuite.payloadClaims')}</span>
                  <CopyButton value={JSON.stringify(jwtRes.payload, null, 2)} label={t('actions.copy')} onCopied={onRun} />
                </div>
                <pre className="font-mono" style={{ margin: 0, fontSize: '0.8rem', overflowX: 'auto' }}>
                  {JSON.stringify(jwtRes.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'id-generator') {
    return (
      <BentoGrid>
        <BentoCard span="5">
          <h2 className="section-title">{t('tools:textSuite.generatorConfigTitle')}</h2>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">{t('tools:textSuite.identifierFormatLabel')}</span>
            <select
              className="select-field"
              value={idKind}
              onChange={(e) => setIdKind(e.target.value as 'uuid' | 'ulid' | 'nanoid' | 'token')}
            >
              <option value="uuid">{t('tools:textSuite.formatUuid')}</option>
              <option value="ulid">{t('tools:textSuite.formatUlid')}</option>
              <option value="nanoid">{t('tools:textSuite.formatNanoid')}</option>
              <option value="token">{t('tools:textSuite.formatToken')}</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">{t('tools:textSuite.batchCountLabel', { count: idCount })}</span>
            <input
              type="range"
              min={1}
              max={30}
              value={idCount}
              onChange={(e) => setIdCount(Number(e.target.value))}
            />
          </label>

          {(idKind === 'nanoid' || idKind === 'token') && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
              <span className="muted-text">{t('tools:textSuite.charLengthLabel', { length: idLength })}</span>
              <input
                type="range"
                min={8}
                max={64}
                value={idLength}
                onChange={(e) => setIdLength(Number(e.target.value))}
              />
            </label>
          )}

          {idKind === 'token' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
              <span className="muted-text">{t('tools:textSuite.alphabetLabel')}</span>
              <select
                className="select-field"
                value={tokenCharset}
                onChange={(e) => setTokenCharset(e.target.value as 'alphanumeric' | 'hex' | 'base64url' | 'symbols')}
              >
                <option value="alphanumeric">{t('tools:textSuite.charsetAlpha')}</option>
                <option value="hex">{t('tools:textSuite.charsetHex')}</option>
                <option value="base64url">{t('tools:textSuite.charsetBase64url')}</option>
                <option value="symbols">{t('tools:textSuite.charsetSymbols')}</option>
              </select>
            </label>
          )}

          <button type="button" className="btn btn-primary" onClick={regenerateIds}>
            <RefreshCw size={15} /> {t('tools:textSuite.regenerateBtn')}
          </button>
        </BentoCard>

        <BentoCard span="7">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">{t('tools:textSuite.generatedIdsTitle')}</h2>
            <CopyButton value={generatedIds.join('\n')} label={t('tools:textSuite.copyAllBtn')} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {generatedIds.map((id, idx) => (
              <div
                key={`${id}-${idx}`}
                className="glass-panel"
                style={{ padding: '0.55rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}
              >
                <code className="font-mono" style={{ fontSize: '0.84rem', wordBreak: 'break-all' }}>{id}</code>
                <CopyButton value={id} label={t('actions.copy')} />
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  // Text Encoder (Base64 / URL / HTML)
  return (
    <BentoGrid>
      <BentoCard span="6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:textSuite.sourceTextTitle')}</h2>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['base64', 'url', 'html'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`glass-pill ${encMode === m ? 'glass-pill-active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setEncMode(m)}
              >
                {m.toUpperCase()}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setEncDir((d) => (d === 'encode' ? 'decode' : 'encode'))}
            >
              {t('tools:textSuite.modeToggle', {
                mode:
                  encDir === 'encode'
                    ? t('tools:textSuite.modeEncode')
                    : t('tools:textSuite.modeDecode'),
              })}
            </button>
          </div>
        </div>
        <textarea
          className="textarea-field font-mono"
          value={encInput}
          onChange={(e) => setEncInput(e.target.value)}
          style={{ minHeight: '220px' }}
        />
      </BentoCard>

      <BentoCard span="6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">
            {encDir === 'encode'
              ? t('tools:textSuite.encodedOutputTitle')
              : t('tools:textSuite.decodedOutputTitle')}
          </h2>
          <CopyButton
            value={encOutput.ok ? encOutput.value : ''}
            label={t('tools:textSuite.copyOutputBtn')}
            onCopied={onRun}
          />
        </div>
        {!encOutput.ok ? (
          <div className="glass-panel badge-danger" style={{ padding: '1rem' }}>
            {encOutput.value}
          </div>
        ) : (
          <textarea
            className="textarea-field font-mono"
            readOnly
            value={encOutput.value}
            style={{ minHeight: '220px' }}
          />
        )}
      </BentoCard>
    </BentoGrid>
  );
}
