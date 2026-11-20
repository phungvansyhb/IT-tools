'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Cloud,
  HardDrive,
  Lightbulb,
  MessageSquare,
  MessageSquarePlus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import { useI18n } from '@/i18n/client';
import { getLocalizedTools } from '@/lib/tools/registry';
import {
  EMAIL_MAX,
  MESSAGE_MAX,
  MESSAGE_MIN,
  TITLE_MAX,
  buildSafeDebugContext,
  type FeedbackStatus,
  type FeedbackType,
  type FeedbackValidationErrorCode,
} from '@/lib/feedback';

export function FeedbackModal() {
  const {
    modalOpen,
    closeFeedbackModal,
    modalTab,
    setModalTab,
    modalType,
    setModalType,
    modalToolId,
    setModalToolId,
    modalTitle,
    setModalTitle,
  } = useFeedback();

  if (!modalOpen) return null;

  return (
    <FeedbackModalInner
      key={`${modalTab}-${modalType}-${modalToolId}`}
      onClose={closeFeedbackModal}
      modalTab={modalTab}
      setModalTab={setModalTab}
      modalType={modalType}
      setModalType={setModalType}
      modalToolId={modalToolId}
      setModalToolId={setModalToolId}
      modalTitle={modalTitle}
      setModalTitle={setModalTitle}
    />
  );
}

interface FeedbackModalInnerProps {
  onClose: () => void;
  modalTab: 'submit' | 'my';
  setModalTab: (tab: 'submit' | 'my') => void;
  modalType: FeedbackType;
  setModalType: (type: FeedbackType) => void;
  modalToolId: string;
  setModalToolId: (toolId: string) => void;
  modalTitle: string;
  setModalTitle: (title: string) => void;
}

function getStatusBadgeClass(status: FeedbackStatus): string {
  switch (status) {
    case 'open':
      return 'status-badge-open';
    case 'in_progress':
      return 'status-badge-in-progress';
    case 'resolved':
      return 'badge-success status-badge-resolved';
    case 'closed':
      return 'status-badge-closed';
  }
}

function FeedbackModalInner({
  onClose,
  modalTab,
  setModalTab,
  modalType,
  setModalType,
  modalToolId,
  setModalToolId,
  modalTitle,
  setModalTitle,
}: FeedbackModalInnerProps) {
  const { locale, t } = useI18n();
  const { theme } = useUserWorkspace();
  const { myFeedback, cooldownRemainingSec, syncMode, hydrated, submitFeedback } = useFeedback();

  const localizedTools = useMemo(() => getLocalizedTools(locale), [locale]);
  const toolNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const tool of localizedTools) {
      map.set(tool.id, tool.name);
    }
    return map;
  }, [localizedTools]);

  const [title, setTitle] = useState(modalTitle);
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [includeDebugContext, setIncludeDebugContext] = useState(false);
  const [showDebugPreview, setShowDebugPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [honeypotSuccess, setHoneypotSuccess] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const debugContextPreview = useMemo(() => {
    if (typeof window === 'undefined') {
      return buildSafeDebugContext({
        toolId: modalToolId,
        locale,
        pathname: '/',
        theme,
        viewport: '1280x720',
        platform: 'unknown',
        userAgent: 'unknown',
      });
    }
    return buildSafeDebugContext({
      toolId: modalToolId,
      locale,
      pathname: window.location.pathname,
      theme,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      platform: navigator.platform || 'unknown',
      userAgent: navigator.userAgent || 'unknown',
    });
  }, [modalToolId, locale, theme]);

  const translateError = (
    code: FeedbackValidationErrorCode | 'generic' | null | undefined,
    remainingSec?: number
  ): string => {
    switch (code) {
      case 'cooldown':
        return t('feedback.errors.cooldown', { seconds: remainingSec ?? cooldownRemainingSec });
      case 'invalid_type':
        return t('feedback.errors.invalid_type');
      case 'invalid_tool':
        return t('feedback.errors.invalid_tool');
      case 'title_too_long':
        return t('feedback.errors.title_too_long');
      case 'message_too_short':
        return t('feedback.errors.message_too_short', { min: MESSAGE_MIN });
      case 'message_too_long':
        return t('feedback.errors.message_too_long', { max: MESSAGE_MAX });
      case 'invalid_email':
        return t('feedback.errors.invalid_email');
      case 'email_too_long':
        return t('feedback.errors.email_too_long');
      default:
        return t('feedback.errors.generic');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    if (cooldownRemainingSec > 0) {
      setErrorBanner(translateError('cooldown', cooldownRemainingSec));
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitFeedback({
        type: modalType,
        toolId: modalToolId,
        title,
        message,
        contactEmail,
        website: honeypot,
        includeDebugContext,
        debugContext: includeDebugContext ? debugContextPreview : null,
      });

      if (res.honeypot) {
        setHoneypotSuccess(true);
        setSubmittedSuccess(true);
        return;
      }

      if (!res.ok) {
        setErrorBanner(translateError(res.errorCode, res.cooldownRemainingSec));
        return;
      }

      setHoneypotSuccess(false);
      setSubmittedSuccess(true);
      setTitle('');
      setModalTitle('');
      setMessage('');
      setContactEmail('');
      setHoneypot('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedSuccess(false);
    setHoneypotSuccess(false);
    setErrorBanner(null);
  };

  const formatTimestamp = (iso: string): string => {
    try {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return iso;
      return date.toLocaleString(locale === 'zh' ? 'zh-CN' : locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const getTypeLabel = (type: FeedbackType): string => {
    switch (type) {
      case 'bug':
        return t('feedback.typeBug');
      case 'feature':
        return t('feedback.typeFeature');
      default:
        return t('feedback.typeFeedback');
    }
  };

  const getStatusLabel = (status: FeedbackStatus): string => {
    switch (status) {
      case 'open':
        return t('feedback.status.open');
      case 'in_progress':
        return t('feedback.status.in_progress');
      case 'resolved':
        return t('feedback.status.resolved');
      case 'closed':
        return t('feedback.status.closed');
    }
  };

  return (
    <div
      className="glass-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t('feedback.modalAria')}
      onClick={onClose}
      style={{ paddingTop: '5vh', paddingBottom: '5vh' }}
    >
      <div
        className="glass-modal"
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessageSquarePlus size={18} style={{ color: 'var(--accent)' }} />
            <h2 className="section-title" style={{ fontSize: '1.05rem' }}>
              {t('feedback.modalTitle')}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label={t('feedback.closeModalAria')}
          >
            <X size={17} />
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          <button
            type="button"
            className={`glass-pill ${modalTab === 'submit' ? 'glass-pill-active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setModalTab('submit')}
          >
            {t('feedback.tabSubmit')}
          </button>
          <button
            type="button"
            className={`glass-pill ${modalTab === 'my' ? 'glass-pill-active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setModalTab('my')}
          >
            {t('feedback.tabMyFeedback', { count: hydrated ? myFeedback.length : 0 })}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {modalTab === 'submit' ? (
            submittedSuccess ? (
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.75rem',
                }}
              >
                <CheckCircle2 size={34} style={{ color: 'var(--accent)' }} />
                <h3 className="section-title">
                  {honeypotSuccess ? t('feedback.honeypotAck') : t('feedback.submitSuccessTitle')}
                </h3>
                {!honeypotSuccess && (
                  <p className="muted-text" style={{ margin: 0, fontSize: '0.88rem', maxWidth: '42ch' }}>
                    {t('feedback.submitSuccessDesc')}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.35rem' }}>
                  <button type="button" className="btn btn-primary" onClick={handleResetForm}>
                    {t('feedback.submitAnotherBtn')}
                  </button>
                  {!honeypotSuccess && (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setSubmittedSuccess(false);
                        setModalTab('my');
                      }}
                    >
                      {t('feedback.tabMyFeedback', { count: myFeedback.length })}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', position: 'relative' }}
              >
                {/* Hidden honeypot field */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="sr-only-honeypot"
                />

                {/* Type selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {t('feedback.typeLabel')}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {(
                      [
                        { id: 'feedback' as const, label: t('feedback.typeFeedback'), icon: MessageSquare },
                        { id: 'bug' as const, label: t('feedback.typeBug'), icon: Bug },
                        { id: 'feature' as const, label: t('feedback.typeFeature'), icon: Lightbulb },
                      ] as const
                    ).map((item) => {
                      const Icon = item.icon;
                      const active = modalType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`glass-pill ${active ? 'glass-pill-active' : ''}`}
                          style={{ cursor: 'pointer', padding: '0.4rem 0.8rem' }}
                          onClick={() => setModalType(item.id)}
                        >
                          <Icon size={14} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tool selector */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {t('feedback.toolLabel')}
                  </span>
                  <select
                    className="select-field"
                    value={modalToolId}
                    onChange={(e) => setModalToolId(e.target.value)}
                  >
                    <option value="general">{t('feedback.toolGeneral')}</option>
                    {localizedTools.map((tool) => (
                      <option key={tool.id} value={tool.id}>
                        {tool.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Optional title */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {t('feedback.titleLabel')}
                  </span>
                  <input
                    type="text"
                    className="input-field"
                    maxLength={TITLE_MAX}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setModalTitle(e.target.value);
                    }}
                    placeholder={t('feedback.titlePlaceholder')}
                  />
                </label>

                {/* Required message */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      {t('feedback.messageLabel')} *
                    </span>
                    <span className="subtle-text" style={{ fontSize: '0.74rem' }}>
                      {t('feedback.messageCounter', { count: message.length, max: MESSAGE_MAX })}
                    </span>
                  </div>
                  <textarea
                    className="textarea-field"
                    style={{ minHeight: '115px' }}
                    maxLength={MESSAGE_MAX}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errorBanner) setErrorBanner(null);
                    }}
                    placeholder={t('feedback.messagePlaceholder')}
                    required
                  />
                </label>

                {/* Optional contact email */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {t('feedback.emailLabel')}
                  </span>
                  <input
                    type="email"
                    className="input-field"
                    maxLength={EMAIL_MAX}
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder={t('feedback.emailPlaceholder')}
                  />
                </label>

                {/* Opt-in Debug Context */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '0.75rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.55rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={includeDebugContext}
                      onChange={(e) => setIncludeDebugContext(e.target.checked)}
                      style={{ marginTop: '0.2rem', accentColor: 'var(--accent)' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                        {t('feedback.debugOptInLabel')}
                      </span>
                      <span className="subtle-text" style={{ fontSize: '0.76rem', lineHeight: 1.4 }}>
                        {t('feedback.debugPrivacyHint')}
                      </span>
                    </div>
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowDebugPreview((v) => !v)}
                    >
                      {showDebugPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{t('feedback.debugPreviewToggle')}</span>
                    </button>
                  </div>

                  {showDebugPreview && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div className="subtle-text" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                        {t('feedback.debugPreviewTitle')}
                      </div>
                      <pre
                        className="font-mono"
                        style={{
                          margin: 0,
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--glass-border)',
                          fontSize: '0.74rem',
                          overflowX: 'auto',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {JSON.stringify(debugContextPreview, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                {errorBanner && (
                  <div
                    role="alert"
                    className="badge-danger"
                    style={{
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                    }}
                  >
                    {errorBanner}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', paddingTop: '0.25rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || cooldownRemainingSec > 0}
                  >
                    {cooldownRemainingSec > 0 ? (
                      <>
                        <Clock size={14} />
                        <span>{t('feedback.cooldownBtn', { seconds: cooldownRemainingSec })}</span>
                      </>
                    ) : submitting ? (
                      <span>{t('feedback.submittingBtn')}</span>
                    ) : (
                      <span>{t('feedback.submitBtn')}</span>
                    )}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Sync mode hint */}
              <div
                className="subtle-text"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                }}
              >
                {syncMode === 'supabase' ? (
                  <Cloud size={13} style={{ color: 'var(--accent)' }} />
                ) : (
                  <HardDrive size={13} />
                )}
                <span>
                  {syncMode === 'supabase'
                    ? t('feedback.syncModeSupabaseHint')
                    : t('feedback.syncModeLocalHint')}
                </span>
              </div>

              {!hydrated || myFeedback.length === 0 ? (
                <div
                  className="glass-panel"
                  style={{
                    padding: '1.5rem 1.25rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <ShieldCheck size={24} style={{ color: 'var(--text-muted)' }} />
                  <h3 className="section-title" style={{ fontSize: '0.96rem' }}>
                    {t('feedback.myEmptyTitle')}
                  </h3>
                  <p className="muted-text" style={{ margin: 0, fontSize: '0.84rem', maxWidth: '42ch' }}>
                    {t('feedback.myEmptyDesc')}
                  </p>
                </div>
              ) : (
                myFeedback.map((item) => {
                  const toolDisplayName =
                    item.toolId === 'general'
                      ? t('feedback.toolGeneral')
                      : (toolNameMap.get(item.toolId) ?? item.toolId);

                  return (
                    <article
                      key={item.id}
                      className="glass-panel"
                      style={{
                        padding: '0.9rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.45rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                          <span className="glass-pill">{getTypeLabel(item.type)}</span>
                          <span className="glass-pill">{toolDisplayName}</span>
                          <span className={`glass-pill ${getStatusBadgeClass(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                          {item.debugContext && (
                            <span className="glass-pill">{t('feedback.debugAttachedPill')}</span>
                          )}
                        </div>
                        <span className="subtle-text" style={{ fontSize: '0.74rem' }}>
                          {t('feedback.submittedAtLabel')}: {formatTimestamp(item.createdAt)}
                        </span>
                      </div>

                      {item.title && (
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.title}</div>
                      )}

                      <p
                        className="muted-text"
                        style={{
                          margin: 0,
                          fontSize: '0.86rem',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.message}
                      </p>

                      {item.adminNote && item.adminNote.trim().length > 0 && (
                        <div
                          style={{
                            marginTop: '0.25rem',
                            padding: '0.65rem 0.8rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--accent-glow)',
                            border: '1px solid var(--accent-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.2rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              color: 'var(--accent)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {t('feedback.adminReplyLabel')}
                          </span>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.84rem',
                              color: 'var(--text-primary)',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {item.adminNote}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
