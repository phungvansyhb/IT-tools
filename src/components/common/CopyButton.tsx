'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  label?: string;
  size?: 'sm' | 'md';
  onCopied?: () => void;
}

export function CopyButton({ value, label = 'Copy', size = 'sm', onCopied }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

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
      aria-label={label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}
