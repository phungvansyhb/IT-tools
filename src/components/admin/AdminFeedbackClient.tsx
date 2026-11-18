'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cloud,
  Filter,
  HardDrive,
  Lightbulb,
  Lock,
  LogOut,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Trash2,
} from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { useFeedback } from '@/hooks/useFeedback';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { getLocalizedTools } from '@/lib/tools/registry';
import {
  ADMIN_NOTE_MAX,
  FEEDBACK_STATUSES,
  aggregateToolRatings,
  deleteLocalFeedback,
  deleteLocalRating,
  filterAdminRecords,
  readLocalFeedback,
  readLocalRatings,
  updateLocalFeedback,
  validateAdminUpdate,
  type AdminStatusFilter,
  type AdminTypeFilter,
  type FeedbackStatus,
  type FeedbackSubmission,
  type FeedbackType,
  type ToolRatingEntry,
} from '@/lib/feedback';
import {
  checkIsFeedbackAdmin,
  deleteAdminFeedbackSubmission,
  deleteAdminToolRating,
  fetchAdminFeedbackSubmissions,
  fetchAdminToolRatings,
  getAdminSession,
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
  updateAdminFeedbackSubmission,
} from '@/lib/supabase/client';

type AdminAuthState = 'checking' | 'signed_out' | 'not_allowlisted' | 'authenticated';

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

export function AdminFeedbackClient() {
  const { locale, t } = useI18n();
  const { refreshFeedbackData } = useFeedback();

  const supabaseEnabled = isSupabaseConfigured();
  const localizedTools = useMemo(() => getLocalizedTools(locale), [locale]);
  const toolNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const tool of localizedTools) {
      map.set(tool.id, tool.name);
    }
    return map;
  }, [localizedTools]);

  // Auth state (Supabase mode only)
  const [authState, setAuthState] = useState<AdminAuthState>(
    supabaseEnabled ? 'checking' : 'authenticated'
  );
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminEmailDisplay, setAdminEmailDisplay] = useState<string>('');

  // Moderation data
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [ratings, setRatings] = useState<ToolRatingEntry[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState<AdminTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>('all');
  const [toolFilter, setToolFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Per-item draft editors, debug drawers, save indicators & 2-step delete confirmations
  const [draftEdits, setDraftEdits] = useState<
    Record<string, { status: FeedbackStatus; adminNote: string }>
  >({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});
  const [expandedDebugIds, setExpandedDebugIds] = useState<Record<string, boolean>>({});
  const [confirmDeleteKeys, setConfirmDeleteKeys] = useState<Record<string, boolean>>({});
  const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({});

  const seedDrafts = useCallback((rows: FeedbackSubmission[]) => {
    const nextDrafts: Record<string, { status: FeedbackStatus; adminNote: string }> = {};
    for (const row of rows) {
      nextDrafts[row.id] = {
        status: row.status,
        adminNote: row.adminNote ?? '',
      };
    }
    setDraftEdits(nextDrafts);
  }, []);

  const loadModerationData = useCallback(async () => {
    setLoadingData(true);
    try {
      if (!supabaseEnabled) {
        const localSubs = readLocalFeedback();
        const localRats = readLocalRatings();
        setSubmissions(localSubs);
        setRatings(localRats);
        seedDrafts(localSubs);
        return;
      }

      const [remoteSubs, remoteRats] = await Promise.all([
        fetchAdminFeedbackSubmissions(),
        fetchAdminToolRatings(),
      ]);
      const nextSubs = remoteSubs ?? [];
      const nextRats = remoteRats ?? [];
      setSubmissions(nextSubs);
      setRatings(nextRats);
      seedDrafts(nextSubs);
    } finally {
      setLoadingData(false);
    }
  }, [supabaseEnabled, seedDrafts]);

  const verifySupabaseSession = useCallback(async () => {
    if (!supabaseEnabled) {
      setAuthState('authenticated');
      await loadModerationData();
      return;
    }

    setAuthState('checking');
    const session = await getAdminSession();
    if (!session) {
      setAdminEmailDisplay('');
      setAuthState('signed_out');
      return;
    }

    const isAllowed = await checkIsFeedbackAdmin();
    setAdminEmailDisplay(session.user?.email ?? '');
    if (!isAllowed) {
      setAuthState('not_allowlisted');
      return;
    }

    setAuthState('authenticated');
    await loadModerationData();
  }, [supabaseEnabled, loadModerationData]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        void verifySupabaseSession();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [verifySupabaseSession]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSigningIn(true);
    try {
      const res = await signInAdmin(authEmail.trim(), authPassword);
      if (!res.ok) {
        if (res.error && res.error.toLowerCase().includes('allowlist')) {
          setAuthError(t('adminFeedback.authNotAllowlisted'));
        } else {
          setAuthError(t('adminFeedback.authInvalidCredentials'));
        }
        return;
      }
      setAuthPassword('');
      await verifySupabaseSession();
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setSubmissions([]);
    setRatings([]);
    setAdminEmailDisplay('');
    setAuthError(null);
    setAuthState('signed_out');
  };

  const handleRefresh = async () => {
    await loadModerationData();
    await refreshFeedbackData();
  };

  const handleSaveSubmission = async (item: FeedbackSubmission) => {
    const draft = draftEdits[item.id] ?? {
      status: item.status,
      adminNote: item.adminNote ?? '',
    };

    const validation = validateAdminUpdate({
      status: draft.status,
      adminNote: draft.adminNote,
    });

    if (!validation.ok || !validation.sanitized) {
      setItemErrors((prev) => ({
        ...prev,
        [item.id]: t('adminFeedback.invalidStatusOrNote'),
      }));
      return;
    }

    setItemErrors((prev) => {
      const copy = { ...prev };
      delete copy[item.id];
      return copy;
    });
    setSavingIds((prev) => ({ ...prev, [item.id]: true }));
    setSavedIds((prev) => ({ ...prev, [item.id]: false }));

    try {
      const sanitized = validation.sanitized;
      if (!supabaseEnabled) {
        const updatedList = updateLocalFeedback(item.id, {
          status: sanitized.status,
          adminNote: sanitized.adminNote,
        });
        setSubmissions(updatedList);
      } else {
        const ok = await updateAdminFeedbackSubmission(item.id, sanitized);
        if (!ok) {
          setItemErrors((prev) => ({
            ...prev,
            [item.id]: t('feedback.errors.generic'),
          }));
          return;
        }
        const nowIso = new Date().toISOString();
        setSubmissions((prev) =>
          prev.map((row) =>
            row.id === item.id
              ? {
                  ...row,
                  status: sanitized.status,
                  adminNote: sanitized.adminNote,
                  updatedAt: nowIso,
                }
              : row
          )
        );
      }

      setDraftEdits((prev) => ({
        ...prev,
        [item.id]: {
          status: sanitized.status,
          adminNote: sanitized.adminNote,
        },
      }));
      setSavedIds((prev) => ({ ...prev, [item.id]: true }));
      await refreshFeedbackData();
    } finally {
      setSavingIds((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    const key = `fb:${id}`;
    setDeletingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      if (!supabaseEnabled) {
        const nextList = deleteLocalFeedback(id);
        setSubmissions(nextList);
      } else {
        const ok = await deleteAdminFeedbackSubmission(id);
        if (!ok) {
          setItemErrors((prev) => ({
            ...prev,
            [id]: t('feedback.errors.generic'),
          }));
          return;
        }
        setSubmissions((prev) => prev.filter((row) => row.id !== id));
      }
      setConfirmDeleteKeys((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      await refreshFeedbackData();
    } finally {
      setDeletingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleDeleteRating = async (id: string) => {
    const key = `rt:${id}`;
    setDeletingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      if (!supabaseEnabled) {
        const nextRatings = deleteLocalRating(id);
        setRatings(nextRatings);
      } else {
        const ok = await deleteAdminToolRating(id);
        if (!ok) return;
        setRatings((prev) => prev.filter((row) => row.id !== id));
      }
      setConfirmDeleteKeys((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      await refreshFeedbackData();
    } finally {
      setDeletingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  // KPI metrics
  const kpiStats = useMemo(() => {
    const totalFeedback = submissions.length;
    const openQueue = submissions.filter(
      (s) => s.status === 'open' || s.status === 'in_progress'
    ).length;
    const resolvedCount = submissions.filter((s) => s.status === 'resolved').length;

    const ratingCount = ratings.length;
    const ratingSum = ratings.reduce((acc, item) => acc + (Number(item.rating) || 0), 0);
    const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : '0.0';
    const perToolCount = Object.keys(aggregateToolRatings(ratings)).length;

    return {
      totalFeedback,
      openQueue,
      resolvedCount,
      ratingCount,
      avgRating,
      perToolCount,
    };
  }, [submissions, ratings]);

  // Filtered records
  const filtered = useMemo(
    () =>
      filterAdminRecords({
        submissions,
        ratings,
        typeFilter,
        statusFilter,
        toolFilter,
        query: searchQuery,
      }),
    [submissions, ratings, typeFilter, statusFilter, toolFilter, searchQuery]
  );

  const totalMatches = filtered.submissions.length + filtered.ratings.length;
  const hasActiveFilters =
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    toolFilter !== 'all' ||
    searchQuery.trim().length > 0;

  const formatTimestamp = (iso: string): string => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleString(locale === 'zh' ? 'zh-CN' : locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const getToolLabel = (toolId: string): string => {
    if (toolId === 'general') return t('feedback.toolGeneral');
    return toolNameMap.get(toolId) ?? toolId;
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

  const getTypeIcon = (type: FeedbackType) => {
    switch (type) {
      case 'bug':
        return <Bug size={12} />;
      case 'feature':
        return <Lightbulb size={12} />;
      default:
        return <MessageSquare size={12} />;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bento Card */}
      <BentoGrid>
        <BentoCard span="12">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="glass-pill">
                  <ShieldCheck size={13} style={{ color: 'var(--accent)' }} />
                  <span>OmniDev Admin</span>
                </span>
                {supabaseEnabled ? (
                  <span className="glass-pill badge-success">
                    <Cloud size={13} />
                    <span>{t('adminFeedback.supabaseModeBadge')}</span>
                  </span>
                ) : (
                  <span className="glass-pill badge-warning">
                    <HardDrive size={13} />
                    <span>{t('adminFeedback.localModeBannerTitle')}</span>
                  </span>
                )}
              </div>
              <h1 className="page-title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                {t('adminFeedback.heading')}
              </h1>
              <p className="muted-text" style={{ margin: 0, maxWidth: '68ch', fontSize: '0.92rem' }}>
                {t('adminFeedback.subtitle')}
              </p>
            </div>

            {authState === 'authenticated' && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                {supabaseEnabled && adminEmailDisplay && (
                  <span className="subtle-text" style={{ fontSize: '0.8rem' }}>
                    {adminEmailDisplay}
                  </span>
                )}
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={handleRefresh}
                  disabled={loadingData}
                >
                  <RefreshCw size={14} />
                  <span>{t('adminFeedback.refreshBtn')}</span>
                </button>
                {supabaseEnabled && (
                  <button type="button" className="btn btn-sm" onClick={handleSignOut}>
                    <LogOut size={14} />
                    <span>{t('adminFeedback.signOutBtn')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {!supabaseEnabled && (
            <div
              className="badge-warning"
              role="status"
              style={{
                marginTop: '0.35rem',
                padding: '0.75rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
              }}
            >
              <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <strong style={{ fontSize: '0.86rem' }}>{t('adminFeedback.localModeBannerTitle')}</strong>
                <span style={{ fontSize: '0.82rem', opacity: 0.95 }}>
                  {t('adminFeedback.localModeBannerDesc')}
                </span>
              </div>
            </div>
          )}
        </BentoCard>
      </BentoGrid>

      {/* Supabase Auth Gate */}
      {supabaseEnabled && authState !== 'authenticated' && (
        <BentoGrid>
          <BentoCard span="12">
            {authState === 'checking' ? (
              <div className="muted-text" style={{ padding: '1.5rem 0', fontSize: '0.9rem' }}>
                ...
              </div>
            ) : authState === 'not_allowlisted' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  maxWidth: '520px',
                }}
              >
                <div
                  className="badge-danger"
                  role="alert"
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{t('adminFeedback.authNotAllowlisted')}</span>
                </div>
                {adminEmailDisplay && (
                  <div className="subtle-text" style={{ fontSize: '0.82rem' }}>
                    {adminEmailDisplay}
                  </div>
                )}
                <button type="button" className="btn" onClick={handleSignOut}>
                  <LogOut size={15} />
                  <span>{t('adminFeedback.signOutBtn')}</span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSignIn}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  maxWidth: '440px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Lock size={18} style={{ color: 'var(--accent)' }} />
                  <h2 className="section-title">{t('adminFeedback.authTitle')}</h2>
                </div>
                <p className="muted-text" style={{ margin: 0, fontSize: '0.86rem' }}>
                  {t('adminFeedback.authSubtitle')}
                </p>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {t('adminFeedback.emailLabel')}
                  </span>
                  <input
                    type="email"
                    className="input-field"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={t('adminFeedback.emailPlaceholder')}
                    autoComplete="email"
                    required
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {t('adminFeedback.passwordLabel')}
                  </span>
                  <input
                    type="password"
                    className="input-field"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder={t('adminFeedback.passwordPlaceholder')}
                    autoComplete="current-password"
                    required
                  />
                </label>

                {authError && (
                  <div
                    role="alert"
                    className="badge-danger"
                    style={{
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                    }}
                  >
                    {authError}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-primary" disabled={signingIn}>
                    {signingIn ? t('adminFeedback.signingInBtn') : t('adminFeedback.signInBtn')}
                  </button>
                </div>

                <p className="subtle-text" style={{ margin: 0, fontSize: '0.78rem' }}>
                  {t('adminFeedback.authNoSignupHint')}
                </p>
              </form>
            )}
          </BentoCard>
        </BentoGrid>
      )}

      {/* Authenticated Moderation Workspace (Local Mode or Allowlisted Supabase Admin) */}
      {authState === 'authenticated' && (
        <>
          {/* KPI Bento Row */}
          <BentoGrid>
            <BentoCard span="3">
              <span className="subtle-text">{t('adminFeedback.kpiTotalFeedback')}</span>
              <strong style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {kpiStats.totalFeedback}
              </strong>
            </BentoCard>
            <BentoCard span="3">
              <span className="subtle-text">{t('adminFeedback.kpiOpenQueue')}</span>
              <strong
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: kpiStats.openQueue > 0 ? 'var(--warning)' : 'var(--text-primary)',
                }}
              >
                {kpiStats.openQueue}
              </strong>
            </BentoCard>
            <BentoCard span="3">
              <span className="subtle-text">{t('adminFeedback.kpiResolved')}</span>
              <strong
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--accent)',
                }}
              >
                {kpiStats.resolvedCount}
              </strong>
            </BentoCard>
            <BentoCard span="3">
              <span className="subtle-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={13} fill="currentColor" style={{ color: 'var(--warning)' }} />
                <span>{t('adminFeedback.filterRatingsOnly')}</span>
              </span>
              <strong style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {t('adminFeedback.kpiRatingsAvg', {
                  avg: kpiStats.avgRating,
                  count: kpiStats.ratingCount,
                })}
              </strong>
            </BentoCard>
          </BentoGrid>

          {/* Multi-Filter Bar */}
          <BentoGrid>
            <BentoCard span="12">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Filter size={15} style={{ color: 'var(--accent)' }} />
                  <span className="glass-pill">
                    {t('adminFeedback.resultsCount', { count: totalMatches })}
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setTypeFilter('all');
                      setStatusFilter('all');
                      setToolFilter('all');
                      setSearchQuery('');
                    }}
                  >
                    {t('adminFeedback.clearFiltersBtn')}
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {/* Type filter */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="subtle-text" style={{ fontSize: '0.76rem', fontWeight: 600 }}>
                    {t('adminFeedback.filterTypeLabel')}
                  </span>
                  <select
                    className="select-field"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as AdminTypeFilter)}
                  >
                    <option value="all">{t('adminFeedback.filterAllTypes')}</option>
                    <option value="feedback">{t('feedback.typeFeedback')}</option>
                    <option value="bug">{t('feedback.typeBug')}</option>
                    <option value="feature">{t('feedback.typeFeature')}</option>
                    <option value="rating">{t('adminFeedback.filterRatingsOnly')}</option>
                  </select>
                </label>

                {/* Status filter */}
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    opacity: typeFilter === 'rating' ? 0.5 : 1,
                  }}
                >
                  <span className="subtle-text" style={{ fontSize: '0.76rem', fontWeight: 600 }}>
                    {t('adminFeedback.filterStatusLabel')}
                  </span>
                  <select
                    className="select-field"
                    value={statusFilter}
                    disabled={typeFilter === 'rating'}
                    onChange={(e) => setStatusFilter(e.target.value as AdminStatusFilter)}
                  >
                    <option value="all">{t('adminFeedback.filterAllStatuses')}</option>
                    {FEEDBACK_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {getStatusLabel(st)}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Tool filter */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="subtle-text" style={{ fontSize: '0.76rem', fontWeight: 600 }}>
                    {t('adminFeedback.filterToolLabel')}
                  </span>
                  <select
                    className="select-field"
                    value={toolFilter}
                    onChange={(e) => setToolFilter(e.target.value)}
                  >
                    <option value="all">{t('adminFeedback.filterAllTools')}</option>
                    <option value="general">{t('feedback.toolGeneral')}</option>
                    {localizedTools.map((tool) => (
                      <option key={tool.id} value={tool.id}>
                        {tool.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Search input */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="subtle-text" style={{ fontSize: '0.76rem', fontWeight: 600 }}>
                    {t('adminFeedback.searchAria')}
                  </span>
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="search"
                      className="input-field"
                      style={{ paddingLeft: '2.2rem' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('adminFeedback.searchPlaceholder')}
                      aria-label={t('adminFeedback.searchAria')}
                    />
                  </div>
                </label>
              </div>
            </BentoCard>
          </BentoGrid>

          {/* Moderation List */}
          {totalMatches === 0 ? (
            <BentoGrid>
              <BentoCard span="12">
                <p className="muted-text" style={{ margin: '1rem 0', textAlign: 'center' }}>
                  {t('adminFeedback.emptyState')}
                </p>
              </BentoCard>
            </BentoGrid>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Feedback Submissions */}
              {filtered.submissions.map((item) => {
                const draft = draftEdits[item.id] ?? {
                  status: item.status,
                  adminNote: item.adminNote ?? '',
                };
                const debugOpen = Boolean(expandedDebugIds[item.id]);
                const deleteKey = `fb:${item.id}`;
                const confirmingDelete = Boolean(confirmDeleteKeys[deleteKey]);
                const isDeleting = Boolean(deletingKeys[deleteKey]);
                const isSaving = Boolean(savingIds[item.id]);
                const isSaved = Boolean(savedIds[item.id]);
                const itemError = itemErrors[item.id];

                return (
                  <div
                    key={item.id}
                    className="bento-card glass-surface"
                    style={{ gap: '0.85rem' }}
                  >
                    {/* Top meta row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span className="glass-pill">
                          {getTypeIcon(item.type)}
                          <span>{getTypeLabel(item.type)}</span>
                        </span>
                        <span className={`glass-pill ${getStatusBadgeClass(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                        <span className="glass-pill">{getToolLabel(item.toolId)}</span>
                        <span className="glass-pill font-mono" style={{ fontSize: '0.72rem' }}>
                          {t('adminFeedback.clientIdShort', { id: item.clientId.slice(0, 8) })}
                        </span>
                        {item.contactEmail && (
                          <span className="glass-pill">
                            {t('adminFeedback.contactEmailLabel')}: {item.contactEmail}
                          </span>
                        )}
                      </div>

                      <span className="subtle-text" style={{ fontSize: '0.76rem' }}>
                        {formatTimestamp(item.createdAt)}
                      </span>
                    </div>

                    {/* Title & Message */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {item.title && (
                        <h3 className="section-title" style={{ fontSize: '1rem' }}>
                          {item.title}
                        </h3>
                      )}
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.message}
                      </p>
                    </div>

                    {/* Optional Debug Context Drawer */}
                    {item.debugContext && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <div>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() =>
                              setExpandedDebugIds((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                          >
                            {debugOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            <span>{t('adminFeedback.debugContextToggle')}</span>
                          </button>
                        </div>
                        {debugOpen && (
                          <pre
                            className="font-mono"
                            style={{
                              margin: 0,
                              padding: '0.7rem 0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-input)',
                              border: '1px solid var(--glass-border)',
                              fontSize: '0.75rem',
                              overflowX: 'auto',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {JSON.stringify(item.debugContext, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    {/* Moderation Editor Row */}
                    <div
                      className="glass-panel"
                      style={{
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.7rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(170px, 220px) minmax(0, 1fr)',
                          gap: '0.75rem',
                          alignItems: 'start',
                        }}
                      >
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span className="subtle-text" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                            {t('adminFeedback.statusFieldLabel')}
                          </span>
                          <select
                            className="select-field"
                            value={draft.status}
                            onChange={(e) => {
                              const nextStatus = e.target.value as FeedbackStatus;
                              setDraftEdits((prev) => ({
                                ...prev,
                                [item.id]: { ...draft, status: nextStatus },
                              }));
                              setSavedIds((prev) => ({ ...prev, [item.id]: false }));
                            }}
                          >
                            {FEEDBACK_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {getStatusLabel(st)}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span className="subtle-text" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                            {t('adminFeedback.adminNoteLabel')}
                          </span>
                          <textarea
                            className="textarea-field"
                            style={{ minHeight: '72px' }}
                            maxLength={ADMIN_NOTE_MAX}
                            value={draft.adminNote}
                            onChange={(e) => {
                              const nextNote = e.target.value;
                              setDraftEdits((prev) => ({
                                ...prev,
                                [item.id]: { ...draft, adminNote: nextNote },
                              }));
                              setSavedIds((prev) => ({ ...prev, [item.id]: false }));
                            }}
                            placeholder={t('adminFeedback.adminNotePlaceholder')}
                          />
                        </label>
                      </div>

                      {itemError && (
                        <div
                          role="alert"
                          className="badge-danger"
                          style={{
                            padding: '0.45rem 0.7rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                          }}
                        >
                          {itemError}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={isSaving}
                            onClick={() => handleSaveSubmission(item)}
                          >
                            <span>{t('adminFeedback.saveUpdateBtn')}</span>
                          </button>
                          {isSaved && (
                            <span
                              className="glass-pill badge-success"
                              role="status"
                              style={{ padding: '0.2rem 0.55rem' }}
                            >
                              <CheckCircle2 size={12} />
                              <span>{t('adminFeedback.savedBadge')}</span>
                            </span>
                          )}
                        </div>

                        {/* 2-step confirmed Delete */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {!confirmingDelete ? (
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{ color: 'var(--danger)' }}
                              onClick={() =>
                                setConfirmDeleteKeys((prev) => ({ ...prev, [deleteKey]: true }))
                              }
                            >
                              <Trash2 size={13} />
                              <span>{t('adminFeedback.deleteBtn')}</span>
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm badge-danger"
                                disabled={isDeleting}
                                onClick={() => handleDeleteSubmission(item.id)}
                              >
                                <Trash2 size={13} />
                                <span>{t('adminFeedback.confirmDeleteBtn')}</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                disabled={isDeleting}
                                onClick={() =>
                                  setConfirmDeleteKeys((prev) => {
                                    const copy = { ...prev };
                                    delete copy[deleteKey];
                                    return copy;
                                  })
                                }
                              >
                                {t('adminFeedback.cancelDeleteBtn')}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Tool Ratings */}
              {filtered.ratings.map((ratingItem) => {
                const deleteKey = `rt:${ratingItem.id}`;
                const confirmingDelete = Boolean(confirmDeleteKeys[deleteKey]);
                const isDeleting = Boolean(deletingKeys[deleteKey]);

                return (
                  <div
                    key={ratingItem.id}
                    className="bento-card glass-surface"
                    style={{ gap: '0.65rem' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span className="glass-pill">
                          <Star size={12} fill="currentColor" style={{ color: 'var(--warning)' }} />
                          <span>{t('adminFeedback.ratingLabel', { rating: ratingItem.rating })}</span>
                        </span>
                        <span className="glass-pill">{getToolLabel(ratingItem.toolId)}</span>
                        <span className="glass-pill font-mono" style={{ fontSize: '0.72rem' }}>
                          {t('adminFeedback.clientIdShort', {
                            id: ratingItem.clientId.slice(0, 8),
                          })}
                        </span>
                      </div>

                      <span className="subtle-text" style={{ fontSize: '0.76rem' }}>
                        {formatTimestamp(ratingItem.updatedAt || ratingItem.createdAt)}
                      </span>
                    </div>

                    <p
                      className={ratingItem.comment ? 'muted-text' : 'subtle-text'}
                      style={{
                        margin: 0,
                        fontSize: '0.88rem',
                        fontStyle: ratingItem.comment ? 'normal' : 'italic',
                      }}
                    >
                      {ratingItem.comment || t('adminFeedback.noCommentText')}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {!confirmingDelete ? (
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{ color: 'var(--danger)' }}
                          onClick={() =>
                            setConfirmDeleteKeys((prev) => ({ ...prev, [deleteKey]: true }))
                          }
                        >
                          <Trash2 size={13} />
                          <span>{t('adminFeedback.deleteBtn')}</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm badge-danger"
                            disabled={isDeleting}
                            onClick={() => handleDeleteRating(ratingItem.id)}
                          >
                            <Trash2 size={13} />
                            <span>{t('adminFeedback.confirmDeleteBtn')}</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={isDeleting}
                            onClick={() =>
                              setConfirmDeleteKeys((prev) => {
                                const copy = { ...prev };
                                delete copy[deleteKey];
                                return copy;
                              })
                            }
                          >
                            {t('adminFeedback.cancelDeleteBtn')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
