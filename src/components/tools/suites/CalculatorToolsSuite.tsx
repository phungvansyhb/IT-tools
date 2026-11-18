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
import { useI18n } from '@/i18n/client';
import { LOCALE_META } from '@/i18n/config';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

export function CalculatorToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
  const { locale, t } = useI18n();

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
  const [bandwidthMbps, setBandwidthMbps] = useState<number>(
    typeof initialState?.bandwidthMbps === 'number' ? initialState.bandwidthMbps : 100
  );
  const [baseValue, setBaseValue] = useState<string>(
    typeof initialState?.baseValue === 'string' ? initialState.baseValue : '255'
  );
  const [baseRadix, setBaseRadix] = useState<2 | 8 | 10 | 16>(
    initialState?.baseRadix === 2 ||
      initialState?.baseRadix === 8 ||
      initialState?.baseRadix === 10 ||
      initialState?.baseRadix === 16
      ? initialState.baseRadix
      : 10
  );

  const octal = useMemo(() => chmodToOctal(chmod), [chmod]);
  const symbolic = useMemo(() => chmodToSymbolic(chmod), [chmod]);

  useEffect(() => {
    onStateChange?.({
      octal,
      cronExpr,
      tsInput,
      byteValue,
      byteUnit,
      bandwidthMbps,
      baseValue,
      baseRadix,
    });
  }, [octal, cronExpr, tsInput, byteValue, byteUnit, bandwidthMbps, baseValue, baseRadix, onStateChange]);

  const cronAnalysis = useMemo(
    () => analyzeCronExpression(cronExpr, 5, undefined, locale),
    [cronExpr, locale]
  );
  const tsAnalysis = useMemo(
    () => analyzeTimestamp(tsInput, undefined, locale),
    [tsInput, locale]
  );
  const byteMap = useMemo(() => convertBytes(byteValue, byteUnit), [byteValue, byteUnit]);
  const radixMap = useMemo(
    () => convertNumberBase(baseValue, baseRadix, locale),
    [baseValue, baseRadix, locale]
  );

  if (toolId === 'chmod-calculator') {
    const roles: { key: keyof ChmodState; label: string }[] = [
      { key: 'owner', label: t('tools:calculatorSuite.roleOwner') },
      { key: 'group', label: t('tools:calculatorSuite.roleGroup') },
      { key: 'others', label: t('tools:calculatorSuite.roleOthers') },
    ];
    const perms: { key: 'read' | 'write' | 'execute'; label: string }[] = [
      { key: 'read', label: t('tools:calculatorSuite.permRead') },
      { key: 'write', label: t('tools:calculatorSuite.permWrite') },
      { key: 'execute', label: t('tools:calculatorSuite.permExecute') },
    ];

    return (
      <BentoGrid>
        <BentoCard span="7">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 className="section-title">{t('tools:calculatorSuite.permissionsMatrixTitle')}</h2>
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
                <th>{t('tools:calculatorSuite.thScope')}</th>
                <th>{t('tools:calculatorSuite.thRead')}</th>
                <th>{t('tools:calculatorSuite.thWrite')}</th>
                <th>{t('tools:calculatorSuite.thExecute')}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.key}>
                  <td style={{ fontWeight: 600 }}>{r.label}</td>
                  {perms.map((p) => (
                    <td key={p.key}>
                      <input
                        type="checkbox"
                        checked={chmod[r.key][p.key]}
                        aria-label={`${r.label} ${p.label}`}
                        onChange={(e) => {
                          const next: ChmodState = {
                            ...chmod,
                            [r.key]: { ...chmod[r.key], [p.key]: e.target.checked },
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
          <h2 className="section-title">{t('tools:calculatorSuite.octalSymbolicTitle')}</h2>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">{t('tools:calculatorSuite.octalModeLabel')}</span>
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
              <div className="subtle-text">{t('tools:calculatorSuite.symbolicLabel')}</div>
              <code className="font-mono" style={{ fontSize: '1rem', color: 'var(--accent)' }}>-{symbolic}</code>
            </div>
            <CopyButton value={`-${symbolic}`} label={t('actions.copy')} />
          </div>
          <div className="glass-panel" style={{ padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="subtle-text">{t('tools:calculatorSuite.shellCommandLabel')}</div>
              <code className="font-mono" style={{ fontSize: '0.92rem' }}>chmod {octal} &lt;path&gt;</code>
            </div>
            <CopyButton value={`chmod ${octal} `} label={t('actions.copy')} />
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'cron-calculator') {
    const presets = [
      { label: t('tools:calculatorSuite.presetEvery5Min'), expr: '*/5 * * * *' },
      { label: t('tools:calculatorSuite.presetHourly'), expr: '0 * * * *' },
      { label: t('tools:calculatorSuite.presetDaily'), expr: '30 2 * * *' },
      { label: t('tools:calculatorSuite.presetWeekdays'), expr: '0 9 * * 1-5' },
      { label: t('tools:calculatorSuite.presetMonthly'), expr: '0 0 1 * *' },
    ];

    return (
      <BentoGrid>
        <BentoCard span="6">
          <h2 className="section-title">{t('tools:calculatorSuite.cronTitle')}</h2>
          <input
            type="text"
            className="input-field font-mono"
            value={cronExpr}
            onChange={(e) => setCronExpr(e.target.value)}
            aria-label={t('tools:calculatorSuite.cronAria')}
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
            <h2 className="section-title">{t('tools:calculatorSuite.nextRunsTitle')}</h2>
            <CopyButton value={cronExpr} label={t('tools:calculatorSuite.copyCronBtn')} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {cronAnalysis.nextRuns.length === 0 ? (
              <p className="muted-text">{t('tools:calculatorSuite.cronEmptyHint')}</p>
            ) : (
              cronAnalysis.nextRuns.map((iso, idx) => (
                <div
                  key={iso}
                  className="glass-panel"
                  style={{ padding: '0.55rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span className="subtle-text">
                    {t('tools:calculatorSuite.runIndex', { index: idx + 1 })}
                  </span>
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
    const intlLocale = LOCALE_META[locale].htmlLang;
    const tzRows = tsAnalysis.valid && tsAnalysis.epochMs
      ? ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Ho_Chi_Minh'].map((tz) => ({
          tz,
          formatted: new Intl.DateTimeFormat(intlLocale, {
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
            <h2 className="section-title">{t('tools:calculatorSuite.epochTitle')}</h2>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setTsInput(String(Math.floor(Date.now() / 1000)));
                onRun?.();
              }}
            >
              <Clock size={14} /> {t('tools:calculatorSuite.nowBtn')}
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
                  <div className="subtle-text">{t('tools:calculatorSuite.unixSecondsLabel')}</div>
                  <code className="font-mono">{tsAnalysis.epochSeconds}</code>
                </div>
                <CopyButton value={String(tsAnalysis.epochSeconds)} label={t('actions.copy')} />
              </div>
              <div className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="subtle-text">{t('tools:calculatorSuite.unixMsLabel')}</div>
                  <code className="font-mono">{tsAnalysis.epochMs}</code>
                </div>
                <CopyButton value={String(tsAnalysis.epochMs)} label={t('actions.copy')} />
              </div>
              <div className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="subtle-text">
                    {t('tools:calculatorSuite.isoUtcLabel', { relative: tsAnalysis.relative })}
                  </div>
                  <code className="font-mono" style={{ fontSize: '0.82rem' }}>{tsAnalysis.isoUtc}</code>
                </div>
                <CopyButton value={tsAnalysis.isoUtc ?? ''} label={t('actions.copy')} />
              </div>
            </div>
          ) : (
            <div className="glass-panel badge-danger" style={{ padding: '0.8rem' }}>{tsAnalysis.error}</div>
          )}
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">{t('tools:calculatorSuite.timezoneMatrixTitle')}</h2>
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
        <h2 className="section-title">{t('tools:calculatorSuite.storageBandwidthTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem' }}>
          <input
            type="number"
            className="input-field font-mono"
            min={0}
            value={byteValue}
            onChange={(e) => setByteValue(Math.max(0, Number(e.target.value)))}
            aria-label={t('tools:calculatorSuite.storageQuantityAria')}
          />
          <select
            className="select-field"
            value={byteUnit}
            onChange={(e) => setByteUnit(e.target.value as ByteUnit)}
            aria-label={t('tools:calculatorSuite.storageUnitAria')}
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
          <span className="muted-text">
            {t('tools:calculatorSuite.linkSpeedLabel', { seconds: transferSeconds.toFixed(2) })}
          </span>
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
        <h2 className="section-title">{t('tools:calculatorSuite.numberBaseTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-field font-mono"
            value={baseValue}
            onChange={(e) => setBaseValue(e.target.value)}
            aria-label={t('tools:calculatorSuite.integerValueAria')}
          />
          <select
            className="select-field"
            value={baseRadix}
            onChange={(e) => setBaseRadix(Number(e.target.value) as 2 | 8 | 10 | 16)}
            aria-label={t('tools:calculatorSuite.inputRadixAria')}
          >
            <option value={10}>{t('tools:calculatorSuite.radixDec')}</option>
            <option value={16}>{t('tools:calculatorSuite.radixHex')}</option>
            <option value={2}>{t('tools:calculatorSuite.radixBin')}</option>
            <option value={8}>{t('tools:calculatorSuite.radixOct')}</option>
          </select>
        </div>

        {!radixMap.valid ? (
          <div className="glass-panel badge-danger" style={{ padding: '0.8rem' }}>{radixMap.error}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { label: t('tools:calculatorSuite.baseBinLabel'), val: radixMap.bin ?? '' },
              { label: t('tools:calculatorSuite.baseOctLabel'), val: radixMap.oct ?? '' },
              { label: t('tools:calculatorSuite.baseDecLabel'), val: radixMap.dec ?? '' },
              { label: t('tools:calculatorSuite.baseHexLabel'), val: radixMap.hex ?? '' },
            ].map((row) => (
              <div key={row.label} className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ minWidth: 0 }}>
                  <div className="subtle-text">{row.label}</div>
                  <code className="font-mono" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{row.val}</code>
                </div>
                <CopyButton value={row.val} label={t('actions.copy')} onCopied={onRun} />
              </div>
            ))}
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  );
}
