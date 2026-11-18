import { TOOLS } from '@/lib/tools/registry';
import type { FeedbackStatus, FeedbackType } from './types';

export const FEEDBACK_COOLDOWN_MS = 30_000;
export const TITLE_MAX = 140;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
export const EMAIL_MAX = 160;
export const COMMENT_MAX = 500;
export const ADMIN_NOTE_MAX = 1000;

export const FEEDBACK_TYPES: readonly FeedbackType[] = ['feedback', 'bug', 'feature'] as const;
export const FEEDBACK_STATUSES: readonly FeedbackStatus[] = [
  'open',
  'in_progress',
  'resolved',
  'closed',
] as const;

const VALID_TOOL_IDS = new Set<string>(TOOLS.map((t) => t.id));
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidToolId(toolId: unknown, allowGeneral: boolean = false): toolId is string {
  if (typeof toolId !== 'string') return false;
  const trimmed = toolId.trim();
  if (allowGeneral && trimmed === 'general') return true;
  return VALID_TOOL_IDS.has(trimmed);
}

export function isValidFeedbackType(type: unknown): type is FeedbackType {
  return typeof type === 'string' && (FEEDBACK_TYPES as readonly string[]).includes(type);
}

export function isValidFeedbackStatus(status: unknown): status is FeedbackStatus {
  return typeof status === 'string' && (FEEDBACK_STATUSES as readonly string[]).includes(status);
}

export type FeedbackValidationErrorCode =
  | 'honeypot'
  | 'cooldown'
  | 'invalid_type'
  | 'invalid_tool'
  | 'title_too_long'
  | 'message_too_short'
  | 'message_too_long'
  | 'invalid_email'
  | 'email_too_long';

export interface FeedbackSubmissionInput {
  type: unknown;
  toolId: unknown;
  title?: unknown;
  message: unknown;
  contactEmail?: unknown;
  website?: unknown; // Hidden honeypot field
}

export interface FeedbackValidationOptions {
  lastSubmittedAt?: number | null;
  now?: number;
}

export interface SanitizedFeedbackInput {
  type: FeedbackType;
  toolId: string;
  title: string;
  message: string;
  contactEmail: string;
}

export interface FeedbackValidationResult {
  ok: boolean;
  honeypotTriggered: boolean;
  cooldownRemainingSec: number;
  errorCode: FeedbackValidationErrorCode | null;
  fieldErrors: Partial<Record<'type' | 'toolId' | 'title' | 'message' | 'contactEmail', FeedbackValidationErrorCode>>;
  sanitized: SanitizedFeedbackInput | null;
}

export function validateFeedbackSubmission(
  input: FeedbackSubmissionInput,
  options: FeedbackValidationOptions = {}
): FeedbackValidationResult {
  const honeypotValue = typeof input.website === 'string' ? input.website.trim() : '';
  if (honeypotValue.length > 0) {
    return {
      ok: false,
      honeypotTriggered: true,
      cooldownRemainingSec: 0,
      errorCode: 'honeypot',
      fieldErrors: {},
      sanitized: null,
    };
  }

  const now = typeof options.now === 'number' && Number.isFinite(options.now) ? options.now : Date.now();
  const lastSubmittedAt =
    typeof options.lastSubmittedAt === 'number' && Number.isFinite(options.lastSubmittedAt)
      ? options.lastSubmittedAt
      : null;

  if (lastSubmittedAt !== null && lastSubmittedAt > 0) {
    const elapsed = now - lastSubmittedAt;
    if (elapsed >= 0 && elapsed < FEEDBACK_COOLDOWN_MS) {
      const remainingSec = Math.max(1, Math.ceil((FEEDBACK_COOLDOWN_MS - elapsed) / 1000));
      return {
        ok: false,
        honeypotTriggered: false,
        cooldownRemainingSec: remainingSec,
        errorCode: 'cooldown',
        fieldErrors: {},
        sanitized: null,
      };
    }
  }

  const fieldErrors: FeedbackValidationResult['fieldErrors'] = {};
  let firstError: FeedbackValidationErrorCode | null = null;

  const setFieldError = (
    field: keyof FeedbackValidationResult['fieldErrors'],
    code: FeedbackValidationErrorCode
  ) => {
    if (!fieldErrors[field]) fieldErrors[field] = code;
    if (!firstError) firstError = code;
  };

  if (!isValidFeedbackType(input.type)) {
    setFieldError('type', 'invalid_type');
  }

  const rawToolId = typeof input.toolId === 'string' ? input.toolId.trim() : '';
  if (!isValidToolId(rawToolId, true)) {
    setFieldError('toolId', 'invalid_tool');
  }

  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (title.length > TITLE_MAX) {
    setFieldError('title', 'title_too_long');
  }

  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (message.length < MESSAGE_MIN) {
    setFieldError('message', 'message_too_short');
  } else if (message.length > MESSAGE_MAX) {
    setFieldError('message', 'message_too_long');
  }

  const contactEmail = typeof input.contactEmail === 'string' ? input.contactEmail.trim() : '';
  if (contactEmail.length > EMAIL_MAX) {
    setFieldError('contactEmail', 'email_too_long');
  } else if (contactEmail.length > 0 && !EMAIL_REGEX.test(contactEmail)) {
    setFieldError('contactEmail', 'invalid_email');
  }

  if (firstError !== null) {
    return {
      ok: false,
      honeypotTriggered: false,
      cooldownRemainingSec: 0,
      errorCode: firstError,
      fieldErrors,
      sanitized: null,
    };
  }

  return {
    ok: true,
    honeypotTriggered: false,
    cooldownRemainingSec: 0,
    errorCode: null,
    fieldErrors: {},
    sanitized: {
      type: input.type as FeedbackType,
      toolId: rawToolId,
      title,
      message,
      contactEmail,
    },
  };
}

export type RatingValidationErrorCode =
  | 'invalid_tool'
  | 'invalid_rating'
  | 'comment_too_long';

export interface RatingValidationInput {
  toolId: unknown;
  rating: unknown;
  comment?: unknown;
}

export interface RatingValidationResult {
  ok: boolean;
  errorCode: RatingValidationErrorCode | null;
  sanitized: {
    toolId: string;
    rating: number;
    comment: string;
  } | null;
}

export function validateRatingInput(input: RatingValidationInput): RatingValidationResult {
  const rawToolId = typeof input.toolId === 'string' ? input.toolId.trim() : '';
  if (!isValidToolId(rawToolId, false)) {
    return {
      ok: false,
      errorCode: 'invalid_tool',
      sanitized: null,
    };
  }

  const rating = input.rating;
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      ok: false,
      errorCode: 'invalid_rating',
      sanitized: null,
    };
  }

  const comment = typeof input.comment === 'string' ? input.comment.trim() : '';
  if (comment.length > COMMENT_MAX) {
    return {
      ok: false,
      errorCode: 'comment_too_long',
      sanitized: null,
    };
  }

  return {
    ok: true,
    errorCode: null,
    sanitized: {
      toolId: rawToolId,
      rating,
      comment,
    },
  };
}

export type AdminUpdateErrorCode = 'invalid_status' | 'admin_note_too_long';

export interface AdminUpdateValidationInput {
  status: unknown;
  adminNote?: unknown;
}

export interface AdminUpdateValidationResult {
  ok: boolean;
  errorCode: AdminUpdateErrorCode | null;
  sanitized: {
    status: FeedbackStatus;
    adminNote: string;
  } | null;
}

export function validateAdminUpdate(
  input: AdminUpdateValidationInput
): AdminUpdateValidationResult {
  if (!isValidFeedbackStatus(input.status)) {
    return {
      ok: false,
      errorCode: 'invalid_status',
      sanitized: null,
    };
  }

  const adminNote = typeof input.adminNote === 'string' ? input.adminNote.trim() : '';
  if (adminNote.length > ADMIN_NOTE_MAX) {
    return {
      ok: false,
      errorCode: 'admin_note_too_long',
      sanitized: null,
    };
  }

  return {
    ok: true,
    errorCode: null,
    sanitized: {
      status: input.status,
      adminNote,
    },
  };
}
