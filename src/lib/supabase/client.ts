import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type {
  DebugContextPayload,
  FeedbackStatus,
  FeedbackSubmission,
  FeedbackType,
  ToolRatingEntry,
  ToolRatingSummary,
} from '@/lib/feedback/types';

let cachedClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cachedClient) {
    cachedClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return cachedClient;
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: 'omnidev_admin_supabase_auth',
        },
      }
    );
  }
  return cachedAdminClient;
}

export interface RemoteMetricRow {
  tool_id: string;
  views: number;
  uses: number;
}

export interface RemotePresetRow {
  id: string;
  client_id: string;
  tool_id: string;
  name: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export async function fetchRemoteMetrics(): Promise<Record<string, { views: number; uses: number }>> {
  const client = getSupabaseClient();
  if (!client) return {};
  try {
    const { data, error } = await client.from('tool_metrics').select('tool_id, views, uses');
    if (error || !data) return {};
    const out: Record<string, { views: number; uses: number }> = {};
    for (const row of data as RemoteMetricRow[]) {
      out[row.tool_id] = { views: Number(row.views) || 0, uses: Number(row.uses) || 0 };
    }
    return out;
  } catch {
    return {};
  }
}

export async function pushRemoteMetric(toolId: string, field: 'views' | 'uses'): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.rpc('increment_tool_metric', { p_tool_id: toolId, p_field: field });
  } catch {
    // Silent fallback to localStorage metrics
  }
}

export async function fetchRemoteFavorites(clientId: string): Promise<string[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('user_favorites')
      .select('tool_id')
      .eq('client_id', clientId);
    if (error || !data) return null;
    return data.map((r: { tool_id: string }) => r.tool_id);
  } catch {
    return null;
  }
}

export async function syncRemoteFavorite(
  clientId: string,
  toolId: string,
  pinned: boolean
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (pinned) {
      await client
        .from('user_favorites')
        .upsert({ client_id: clientId, tool_id: toolId }, { onConflict: 'client_id,tool_id' });
    } else {
      await client
        .from('user_favorites')
        .delete()
        .eq('client_id', clientId)
        .eq('tool_id', toolId);
    }
  } catch {
    // Silent fallback
  }
}

export async function fetchRemotePresets(clientId: string): Promise<RemotePresetRow[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('saved_presets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data as RemotePresetRow[];
  } catch {
    return null;
  }
}

export async function pushRemotePreset(
  clientId: string,
  toolId: string,
  name: string,
  payload: Record<string, unknown>
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('saved_presets').insert({
      client_id: clientId,
      tool_id: toolId,
      name,
      payload,
    });
  } catch {
    // Silent fallback
  }
}

export async function deleteRemotePreset(clientId: string, id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('saved_presets').delete().eq('client_id', clientId).eq('id', id);
  } catch {
    // Silent fallback
  }
}

// ============================================================================
// Feedback & Tool Ratings — Visitor & Admin Supabase Helpers (UNIT-10 / CON-09)
// ============================================================================

interface RemoteRatingSummaryRow {
  tool_id: string;
  avg_rating: number | string;
  rating_count: number | string;
}

interface RemoteToolRatingRow {
  id: string;
  client_id: string;
  tool_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

interface RemoteFeedbackSubmissionRow {
  id: string;
  client_id: string;
  type: FeedbackType;
  tool_id: string;
  title: string | null;
  message: string;
  contact_email: string | null;
  debug_context: DebugContextPayload | null;
  status: FeedbackStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

function mapToolRatingRow(row: RemoteToolRatingRow): ToolRatingEntry {
  return {
    id: row.id,
    clientId: row.client_id,
    toolId: row.tool_id,
    rating: Number(row.rating) || 0,
    comment: row.comment ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFeedbackRow(row: RemoteFeedbackSubmissionRow): FeedbackSubmission {
  return {
    id: row.id,
    clientId: row.client_id,
    type: row.type,
    toolId: row.tool_id,
    title: row.title ?? '',
    message: row.message,
    contactEmail: row.contact_email ?? '',
    debugContext: row.debug_context ?? null,
    status: row.status,
    adminNote: row.admin_note ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchRemoteRatingSummaries(): Promise<Record<string, ToolRatingSummary> | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.rpc('get_tool_rating_summaries');
    if (error || !data) return null;
    const out: Record<string, ToolRatingSummary> = {};
    for (const row of data as RemoteRatingSummaryRow[]) {
      const count = Number(row.rating_count) || 0;
      const avg = Math.round((Number(row.avg_rating) || 0) * 10) / 10;
      if (row.tool_id && count > 0) {
        out[row.tool_id] = {
          toolId: row.tool_id,
          avgRating: avg,
          ratingCount: count,
        };
      }
    }
    return out;
  } catch {
    return null;
  }
}

export async function fetchMyRemoteRatings(clientId: string): Promise<ToolRatingEntry[] | null> {
  const client = getSupabaseClient();
  if (!client || !clientId) return null;
  try {
    const { data, error } = await client.rpc('get_my_tool_ratings', {
      p_client_id: clientId,
    });
    if (error || !data) return null;
    return (data as RemoteToolRatingRow[]).map(mapToolRatingRow);
  } catch {
    return null;
  }
}

export async function upsertRemoteRating(
  clientId: string,
  toolId: string,
  rating: number,
  comment: string = ''
): Promise<ToolRatingEntry | null> {
  const client = getSupabaseClient();
  if (!client || !clientId) return null;
  try {
    const { data, error } = await client.rpc('upsert_tool_rating', {
      p_client_id: clientId,
      p_tool_id: toolId,
      p_rating: rating,
      p_comment: comment,
    });
    if (error || !data) return null;
    const rows = Array.isArray(data)
      ? (data as RemoteToolRatingRow[])
      : [data as RemoteToolRatingRow];
    return rows[0] ? mapToolRatingRow(rows[0]) : null;
  } catch {
    return null;
  }
}

export interface RemoteFeedbackInsertPayload {
  id?: string;
  clientId: string;
  type: FeedbackType;
  toolId: string;
  title: string;
  message: string;
  contactEmail: string;
  debugContext: DebugContextPayload | null;
}

/**
 * Inserts an anonymous visitor feedback submission.
 * Intentionally avoids `.select()` after `.insert()` because anon has no SELECT policy.
 */
export async function pushRemoteFeedback(
  payload: RemoteFeedbackInsertPayload
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || !payload.clientId) return false;
  try {
    const row: Record<string, unknown> = {
      client_id: payload.clientId,
      type: payload.type,
      tool_id: payload.toolId,
      title: payload.title,
      message: payload.message,
      contact_email: payload.contactEmail,
      debug_context: payload.debugContext,
      status: 'open',
      admin_note: '',
    };
    if (payload.id) {
      row.id = payload.id;
    }
    const { error } = await client.from('feedback_submissions').insert(row);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchMyRemoteFeedback(
  clientId: string
): Promise<FeedbackSubmission[] | null> {
  const client = getSupabaseClient();
  if (!client || !clientId) return null;
  try {
    const { data, error } = await client.rpc('get_my_feedback', {
      p_client_id: clientId,
    });
    if (error || !data) return null;
    return (data as RemoteFeedbackSubmissionRow[]).map(mapFeedbackRow);
  } catch {
    return null;
  }
}

export interface AdminSignInResult {
  ok: boolean;
  error?: string;
}

export async function checkIsFeedbackAdmin(): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client) return false;
  try {
    const { data, error } = await client.rpc('check_is_feedback_admin');
    if (error) return false;
    return data === true;
  } catch {
    return false;
  }
}

export async function signInAdmin(
  email: string,
  password: string
): Promise<AdminSignInResult> {
  const client = getSupabaseAdminClient();
  if (!client) {
    return { ok: false, error: 'Supabase is not configured.' };
  }
  try {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, error: error.message };
    }
    const isAdmin = await checkIsFeedbackAdmin();
    if (!isAdmin) {
      await client.auth.signOut();
      return { ok: false, error: 'Account is not in feedback_admins allowlist.' };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Authentication failed.',
    };
  }
}

export async function signOutAdmin(): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client) return false;
  try {
    const { error } = await client.auth.signOut();
    return !error;
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<Session | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.getSession();
    if (error) return null;
    return data.session ?? null;
  } catch {
    return null;
  }
}

export async function fetchAdminFeedbackSubmissions(): Promise<FeedbackSubmission[] | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return (data as RemoteFeedbackSubmissionRow[]).map(mapFeedbackRow);
  } catch {
    return null;
  }
}

export async function fetchAdminToolRatings(): Promise<ToolRatingEntry[] | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('tool_ratings')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error || !data) return null;
    return (data as RemoteToolRatingRow[]).map(mapToolRatingRow);
  } catch {
    return null;
  }
}

export async function updateAdminFeedbackSubmission(
  id: string,
  patch: { status: FeedbackStatus; adminNote: string }
): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client || !id) return false;
  try {
    const { error } = await client
      .from('feedback_submissions')
      .update({
        status: patch.status,
        admin_note: patch.adminNote,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAdminFeedbackSubmission(id: string): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client || !id) return false;
  try {
    const { error } = await client.from('feedback_submissions').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAdminToolRating(id: string): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client || !id) return false;
  try {
    const { error } = await client.from('tool_ratings').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

