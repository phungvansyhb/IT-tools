'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  deleteRemotePreset,
  fetchRemoteFavorites,
  fetchRemoteMetrics,
  fetchRemotePresets,
  isSupabaseConfigured,
  pushRemoteMetric,
  pushRemotePreset,
  syncRemoteFavorite,
} from '@/lib/supabase/client';

export type ThemeMode = 'dark' | 'light';

export interface SavedPreset {
  id: string;
  toolId: string;
  name: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface ToolMetrics {
  views: number;
  uses: number;
}

interface WorkspaceContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  pinnedSnippets: string[];
  togglePinnedSnippet: (snippetId: string) => void;
  presets: SavedPreset[];
  savePreset: (toolId: string, name: string, payload: Record<string, unknown>) => SavedPreset;
  deletePreset: (id: string) => void;
  metrics: Record<string, ToolMetrics>;
  trackToolView: (toolId: string) => void;
  trackToolUse: (toolId: string) => void;
  syncMode: 'local' | 'supabase';
  hydrated: boolean;
}

const STORAGE_KEYS = {
  clientId: 'omnidev_client_id',
  theme: 'omnidev_theme',
  favorites: 'omnidev_favorites',
  snippets: 'omnidev_pinned_snippets',
  presets: 'omnidev_presets',
  metrics: 'omnidev_metrics',
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function readJsonStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return 'server';
  const existing = window.localStorage.getItem(STORAGE_KEYS.clientId);
  if (existing) return existing;
  const created =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(STORAGE_KEYS.clientId, created);
  return created;
}

export function UserWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pinnedSnippets, setPinnedSnippets] = useState<string[]>([]);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [metrics, setMetrics] = useState<Record<string, ToolMetrics>>({});
  const [clientId, setClientId] = useState<string>('');
  const [hydrated, setHydrated] = useState(false);

  const syncMode: 'local' | 'supabase' = isSupabaseConfigured() ? 'supabase' : 'local';

  useEffect(() => {
    const id = getOrCreateClientId();
    const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    const resolvedTheme: ThemeMode = savedTheme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', resolvedTheme);

    const localFavs = readJsonStorage<string[]>(STORAGE_KEYS.favorites, [
      'jwt-decoder',
      'data-converter',
      'color-converter',
    ]);
    const localSnippets = readJsonStorage<string[]>(STORAGE_KEYS.snippets, []);
    const localPresets = readJsonStorage<SavedPreset[]>(STORAGE_KEYS.presets, []);
    const localMetrics = readJsonStorage<Record<string, ToolMetrics>>(STORAGE_KEYS.metrics, {});

    queueMicrotask(() => {
      setClientId(id);
      setTheme(resolvedTheme);
      setFavorites(localFavs);
      setPinnedSnippets(localSnippets);
      setPresets(localPresets);
      setMetrics(localMetrics);
      setHydrated(true);
    });

    if (isSupabaseConfigured()) {
      void (async () => {
        const [remoteFavs, remotePresets, remoteMetrics] = await Promise.all([
          fetchRemoteFavorites(id),
          fetchRemotePresets(id),
          fetchRemoteMetrics(),
        ]);
        if (remoteFavs && remoteFavs.length > 0) {
          setFavorites(remoteFavs);
          writeJsonStorage(STORAGE_KEYS.favorites, remoteFavs);
        }
        if (remotePresets && remotePresets.length > 0) {
          const mapped: SavedPreset[] = remotePresets.map((r) => ({
            id: r.id,
            toolId: r.tool_id,
            name: r.name,
            payload: r.payload,
            createdAt: r.created_at,
          }));
          setPresets(mapped);
          writeJsonStorage(STORAGE_KEYS.presets, mapped);
        }
        if (Object.keys(remoteMetrics).length > 0) {
          setMetrics((prev) => {
            const merged = { ...prev, ...remoteMetrics };
            writeJsonStorage(STORAGE_KEYS.metrics, merged);
            return merged;
          });
        }
      })();
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      window.localStorage.setItem(STORAGE_KEYS.theme, next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (toolId: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(toolId);
        const next = exists ? prev.filter((id) => id !== toolId) : [toolId, ...prev];
        writeJsonStorage(STORAGE_KEYS.favorites, next);
        if (clientId) void syncRemoteFavorite(clientId, toolId, !exists);
        return next;
      });
    },
    [clientId]
  );

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  const togglePinnedSnippet = useCallback((snippetId: string) => {
    setPinnedSnippets((prev) => {
      const next = prev.includes(snippetId)
        ? prev.filter((id) => id !== snippetId)
        : [snippetId, ...prev];
      writeJsonStorage(STORAGE_KEYS.snippets, next);
      return next;
    });
  }, []);

  const savePreset = useCallback(
    (toolId: string, name: string, payload: Record<string, unknown>): SavedPreset => {
      const entry: SavedPreset = {
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `preset-${Date.now()}`,
        toolId,
        name: name.trim() || 'Untitled Preset',
        payload,
        createdAt: new Date().toISOString(),
      };
      setPresets((prev) => {
        const next = [entry, ...prev].slice(0, 60);
        writeJsonStorage(STORAGE_KEYS.presets, next);
        return next;
      });
      if (clientId) void pushRemotePreset(clientId, toolId, entry.name, payload);
      return entry;
    },
    [clientId]
  );

  const deletePreset = useCallback(
    (id: string) => {
      setPresets((prev) => {
        const next = prev.filter((p) => p.id !== id);
        writeJsonStorage(STORAGE_KEYS.presets, next);
        return next;
      });
      if (clientId) void deleteRemotePreset(clientId, id);
    },
    [clientId]
  );

  const trackToolView = useCallback((toolId: string) => {
    setMetrics((prev) => {
      const current = prev[toolId] ?? { views: 0, uses: 0 };
      const next = {
        ...prev,
        [toolId]: { views: current.views + 1, uses: current.uses },
      };
      writeJsonStorage(STORAGE_KEYS.metrics, next);
      return next;
    });
    void pushRemoteMetric(toolId, 'views');
  }, []);

  const trackToolUse = useCallback((toolId: string) => {
    setMetrics((prev) => {
      const current = prev[toolId] ?? { views: 0, uses: 0 };
      const next = {
        ...prev,
        [toolId]: { views: current.views, uses: current.uses + 1 },
      };
      writeJsonStorage(STORAGE_KEYS.metrics, next);
      return next;
    });
    void pushRemoteMetric(toolId, 'uses');
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        isFavorite,
        pinnedSnippets,
        togglePinnedSnippet,
        presets,
        savePreset,
        deletePreset,
        metrics,
        trackToolView,
        trackToolUse,
        syncMode,
        hydrated,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useUserWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useUserWorkspace must be used inside UserWorkspaceProvider');
  }
  return ctx;
}
