import type { App, Plugin } from 'vue';
import KeyFilter from './KeyFilter';
import { registerComponent } from '../_util/registerComponent';

export { keyFilterProps } from './keyFilterTypes';
export type {
  KeyFilterProps,
  KeyFilterPreset,
  KeyFilterPattern,
  KeyFilterOptions,
} from './keyFilterTypes';
export { DEFAULT_PATTERNS, getPresetRegex } from './presets';
export type { KeyFilterPresetName } from './presets';
export { useKeyFilter } from './useKeyFilter';
export type { UseKeyFilterOptions } from './useKeyFilter';

KeyFilter.install = function (app: App) {
  registerComponent(app, KeyFilter);
  return app;
};

export default KeyFilter as typeof KeyFilter & Plugin;
