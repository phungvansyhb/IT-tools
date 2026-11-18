'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FEEDBACK_COOLDOWN_MS,
  aggregateToolRatings,
  insertLocalFeedback,
  isValidToolId,
  readLastFeedbackSubmitAt,
  readLocalFeedback,
  readLocalRatings,
  upsertLocalRating,
  validateFeedbackSubmission,
  validateRatingInput,
  writeLastFeedbackSubmitAt,
  type DebugContextPayload,
  type FeedbackSubmission,
  type FeedbackType,
  type FeedbackValidationErrorCode,
  type RatingValidationErrorCode,
  type ToolRatingEntry,
  type ToolRatingSummary,
} from '@/lib/feedback';
import {
  fetchMyRemoteFeedback,
  fetchMyRemoteRatings,
  fetchRemoteRatingSummaries,
  isSupabaseConfigured,
  pushRemoteFeedback,
  upsertRemoteRating,
} from '@/lib/supabase/client';
import { getOrCreateClientId, useUserWorkspace } from '@/hooks/useUserWorkspace';

export type FeedbackModalTab = 'submit' | 'my';

export interface OpenFeedbackModalOptions {
  defaultTab?: FeedbackModalTab;
  defaultType?: FeedbackType;
  defaultToolId?: string;
}

export interface SubmitRatingResult {
  ok: boolean;
  errorCode?: RatingValidationErrorCode | 'generic' | null;
  rating?: ToolRatingEntry;
}

export interface SubmitFeedbackInput {
  type: FeedbackType;
  toolId: string;
  title?: string;
  message: string;
  contactEmail?: string;
  website?: string;
  includeDebugContext?: boolean;
  debugContext?: DebugContextPayload | null;
}

export interface SubmitFeedbackResult {
  ok: boolean;
  honeypot?: boolean;
  errorCode?: FeedbackValidationErrorCode | 'generic' | null;
  cooldownRemainingSec?: number;
  fieldErrors?: Partial<
    Record<'type' | 'toolId' | 'title' | 'message' | 'contactEmail', FeedbackValidationErrorCode>
  >;
  submission?: FeedbackSubmission;
}

interface FeedbackContextValue {
  ratingSummaries: Record<string, ToolRatingSummary>;
  myRatings: Record<string, ToolRatingEntry>;
  myFeedback: FeedbackSubmission[];
  cooldownRemainingSec: number;
  syncMode: 'local' | 'supabase';
  hydrated: boolean;
  submitRating: (toolId: string, rating: number, comment?: string) => Promise<SubmitRatingResult>;
  submitFeedback: (input: SubmitFeedbackInput) => Promise<SubmitFeedbackResult>;
  refreshFeedbackData: () => Promise<void>;
  modalOpen: boolean;
  modalTab: FeedbackModalTab;
  modalType: FeedbackType;
  modalToolId: string;
  setModalTab: (tab: FeedbackModalTab) => void;
  setModalType: (type: FeedbackType) => void;
  setModalToolId: (toolId: string) => void;
  openFeedbackModal: (options?: OpenFeedbackModalOptions) => void;
  closeFeedbackModal: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function generateFeedbackUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function indexRatingsByTool(
  entries: readonly ToolRatingEntry[],
  clientId?: string
): Record<string, ToolRatingEntry> {
  const map: Record<string, ToolRatingEntry> = {};
  for (const entry of entries) {
    if (!entry || !entry.toolId) continue;
    if (clientId && entry.clientId !== clientId) continue;
    map[entry.toolId] = entry;
  }
  return map;
}

function computeCooldownRemainingSec(lastSubmittedAt: number | null, now = Date.now()): number {
  if (!lastSubmittedAt || lastSubmittedAt <= 0) return 0;
  const elapsed = now - lastSubmittedAt;
  if (elapsed < 0 || elapsed >= FEEDBACK_COOLDOWN_MS) return 0;
  return Math.max(1, Math.ceil((FEEDBACK_COOLDOWN_MS - elapsed) / 1000));
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { clientId, syncMode, hydrated: workspaceHydrated } = useUserWorkspace();

  const [ratingSummaries, setRatingSummaries] = useState<Record<string, ToolRatingSummary>>({});
  const [myRatings, setMyRatings] = useState<Record<string, ToolRatingEntry>>({});
  const [myFeedback, setMyFeedback] = useState<FeedbackSubmission[]>([]);
  const [cooldownRemainingSec, setCooldownRemainingSec] = useState<number>(0);
  const [feedbackHydrated, setFeedbackHydrated] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<FeedbackModalTab>('submit');
  const [modalType, setModalType] = useState<FeedbackType>('feedback');
  const [modalToolId, setModalToolId] = useState<string>('general');

  const refreshFeedbackData = useCallback(async () => {
    const effectiveClientId = clientId || getOrCreateClientId();
    const localRatings = readLocalRatings();
    const localFeedback = readLocalFeedback();
    const lastSubmitAt = readLastFeedbackSubmitAt();

    const localSummaries = aggregateToolRatings(localRatings);
    const localMyRatings = indexRatingsByTool(localRatings, effectiveClientId);
    const localMyFeedback = localFeedback.filter((item) => item.clientId === effectiveClientId);
    const remaining = computeCooldownRemainingSec(lastSubmitAt);

    setRatingSummaries(localSummaries);
    setMyRatings(localMyRatings);
    setMyFeedback(localMyFeedback);
    setCooldownRemainingSec(remaining);

    if (isSupabaseConfigured() && effectiveClientId && effectiveClientId !== 'server') {
      const [remoteSummaries, remoteRatings, remoteFeedback] = await Promise.all([
        fetchRemoteRatingSummaries(),
        fetchMyRemoteRatings(effectiveClientId),
        fetchMyRemoteFeedback(effectiveClientId),
      ]);

      if (remoteSummaries) {
        setRatingSummaries(remoteSummaries);
      }
      if (remoteRatings) {
        setMyRatings({
          ...localMyRatings,
          ...indexRatingsByTool(remoteRatings),
        });
      }
      if (remoteFeedback) {
        const remoteIds = new Set(remoteFeedback.map((item) => item.id));
        const localOnly = localMyFeedback.filter((item) => !remoteIds.has(item.id));
        setMyFeedback([...remoteFeedback, ...localOnly]);
      }
    }
  }, [clientId]);

  useEffect(() => {
    if (!workspaceHydrated) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      void refreshFeedbackData().finally(() => {
        if (!cancelled) {
          setFeedbackHydrated(true);
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [workspaceHydrated, refreshFeedbackData]);

  useEffect(() => {
    if (cooldownRemainingSec <= 0) return;
    const timer = window.setInterval(() => {
      const lastAt = readLastFeedbackSubmitAt();
      setCooldownRemainingSec(computeCooldownRemainingSec(lastAt));
    }, 500);
    return () => window.clearInterval(timer);
  }, [cooldownRemainingSec]);

  const submitRating = useCallback(
    async (toolId: string, rating: number, comment = ''): Promise<SubmitRatingResult> => {
      const validation = validateRatingInput({ toolId, rating, comment });
      if (!validation.ok || !validation.sanitized) {
        return { ok: false, errorCode: validation.errorCode };
      }

      const effectiveClientId = clientId || getOrCreateClientId();
      const nowIso = new Date().toISOString();
      const existing = myRatings[validation.sanitized.toolId];

      const localEntry: ToolRatingEntry = {
        id: existing?.id ?? generateFeedbackUuid(),
        clientId: effectiveClientId,
        toolId: validation.sanitized.toolId,
        rating: validation.sanitized.rating,
        comment: validation.sanitized.comment,
        createdAt: existing?.createdAt ?? nowIso,
        updatedAt: nowIso,
      };

      const allLocal = upsertLocalRating(localEntry);
      setMyRatings((prev) => ({
        ...prev,
        [localEntry.toolId]: localEntry,
      }));
      setRatingSummaries((prev) => {
        if (!isSupabaseConfigured()) {
          return aggregateToolRatings(allLocal);
        }
        const currentSummary = prev[localEntry.toolId];
        if (!currentSummary) {
          return {
            ...prev,
            [localEntry.toolId]: {
              toolId: localEntry.toolId,
              avgRating: localEntry.rating,
              ratingCount: 1,
            },
          };
        }
        if (existing) {
          const total = currentSummary.avgRating * currentSummary.ratingCount;
          const nextAvg =
            Math.round(((total - existing.rating + localEntry.rating) / currentSummary.ratingCount) * 10) /
            10;
          return {
            ...prev,
            [localEntry.toolId]: {
              ...currentSummary,
              avgRating: nextAvg,
            },
          };
        }
        const nextCount = currentSummary.ratingCount + 1;
        const nextAvg =
          Math.round(
            ((currentSummary.avgRating * currentSummary.ratingCount + localEntry.rating) / nextCount) *
              10
          ) / 10;
        return {
          ...prev,
          [localEntry.toolId]: {
            toolId: localEntry.toolId,
            avgRating: nextAvg,
            ratingCount: nextCount,
          },
        };
      });

      if (isSupabaseConfigured() && effectiveClientId && effectiveClientId !== 'server') {
        const remoteEntry = await upsertRemoteRating(
          effectiveClientId,
          localEntry.toolId,
          localEntry.rating,
          localEntry.comment
        );
        if (remoteEntry) {
          upsertLocalRating(remoteEntry);
          setMyRatings((prev) => ({
            ...prev,
            [remoteEntry.toolId]: remoteEntry,
          }));
        }
        const remoteSummaries = await fetchRemoteRatingSummaries();
        if (remoteSummaries) {
          setRatingSummaries(remoteSummaries);
        }
        return { ok: true, rating: remoteEntry ?? localEntry };
      }

      return { ok: true, rating: localEntry };
    },
    [clientId, myRatings]
  );

  const submitFeedback = useCallback(
    async (input: SubmitFeedbackInput): Promise<SubmitFeedbackResult> => {
      const now = Date.now();
      const lastSubmittedAt = readLastFeedbackSubmitAt();

      const validation = validateFeedbackSubmission(
        {
          type: input.type,
          toolId: input.toolId,
          title: input.title,
          message: input.message,
          contactEmail: input.contactEmail,
          website: input.website,
        },
        { lastSubmittedAt, now }
      );

      if (validation.honeypotTriggered) {
        return { ok: true, honeypot: true };
      }

      if (!validation.ok || !validation.sanitized) {
        if (validation.errorCode === 'cooldown') {
          setCooldownRemainingSec(validation.cooldownRemainingSec);
        }
        return {
          ok: false,
          errorCode: validation.errorCode,
          cooldownRemainingSec: validation.cooldownRemainingSec,
          fieldErrors: validation.fieldErrors,
        };
      }

      const effectiveClientId = clientId || getOrCreateClientId();
      const nowIso = new Date(now).toISOString();
      const entry: FeedbackSubmission = {
        id: generateFeedbackUuid(),
        clientId: effectiveClientId,
        type: validation.sanitized.type,
        toolId: validation.sanitized.toolId,
        title: validation.sanitized.title,
        message: validation.sanitized.message,
        contactEmail: validation.sanitized.contactEmail,
        debugContext: input.includeDebugContext ? (input.debugContext ?? null) : null,
        status: 'open',
        adminNote: '',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      writeLastFeedbackSubmitAt(now);
      setCooldownRemainingSec(Math.ceil(FEEDBACK_COOLDOWN_MS / 1000));
      insertLocalFeedback(entry);
      setMyFeedback((prev) => [entry, ...prev.filter((item) => item.id !== entry.id)]);

      if (isSupabaseConfigured() && effectiveClientId && effectiveClientId !== 'server') {
        const pushed = await pushRemoteFeedback({
          id: entry.id,
          clientId: entry.clientId,
          type: entry.type,
          toolId: entry.toolId,
          title: entry.title,
          message: entry.message,
          contactEmail: entry.contactEmail,
          debugContext: entry.debugContext,
        });
        if (pushed) {
          const remoteList = await fetchMyRemoteFeedback(effectiveClientId);
          if (remoteList) {
            setMyFeedback(remoteList);
          }
        }
      }

      return { ok: true, submission: entry };
    },
    [clientId]
  );

  const openFeedbackModal = useCallback((options?: OpenFeedbackModalOptions) => {
    setModalTab(options?.defaultTab ?? 'submit');
    setModalType(options?.defaultType ?? 'feedback');
    const candidateToolId = options?.defaultToolId;
    setModalToolId(
      candidateToolId && isValidToolId(candidateToolId, true) ? candidateToolId : 'general'
    );
    setModalOpen(true);
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const hydrated = workspaceHydrated && feedbackHydrated;

  const value = useMemo<FeedbackContextValue>(
    () => ({
      ratingSummaries,
      myRatings,
      myFeedback,
      cooldownRemainingSec,
      syncMode,
      hydrated,
      submitRating,
      submitFeedback,
      refreshFeedbackData,
      modalOpen,
      modalTab,
      modalType,
      modalToolId,
      setModalTab,
      setModalType,
      setModalToolId,
      openFeedbackModal,
      closeFeedbackModal,
    }),
    [
      ratingSummaries,
      myRatings,
      myFeedback,
      cooldownRemainingSec,
      syncMode,
      hydrated,
      submitRating,
      submitFeedback,
      refreshFeedbackData,
      modalOpen,
      modalTab,
      modalType,
      modalToolId,
      openFeedbackModal,
      closeFeedbackModal,
    ]
  );

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error('useFeedback must be used inside FeedbackProvider');
  }
  return ctx;
}
