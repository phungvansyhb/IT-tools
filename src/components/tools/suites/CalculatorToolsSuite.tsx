'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { CopyButton } from '@/components/common/CopyButton';
import {
  analyzeCronExpression,
  analyzeTimestamp,
  chmodToOctal,
  chmodToSymbolic,
  convertBytes,
  convertNumberBase,
  octalToChmod,
  type ByteUnit,
  type ChmodState,
} from '@/lib/tools/engines/calculators';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

export function CalculatorToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
  // 1. Chmod
  const [chmod, setChmod] = useState<ChmodState>(
    () =>
      octalToChmod(typeof initialState?.octal === 'string' ? initialState.octal : '755') ?? {
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        others: { read: true, write: false, execute: true },
      }
  );
  const [octalInput, setOctalInput] = useState<string>(
    typeof initialState?.octal === 'string' ? initialState.octal : '755'
  );

  // 2. Cron
  const [cronExpr, setCronExpr] = useState<string>(
    typeof initialState?.cronExpr === 'string' ? initialState.cronExpr : '*/15 * * * *'
  );

  // 3. Timestamp
  const [tsInput, setTsInput] = useState<string>(
    typeof initialState?.tsInput === 'string' ? initialState.tsInput : '1700000000'
  );

  useEffect(() => {
    if (toolId === 'timestamp-converter' && typeof initialState?.tsInput !== 'string') {
      queueMicrotask(() => {
        setTsInput(String(Math.floor(Date.now() / 1000)));
      });
    }
  }, [toolId, initialState?.tsInput]);

  // 4. Bytes & Number Bases
  const [byteValue, setByteValue] = useState<number>(
    typeof initialState?.byteValue === 'number' ? initialState.byteValue : 1024
  );
  const [byteUnit, setByteUnit] = useState<ByteUnit>(
    (initialState?.byteUnit as ByteUnit) || 'MiB'
  );
  const [bandwidthMbps, setBandwidthMbps] = useState<number>(100);
  const [baseValue, setBaseValue] = useState<string>(
    typeof initialState?.baseValue === 'string' ? initialState.baseValue : '255'
  );
  const [baseRadix, setBaseRadix] = useState<2 | 8 | 10 | 16>(10);

  const octal = useMemo(() => chmodToOctal(chmod), [chmod]);
  const symbolic = useMemo(() => chmodToSymbolic(chmod), [chmod]);

  useEffect(() => {
    onStateChange?.({ octal, cronExpr, tsInput, byteValue, byteUnit, baseValue });
  }, [octal, cronExpr, tsInput, byteValue, byteUnit, baseValue, onStateChange]);

  const cronAnalysis = useMemo(() => analyzeCronExpression(cronExpr, 5), [cronExpr]);
  const tsAnalysis = useMemo(() => analyzeTimestamp(tsInput), [tsInput]);
  const byteMap = useMemo(() => convertBytes(byteValue, byteUnit), [byteValue, byteUnit]);
  const radixMap = useMemo(() => convertNumberBase(baseValue, baseRadix), [baseValue, baseRadix]);

  if (toolId === 'chmod-calculator') {
    const roles: { key: keyof ChmodState; label: string }[] = [
      { key: 'owner', label: 'Owner (u)' },
      { key: 'group', label: 'Group (g)' },
      { key: 'others', label: 'Others (o)' },
    ];
    const perms: ('read' | 'write' | 'execute')[] = ['read', 'write', 'execute'];

    return (
      <BentoGrid>
        <BentoCard span="7">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 className="section-title">Permissions Matrix</h2>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['644', '755', '600', '775'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`glass-pill ${octal === preset ? 'glass-pill-active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    const parsed = octalToChmod(preset);
                    if (parsed) {
                      setChmod(parsed);
                      setOctalInput(preset);
                      onRun?.();
                    }
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Scope</th>
                <th>Read (4)</th>
                <th>Write (2)</th>
                <th>Execute (1)</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.key}>
                  <td style={{ fontWeight: 600 }}>{r.label}</td>
                  {perms.map((p) => (
                    <td key={p}>
                      <input
                        type="checkbox"
                        checked={chmod[r.key][p]}
                        aria-label={`${r.label} ${p}`}
                        onChange={(e) => {
                          const next: ChmodState = {
                            ...chmod,
                            [r.key]: { ...chmod[r.key], [p]: e.target.checked },
                          };
                          setChmod(next);
                          setOctalInput(chmodToOctal(next));
                          onRun?.();
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </BentoCard>

        <BentoCard span="5">
          <h2 className="section-title">Octal &amp; Symbolic Output</h2>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">Octal Mode (e.g. 755)</span>
            <input
              type="text"
              className="input-field font-mono"
              maxLength={4}
              value={octalInput}
              onChange={(e) => {
                setOctalInput(e.target.value);
                const parsed = octalToChmod(e.target.value);
                if (parsed) setChmod(parsed);
              }}
            />
          </label>
          <div className="glass-panel" style={{ padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="subtle-text">Symbolic</div>
              <code className="font-mono" style={{ fontSize: '1rem', color: 'var(--accent)' }}>-{symbolic}</code>
            </div>
            <CopyButton value={`-${symbolic}`} label="Copy" />
          </div>
          <div className="glass-panel" style={{ padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="subtle-text">Shell Command</div>
              <code className="font-mono" style={{ fontSize: '0.92rem' }}>chmod {octal} &lt;path&gt;</code>
            </div>
            <CopyButton value={`chmod ${octal} `} label="Copy" />
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'cron-calculator') {
    const presets = [
      { label: 'Every 5 min', expr: '*/5 * * * *' },
      { label: 'Hourly', expr: '0 * * * *' },
      { label: 'Daily 02:30', expr: '30 2 * * *' },
      { label: 'Weekdays 09:00', expr: '0 9 * * 1-5' },
      { label: 'Monthly 1st', expr: '0 0 1 * *' },
    ];

    return (
      <BentoGrid>
        <BentoCard span="6">
          <h2 className="section-title">5-Field Cron Expression</h2>
          <input
            type="text"
            className="input-field font-mono"
            value={cronExpr}
            onChange={(e) => setCronExpr(e.target.value)}
            aria-label="Cron expression"
            style={{ fontSize: '1.05rem' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {presets.map((p) => (
              <button
                key={p.expr}
                type="button"
                className={`glass-pill ${cronExpr === p.expr ? 'glass-pill-active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCronExpr(p.expr);
                  onRun?.();
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          {cronAnalysis.valid ? (
            <div className="glass-panel badge-success" style={{ padding: '0.85rem', fontSize: '0.92rem' }}>
              {cronAnalysis.humanReadable}
            </div>
          ) : (
            <div className="glass-panel badge-danger" style={{ padding: '0.85rem', fontSize: '0.88rem' }}>
              {cronAnalysis.error}
            </div>
          )}
        </BentoCard>

        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Next 5 Execution Times (UTC)</h2>
            <CopyButton value={cronExpr} label="Copy Cron" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {cronAnalysis.nextRuns.length === 0 ? (
              <p className="muted-text">Enter a valid 5-field cron expression to preview runs.</p>
            ) : (
              cronAnalysis.nextRuns.map((iso, idx) => (
                <div
                  key={iso}
                  className="glass-panel"
                  style={{ padding: '0.55rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span className="subtle-text">Run #{idx + 1}</span>
                  <code className="font-mono" style={{ fontSize: '0.84rem' }}>{iso}</code>
                </div>
              ))
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'timestamp-converter') {
    const tzRows = tsAnalysis.valid && tsAnalysis.epochMs
      ? ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Ho_Chi_Minh'].map((tz) => ({
          tz,
          formatted: new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'long',
            timeZone: tz,
          }).format(new Date(tsAnalysis.epochMs!)),
        }))
      : [];

    return (
      <BentoGrid>
        <BentoCard span="5">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Epoch or ISO Date</h2>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setTsInput(String(Math.floor(Date.now() / 1000)));
                onRun?.();
              }}
            >
              <Clock size={14} /> Now
            </button>
          </div>
          <input
            type="text"
            className="input-field font-mono"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="1700000000 or 2026-11-18T00:00:00Z"
          />
          {tsAnalysis.valid ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <div className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="subtle-text">Unix Seconds</div>
                  <code className="font-mono">{tsAnalysis.epochSeconds}</code>
                </div>
                <CopyButton value={String(tsAnalysis.epochSeconds)} label="Copy" />
              </div>
              <div className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="subtle-text">Unix Milliseconds</div>
                  <code className="font-mono">{tsAnalysis.epochMs}</code>
                </div>
                <CopyButton value={String(tsAnalysis.epochMs)} label="Copy" />
              </div>
              <div className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="subtle-text">ISO-8601 UTC ({tsAnalysis.relative})</div>
                  <code className="font-mono" style={{ fontSize: '0.82rem' }}>{tsAnalysis.isoUtc}</code>
                </div>
                <CopyButton value={tsAnalysis.isoUtc ?? ''} label="Copy" />
              </div>
            </div>
          ) : (
            <div className="glass-panel badge-danger" style={{ padding: '0.8rem' }}>{tsAnalysis.error}</div>
          )}
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">Timezone Matrix</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {tzRows.map((row) => (
              <div
                key={row.tz}
                className="glass-panel"
                style={{ padding: '0.65rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}
              >
                <span className="glass-pill">{row.tz}</span>
                <span className="font-mono" style={{ fontSize: '0.84rem' }}>{row.formatted}</span>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  // Unit & Number Base Calculator
  const byteUnits: ByteUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'KiB', 'MiB', 'GiB', 'TiB'];
  const totalBytesNum = Number(byteMap.B.replace(/,/g, '')) || 0;
  const transferSeconds = bandwidthMbps > 0 ? (totalBytesNum * 8) / (bandwidthMbps * 1e6) : 0;

  return (
    <BentoGrid>
      <BentoCard span="6">
        <h2 className="section-title">Storage &amp; Bandwidth Calculator</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem' }}>
          <input
            type="number"
            className="input-field font-mono"
            min={0}
            value={byteValue}
            onChange={(e) => setByteValue(Math.max(0, Number(e.target.value)))}
            aria-label="Storage quantity"
          />
          <select
            className="select-field"
            value={byteUnit}
            onChange={(e) => setByteUnit(e.target.value as ByteUnit)}
            aria-label="Storage unit"
          >
            {byteUnits.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {byteUnits.map((u) => (
            <div key={u} className="glass-panel" style={{ padding: '0.55rem 0.65rem' }}>
              <div className="subtle-text">{u}</div>
              <div className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{byteMap[u]}</div>
            </div>
          ))}
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.83rem' }}>
          <span className="muted-text">Link Speed (Mbps) — Est. transfer: {transferSeconds.toFixed(2)}s</span>
          <input
            type="number"
            className="input-field font-mono"
            min={1}
            value={bandwidthMbps}
            onChange={(e) => setBandwidthMbps(Math.max(1, Number(e.target.value)))}
          />
        </label>
      </BentoCard>

      <BentoCard span="6">
        <h2 className="section-title">Number Base Converter (BigInt)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-field font-mono"
            value={baseValue}
            onChange={(e) => setBaseValue(e.target.value)}
            aria-label="Integer value"
          />
          <select
            className="select-field"
            value={baseRadix}
            onChange={(e) => setBaseRadix(Number(e.target.value) as 2 | 8 | 10 | 16)}
            aria-label="Input radix"
          >
            <option value={10}>Decimal (10)</option>
            <option value={16}>Hex (16)</option>
            <option value={2}>Binary (2)</option>
            <option value={8}>Octal (8)</option>
          </select>
        </div>

        {!radixMap.valid ? (
          <div className="glass-panel badge-danger" style={{ padding: '0.8rem' }}>{radixMap.error}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { label: 'Binary (Base 2)', val: radixMap.bin ?? '' },
              { label: 'Octal (Base 8)', val: radixMap.oct ?? '' },
              { label: 'Decimal (Base 10)', val: radixMap.dec ?? '' },
              { label: 'Hexadecimal (Base 16)', val: radixMap.hex ?? '' },
            ].map((row) => (
              <div key={row.label} className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ minWidth: 0 }}>
                  <div className="subtle-text">{row.label}</div>
                  <code className="font-mono" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{row.val}</code>
                </div>
                <CopyButton value={row.val} label="Copy" onCopied={onRun} />
              </div>
            ))}
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  );
}
