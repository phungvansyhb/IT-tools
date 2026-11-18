import type { Locale } from '@/i18n/config';

export type FeedbackType = 'feedback' | 'bug' | 'feature';

export type FeedbackStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type AdminTypeFilter = 'all' | FeedbackType | 'rating';

export type AdminStatusFilter = 'all' | FeedbackStatus;

export interface DebugContextPayload {
  toolId: string;
  locale: Locale;
  pathname: string;
  theme: 'dark' | 'light';
  viewport: string;
  platform: string;
  userAgentShort: string;
}

export interface FeedbackSubmission {
  id: string;
  clientId: string;
  type: FeedbackType;
  toolId: string;
  title: string;
  message: string;
  contactEmail: string;
  debugContext: DebugContextPayload | null;
  status: FeedbackStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolRatingEntry {
  id: string;
  clientId: string;
  toolId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolRatingSummary {
  toolId: string;
  avgRating: number;
  ratingCount: number;
}
