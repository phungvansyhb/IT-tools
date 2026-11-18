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
import type { ToolSuiteProps } from '@/components/tools/suites/types';

// Sample HS256 JWT (no real secret, standard example payload)
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMDFKUVhZIiwibmFtZSI6IkFsZXggRGV2ZWxvcGVyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export function TextToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
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
  const [idKind, setIdKind] = useState<'uuid' | 'ulid' | 'nanoid' | 'token'>('uuid');
  const [idCount, setIdCount] = useState<number>(6);
  const [idLength, setIdLength] = useState<number>(21);
  const [tokenCharset, setTokenCharset] = useState<'alphanumeric' | 'hex' | 'base64url' | 'symbols'>('alphanumeric');
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);

  // 5. Text Encoder
  const [encMode, setEncMode] = useState<'base64' | 'url' | 'html'>('base64');
  const [encDir, setEncDir] = useState<'encode' | 'decode'>('encode');
  const [encInput, setEncInput] = useState<string>(
    typeof initialState?.encInput === 'string'
      ? initialState.encInput
      : 'OmniDev <IT-Tools> & Privacy 🚀'
  );

  useEffect(() => {
    onStateChange?.({ caseInput, regexPattern, regexFlags, regexText, jwtToken, encInput });
  }, [caseInput, regexPattern, regexFlags, regexText, jwtToken, encInput, onStateChange]);

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
  const regexRes = useMemo(() => runRegexTest(regexPattern, regexFlags, regexText), [regexPattern, regexFlags, regexText]);
  const jwtRes = useMemo(() => decodeJwt(jwtToken), [jwtToken]);

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
      return { ok: false, value: err instanceof Error ? err.message : 'Conversion failed' };
    }
  }, [encInput, encMode, encDir]);

  if (toolId === 'case-converter') {
    return (
      <BentoGrid>
        <BentoCard span="5">
          <h2 className="section-title">Input String</h2>
          <textarea
            className="textarea-field font-mono"
            value={caseInput}
            onChange={(e) => setCaseInput(e.target.value)}
            placeholder="Enter variable name, heading, or text..."
            style={{ minHeight: '160px' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">Characters</div>
              <div style={{ fontWeight: 600 }}>{stats.characters}</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">UTF-8 Bytes</div>
              <div style={{ fontWeight: 600 }}>{stats.bytes}</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">Words</div>
              <div style={{ fontWeight: 600 }}>{stats.words}</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.6rem' }}>
              <div className="subtle-text">Lines</div>
              <div style={{ fontWeight: 600 }}>{stats.lines}</div>
            </div>
          </div>
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">Converted Conventions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.6rem' }}>
            {Object.entries(cases).map(([label, val]) => (
              <div key={label} className="glass-panel" style={{ padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="subtle-text">{label}</span>
                  <CopyButton value={val} label="Copy" onCopied={onRun} />
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
          <h2 className="section-title">Pattern &amp; Test Payload</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field font-mono"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="Regular expression pattern"
              aria-label="Regex pattern"
            />
            <input
              type="text"
              className="input-field font-mono"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              placeholder="gim"
              aria-label="Regex flags"
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
            aria-label="Test string"
          />
        </BentoCard>

        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Matches ({regexRes.matches.length})</h2>
            <span className="glass-pill glass-pill-active">ECMAScript RegExp</span>
          </div>
          {regexRes.matches.length === 0 ? (
            <p className="muted-text">No matches found for current pattern and flags.</p>
          ) : (
            <div style={{ overflowX: 'auto', maxHeight: '280px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Match</th>
                    <th>Span</th>
                    <th>Groups</th>
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

    return (
      <BentoGrid>
        <BentoCard span="5">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Encoded JWT Token</h2>
            <CopyButton value={jwtToken} label="Copy Token" />
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
              <span className={`glass-pill ${badgeClass}`}>Status: {jwtRes.status}</span>
              {jwtRes.expiresAt && <span className="glass-pill">exp: {jwtRes.expiresAt}</span>}
            </div>
          )}
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">Decoded Header &amp; Payload Claims</h2>
          {!jwtRes.valid ? (
            <div className="glass-panel badge-danger" style={{ padding: '1rem' }}>
              {jwtRes.error}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="glass-panel" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="subtle-text">JOSE Header</span>
                  <CopyButton value={JSON.stringify(jwtRes.header, null, 2)} label="Copy" onCopied={onRun} />
                </div>
                <pre className="font-mono" style={{ margin: 0, fontSize: '0.8rem', overflowX: 'auto' }}>
                  {JSON.stringify(jwtRes.header, null, 2)}
                </pre>
              </div>
              <div className="glass-panel" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="subtle-text">Payload Claims</span>
                  <CopyButton value={JSON.stringify(jwtRes.payload, null, 2)} label="Copy" onCopied={onRun} />
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
          <h2 className="section-title">Generator Configuration</h2>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">Identifier Format</span>
            <select
              className="select-field"
              value={idKind}
              onChange={(e) => setIdKind(e.target.value as 'uuid' | 'ulid' | 'nanoid' | 'token')}
            >
              <option value="uuid">UUID v4 (RFC 4122)</option>
              <option value="ulid">ULID (Lexicographically Sortable)</option>
              <option value="nanoid">NanoID (URL-Safe)</option>
              <option value="token">Cryptographic Secret Token</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">Batch Count ({idCount})</span>
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
              <span className="muted-text">Character Length ({idLength})</span>
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
              <span className="muted-text">Alphabet</span>
              <select
                className="select-field"
                value={tokenCharset}
                onChange={(e) => setTokenCharset(e.target.value as 'alphanumeric' | 'hex' | 'base64url' | 'symbols')}
              >
                <option value="alphanumeric">Alphanumeric (A-Z, a-z, 0-9)</option>
                <option value="hex">Hexadecimal (0-9, a-f)</option>
                <option value="base64url">Base64URL Safe</option>
                <option value="symbols">High-Entropy with Symbols</option>
              </select>
            </label>
          )}

          <button type="button" className="btn btn-primary" onClick={regenerateIds}>
            <RefreshCw size={15} /> Regenerate Batch
          </button>
        </BentoCard>

        <BentoCard span="7">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Generated Identifiers</h2>
            <CopyButton value={generatedIds.join('\n')} label="Copy All" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {generatedIds.map((id, idx) => (
              <div
                key={`${id}-${idx}`}
                className="glass-panel"
                style={{ padding: '0.55rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}
              >
                <code className="font-mono" style={{ fontSize: '0.84rem', wordBreak: 'break-all' }}>{id}</code>
                <CopyButton value={id} label="Copy" />
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
          <h2 className="section-title">Source Text</h2>
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
              Mode: {encDir === 'encode' ? 'Encode' : 'Decode'}
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
          <h2 className="section-title">{encDir === 'encode' ? 'Encoded' : 'Decoded'} Output</h2>
          <CopyButton value={encOutput.ok ? encOutput.value : ''} label="Copy Output" onCopied={onRun} />
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
