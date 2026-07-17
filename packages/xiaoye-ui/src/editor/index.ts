import type { App, Plugin } from 'vue';
import Editor from './Editor';
import { registerComponent } from '../_util/registerComponent';

export { default as editorProps } from './editorTypes';
export type {
  EditorProps,
  EditorTextChangeEvent,
  EditorSelectionChangeEvent,
  EditorLoadEvent,
} from './editorTypes';

/* istanbul ignore next */
Editor.install = function (app: App) {
  registerComponent(app, Editor);
  return app;
};

export default Editor as typeof Editor & Plugin;
