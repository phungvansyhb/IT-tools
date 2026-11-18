import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

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
