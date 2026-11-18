import type {
  AdminStatusFilter,
  AdminTypeFilter,
  FeedbackSubmission,
  ToolRatingEntry,
  ToolRatingSummary,
} from './types';

/**
 * Aggregates tool rating entries into per-tool summaries with 1-decimal-place averages.
 */
export function aggregateToolRatings(
  entries: readonly ToolRatingEntry[]
): Record<string, ToolRatingSummary> {
  const totals = new Map<string, { sum: number; count: number }>();

  for (const entry of entries) {
    if (!entry || !entry.toolId) continue;
    const rating = Number(entry.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) continue;

    const current = totals.get(entry.toolId) ?? { sum: 0, count: 0 };
    current.sum += rating;
    current.count += 1;
    totals.set(entry.toolId, current);
  }

  const summaries: Record<string, ToolRatingSummary> = {};
  for (const [toolId, { sum, count }] of totals.entries()) {
    if (count <= 0) continue;
    const avgRating = Math.round((sum / count) * 10) / 10;
    summaries[toolId] = {
      toolId,
      avgRating,
      ratingCount: count,
    };
  }

  return summaries;
}

export interface FilterAdminRecordsInput {
  submissions: readonly FeedbackSubmission[];
  ratings: readonly ToolRatingEntry[];
  typeFilter?: AdminTypeFilter;
  statusFilter?: AdminStatusFilter;
  toolFilter?: string;
  query?: string;
}

export interface FilteredAdminRecords {
  submissions: FeedbackSubmission[];
  ratings: ToolRatingEntry[];
}

/**
 * Filters admin feedback submissions and rating entries across type, status, toolId, and search query.
 */
export function filterAdminRecords({
  submissions,
  ratings,
  typeFilter = 'all',
  statusFilter = 'all',
  toolFilter = 'all',
  query = '',
}: FilterAdminRecordsInput): FilteredAdminRecords {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedTool = toolFilter.trim();

  const includeSubmissions = typeFilter !== 'rating';
  const includeRatings = typeFilter === 'all' || typeFilter === 'rating';

  const filteredSubmissions = includeSubmissions
    ? submissions.filter((item) => {
        if (typeFilter !== 'all' && item.type !== typeFilter) {
          return false;
        }
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }
        if (normalizedTool && normalizedTool !== 'all' && item.toolId !== normalizedTool) {
          return false;
        }
        if (normalizedQuery) {
          const haystack = [
            item.title,
            item.message,
            item.toolId,
            item.contactEmail,
            item.adminNote,
            item.type,
            item.status,
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(normalizedQuery)) {
            return false;
          }
        }
        return true;
      })
    : [];

  const filteredRatings = includeRatings
    ? ratings.filter((item) => {
        if (normalizedTool && normalizedTool !== 'all' && item.toolId !== normalizedTool) {
          return false;
        }
        if (normalizedQuery) {
          const haystack = [item.toolId, item.comment, String(item.rating)]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(normalizedQuery)) {
            return false;
          }
        }
        return true;
      })
    : [];

  return {
    submissions: filteredSubmissions,
    ratings: filteredRatings,
  };
}
