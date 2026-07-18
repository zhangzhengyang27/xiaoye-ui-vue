import type { App, Plugin } from 'vue';
import MarkdownEditor from './MarkdownEditor';
import { registerComponent } from '../_util/registerComponent';

export { default as markdownEditorProps } from './markdownEditorTypes';
export type {
  MarkdownEditorProps,
  MarkdownEditorValueFormat,
  MarkdownEditorMode,
  MarkdownEditorTheme,
  MarkdownEditorIcon,
  MarkdownEditorInputEvent,
  MarkdownEditorAfterEvent,
} from './markdownEditorTypes';

/* istanbul ignore next */
MarkdownEditor.install = function (app: App) {
  registerComponent(app, MarkdownEditor);
  return app;
};

export default MarkdownEditor as typeof MarkdownEditor & Plugin;
