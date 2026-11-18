'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useI18n } from '@/i18n/client';

interface CopyButtonProps {
  value: string;
  label?: string;
  size?: 'sm' | 'md';
  onCopied?: () => void;
}

export function CopyButton({ value, label, size = 'sm', onCopied }: CopyButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const displayLabel = label ?? t('actions.copy');

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback for restricted clipboard contexts
    }
  };

  return (
    <button
      type="button"
      className={`btn ${size === 'sm' ? 'btn-sm' : ''} ${copied ? 'glass-pill-active' : ''}`.trim()}
      onClick={handleCopy}
      disabled={!value}
      aria-label={displayLabel}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? t('actions.copied') : displayLabel}</span>
    </button>
  );
}
