'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Bug,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  MessageSquarePlus,
} from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { useFeedback } from '@/hooks/useFeedback';

export interface InfoFeedbackActionsProps {
  variant: 'help' | 'contact';
  supportEmail: string | null;
  githubUrl: string;
}

export function InfoFeedbackActions({
  variant,
  supportEmail,
  githubUrl,
}: InfoFeedbackActionsProps) {
  const { bundle, t } = useI18n();
  const { openFeedbackModal } = useFeedback();
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    if (!supportEmail) return;
    try {
      await navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  const shared = bundle.pages.shared;
  const contact = bundle.pages.contact;

  if (variant === 'help') {
    return (
      <section className="bento-card glass-surface info-page-card" aria-label={contact.channelsHeading}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h2 className="section-title">{t('feedback.quickCtaTitle')}</h2>
            <p className="muted-text" style={{ margin: 0, fontSize: '0.88rem' }}>
              {t('feedback.quickCtaDesc')}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                openFeedbackModal({
                  defaultToolId: 'general',
                  defaultTab: 'submit',
                  defaultType: 'bug',
                })
              }
            >
              <Bug size={15} aria-hidden="true" />
              <span>{shared.openFeedbackBtn}</span>
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                openFeedbackModal({
                  defaultToolId: 'general',
                  defaultTab: 'my',
                })
              }
            >
              <MessageSquare size={15} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              <span>{shared.viewMyFeedbackBtn}</span>
            </button>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <span>{shared.openGithubBtn}</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="info-page-stack" aria-labelledby="contact-channels-heading">
      <h2 id="contact-channels-heading" className="section-title">
        {contact.channelsHeading}
      </h2>

      <div className="info-page-contact-grid">
        {/* Card 1: Feedback & Support Modal */}
        <article className="bento-card glass-surface info-page-contact-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--accent-border)',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}
              >
                <MessageSquarePlus size={17} aria-hidden="true" />
              </span>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>
                {contact.feedbackCardTitle}
              </h3>
            </div>
            <p className="info-page-body" style={{ fontSize: '0.86rem' }}>
              {contact.feedbackCardDesc}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                openFeedbackModal({
                  defaultToolId: 'general',
                  defaultTab: 'submit',
                  defaultType: 'feedback',
                })
              }
            >
              <MessageSquarePlus size={14} aria-hidden="true" />
              <span>{shared.openFeedbackBtn}</span>
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() =>
                openFeedbackModal({
                  defaultToolId: 'general',
                  defaultTab: 'my',
                })
              }
            >
              <MessageSquare size={14} aria-hidden="true" />
              <span>{shared.viewMyFeedbackBtn}</span>
            </button>
          </div>
        </article>

        {/* Card 2: GitHub Repository */}
        <article className="bento-card glass-surface info-page-contact-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--glass-pill-bg)',
                  border: '1px solid var(--glass-border-highlight)',
                  color: 'var(--text-primary)',
                  flexShrink: 0,
                }}
              >
                <ExternalLink size={17} aria-hidden="true" />
              </span>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>
                {contact.githubCardTitle}
              </h3>
            </div>
            <p className="info-page-body" style={{ fontSize: '0.86rem' }}>
              {contact.githubCardDesc}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
            >
              <span>{shared.openGithubBtn}</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </article>

        {/* Card 3: Direct Support Email (NFR-21 safe fallback when null) */}
        <article className="bento-card glass-surface info-page-contact-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--glass-pill-bg)',
                  border: '1px solid var(--glass-border-highlight)',
                  color: 'var(--text-primary)',
                  flexShrink: 0,
                }}
              >
                <Mail size={17} aria-hidden="true" />
              </span>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>
                {contact.emailCardTitle}
              </h3>
            </div>
            <p className="info-page-body" style={{ fontSize: '0.86rem' }}>
              {contact.emailCardDesc}
            </p>
            {supportEmail === null && (
              <p className="subtle-text" style={{ margin: 0, lineHeight: 1.5 }}>
                {shared.noEmailNotice}
              </p>
            )}
          </div>

          {supportEmail !== null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href={`mailto:${supportEmail}`}
                className="font-mono"
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--accent)',
                  wordBreak: 'break-all',
                }}
                aria-label={`${shared.emailLabel}: ${supportEmail}`}
              >
                {supportEmail}
              </a>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={handleCopyEmail}
                >
                  {copied ? (
                    <Check size={13} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                  ) : (
                    <Copy size={13} aria-hidden="true" />
                  )}
                  <span>{copied ? shared.copiedEmailBtn : shared.copyEmailBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  openFeedbackModal({
                    defaultToolId: 'general',
                    defaultTab: 'submit',
                    defaultType: 'feedback',
                  })
                }
              >
                <MessageSquarePlus size={14} aria-hidden="true" />
                <span>{shared.openFeedbackBtn}</span>
              </button>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
