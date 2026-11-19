import type { LocaleBundle } from '../../types';
import { viCommon } from './common';
import { viCatalog } from './catalog';
import { viTools } from './tools';
import { viCheatsheets } from './cheatsheets';
import { viPages } from './pages';

export const viBundle: LocaleBundle = {
  common: viCommon,
  catalog: viCatalog,
  tools: viTools,
  cheatsheets: viCheatsheets,
  pages: viPages,
};
