import type { FeedbackStatus, FeedbackSubmission, ToolRatingEntry } from './types';

export const FEEDBACK_STORAGE_KEYS = {
  ratings: 'omnidev_tool_ratings',
  submissions: 'omnidev_feedback_submissions',
  lastSubmitAt: 'omnidev_feedback_last_submit_at',
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export function readLocalRatings(): ToolRatingEntry[] {
  const items = readJson<ToolRatingEntry[]>(FEEDBACK_STORAGE_KEYS.ratings, []);
  return Array.isArray(items) ? items : [];
}

export function upsertLocalRating(entry: ToolRatingEntry): ToolRatingEntry[] {
  const current = readLocalRatings();
  const idx = current.findIndex(
    (item) => item.clientId === entry.clientId && item.toolId === entry.toolId
  );

  const next =
    idx >= 0
      ? current.map((item, i) =>
          i === idx
            ? {
                ...item,
                rating: entry.rating,
                comment: entry.comment,
                updatedAt: entry.updatedAt,
              }
            : item
        )
      : [entry, ...current];

  writeJson(FEEDBACK_STORAGE_KEYS.ratings, next);
  return next;
}

export function deleteLocalRating(id: string): ToolRatingEntry[] {
  const current = readLocalRatings();
  const next = current.filter((item) => item.id !== id);
  writeJson(FEEDBACK_STORAGE_KEYS.ratings, next);
  return next;
}

export function readLocalFeedback(): FeedbackSubmission[] {
  const items = readJson<FeedbackSubmission[]>(FEEDBACK_STORAGE_KEYS.submissions, []);
  return Array.isArray(items) ? items : [];
}

export function insertLocalFeedback(entry: FeedbackSubmission): FeedbackSubmission[] {
  const current = readLocalFeedback();
  const next = [entry, ...current].slice(0, 200);
  writeJson(FEEDBACK_STORAGE_KEYS.submissions, next);
  return next;
}

export function updateLocalFeedback(
  id: string,
  patch: { status: FeedbackStatus; adminNote: string; updatedAt?: string }
): FeedbackSubmission[] {
  const current = readLocalFeedback();
  const updatedAt = patch.updatedAt ?? new Date().toISOString();
  const next = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status: patch.status,
          adminNote: patch.adminNote,
          updatedAt,
        }
      : item
  );
  writeJson(FEEDBACK_STORAGE_KEYS.submissions, next);
  return next;
}

export function deleteLocalFeedback(id: string): FeedbackSubmission[] {
  const current = readLocalFeedback();
  const next = current.filter((item) => item.id !== id);
  writeJson(FEEDBACK_STORAGE_KEYS.submissions, next);
  return next;
}

export function readLastFeedbackSubmitAt(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEYS.lastSubmitAt);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function writeLastFeedbackSubmitAt(timestamp: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FEEDBACK_STORAGE_KEYS.lastSubmitAt, String(timestamp));
  } catch {
    // Ignore storage quota errors
  }
}
