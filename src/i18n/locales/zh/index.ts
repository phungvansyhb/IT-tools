import type { LocaleBundle } from '../../types';
import { zhCommon } from './common';
import { zhCatalog } from './catalog';
import { zhTools } from './tools';
import { zhCheatsheets } from './cheatsheets';

export const zhBundle: LocaleBundle = {
  common: zhCommon,
  catalog: zhCatalog,
  tools: zhTools,
  cheatsheets: zhCheatsheets,
};
