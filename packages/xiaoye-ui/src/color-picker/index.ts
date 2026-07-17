import type { App, Plugin } from 'vue';
import ColorPicker from './ColorPicker';
import { registerComponent } from '../_util/registerComponent';

export { default as colorPickerProps } from './colorPickerTypes';
export type {
  ColorPickerProps,
  ColorPickerFormat,
  ColorPickerAppendToType,
  ColorPickerHSBValue,
  ColorPickerRGBValue,
  ColorPickerChangeEvent,
} from './colorPickerTypes';

/* istanbul ignore next */
ColorPicker.install = function (app: App) {
  registerComponent(app, ColorPicker);
  return app;
};

export default ColorPicker as typeof ColorPicker & Plugin;
