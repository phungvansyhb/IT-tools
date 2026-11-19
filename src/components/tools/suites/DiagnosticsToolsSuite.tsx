'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import type { ToolSuiteProps } from '@/components/tools/suites/types';
import { KeyboardTesterPanel } from '@/components/tools/suites/diagnostics/KeyboardTesterPanel';
import { MicTesterPanel } from '@/components/tools/suites/diagnostics/MicTesterPanel';
import { SpeakerTesterPanel } from '@/components/tools/suites/diagnostics/SpeakerTesterPanel';
import { SpeedTestPanel } from '@/components/tools/suites/diagnostics/SpeedTestPanel';

export function DiagnosticsToolsSuite({
  toolId,
  initialState,
  onStateChange,
  onRun,
}: ToolSuiteProps) {
  switch (toolId) {
    case 'keyboard-tester':
      return (
        <KeyboardTesterPanel
          initialState={initialState}
          onStateChange={onStateChange}
          onRun={onRun}
        />
      );
    case 'mic-tester':
      return (
        <MicTesterPanel
          initialState={initialState}
          onStateChange={onStateChange}
          onRun={onRun}
        />
      );
    case 'speaker-tester':
      return (
        <SpeakerTesterPanel
          initialState={initialState}
          onStateChange={onStateChange}
          onRun={onRun}
        />
      );
    case 'speed-test':
      return (
        <SpeedTestPanel
          initialState={initialState}
          onStateChange={onStateChange}
          onRun={onRun}
        />
      );
    default:
      return (
        <BentoGrid>
          <BentoCard span="12">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Activity size={18} style={{ color: 'var(--accent)' }} />
              <span className="muted-text">{toolId}</span>
            </div>
          </BentoCard>
        </BentoGrid>
      );
  }
}
