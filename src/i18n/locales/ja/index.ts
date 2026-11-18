import type { LocaleBundle } from '../../types';
import { jaCommon } from './common';
import { jaCatalog } from './catalog';
import { jaTools } from './tools';
import { jaCheatsheets } from './cheatsheets';

export const jaBundle: LocaleBundle = {
  common: jaCommon,
  catalog: jaCatalog,
  tools: jaTools,
  cheatsheets: jaCheatsheets,
};
