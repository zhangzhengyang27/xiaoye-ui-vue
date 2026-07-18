import type { App, Plugin } from 'vue';
import RichTextEditor from './RichTextEditor';
import RichTextEditorToolbar from './RichTextEditorToolbar';
import RichTextEditorDragHandle from './RichTextEditorDragHandle';
import RichTextEditorMentionMenu from './RichTextEditorMentionMenu';
import RichTextEditorEmojiMenu from './RichTextEditorEmojiMenu';
import RichTextEditorSuggestionMenu from './RichTextEditorSuggestionMenu';
import EditorLinkPopover from './EditorLinkPopover';
import { registerComponent } from '../_util/registerComponent';

export { richTextEditorProps } from './RichTextEditor';
export type {
  RichTextEditorProps,
  RichTextEditorContentType,
  RichTextEditorSlots,
} from './RichTextEditor';

export { richTextEditorToolbarProps } from './RichTextEditorToolbar';
export type {
  RichTextEditorToolbarProps,
  EditorToolbarButtonItem,
  EditorToolbarDropdownItem,
  EditorToolbarSeparatorItem,
  EditorToolbarLabelItem,
  EditorToolbarChildItem,
  EditorToolbarItem,
  EditorToolbarSlots,
} from './RichTextEditorToolbar';

export { richTextEditorDragHandleProps } from './RichTextEditorDragHandle';
export type {
  RichTextEditorDragHandleProps,
  EditorDragHandleProps,
  EditorDragHandleSlots,
  EditorDragHandleEmits,
} from './RichTextEditorDragHandle';

export { richTextEditorMentionMenuProps } from './RichTextEditorMentionMenu';
export type {
  RichTextEditorMentionMenuProps,
  EditorMentionMenuItem,
  EditorMentionMenuEmits,
} from './RichTextEditorMentionMenu';

export { richTextEditorEmojiMenuProps } from './RichTextEditorEmojiMenu';
export type { RichTextEditorEmojiMenuProps, EmojiMenuItem } from './RichTextEditorEmojiMenu';

export { richTextEditorSuggestionMenuProps } from './RichTextEditorSuggestionMenu';
export type {
  RichTextEditorSuggestionMenuProps,
  EditorSuggestionMenuLabelItem,
  EditorSuggestionMenuSeparatorItem,
  EditorSuggestionMenuActionItem,
  EditorSuggestionMenuItem,
  EditorSuggestionMenuProps,
} from './RichTextEditorSuggestionMenu';

export { editorLinkPopoverProps } from './EditorLinkPopover';
export type { EditorLinkPopoverProps } from './EditorLinkPopover';

// 默认工具栏 items 配置（7 组完整配置，可直接传给 RichTextEditorToolbar 的 items prop）
export { defaultToolbarItems } from './defaultToolbarItems';

export type {
  FloatingUIOptions,
  EditorHandler,
  EditorCustomHandlers,
  EditorHandlers,
  EditorItem,
} from './types/editor';

export {
  createHandlers,
  createMarkHandler,
  createToggleHandler,
  createSetHandler,
  createSimpleHandler,
  createTextAlignHandler,
  createHeadingHandler,
  createLinkHandler,
  createImageHandler,
  createListHandler,
  createMoveHandler,
  createTableInsertHandler,
  createTableColumnHandler,
  createTableRowHandler,
  createTableCellHandler,
  createTableToggleHeaderHandler,
  mapEditorItems,
  buildFloatingUIMiddleware,
  isMarkInSchema,
  isNodeTypeSelected,
  isExtensionAvailable,
} from './utils/editor';

export { useEditorMenu } from './composables/useEditorMenu';
export type { EditorMenuOptions } from './composables/useEditorMenu';

/* istanbul ignore next */
RichTextEditor.install = function (app: App) {
  registerComponent(app, RichTextEditor);
  return app;
};

/* istanbul ignore next */
RichTextEditorToolbar.install = function (app: App) {
  registerComponent(app, RichTextEditorToolbar);
  return app;
};

/* istanbul ignore next */
RichTextEditorDragHandle.install = function (app: App) {
  registerComponent(app, RichTextEditorDragHandle);
  return app;
};

/* istanbul ignore next */
RichTextEditorMentionMenu.install = function (app: App) {
  registerComponent(app, RichTextEditorMentionMenu);
  return app;
};

/* istanbul ignore next */
RichTextEditorEmojiMenu.install = function (app: App) {
  registerComponent(app, RichTextEditorEmojiMenu);
  return app;
};

/* istanbul ignore next */
RichTextEditorSuggestionMenu.install = function (app: App) {
  registerComponent(app, RichTextEditorSuggestionMenu);
  return app;
};

/* istanbul ignore next */
EditorLinkPopover.install = function (app: App) {
  registerComponent(app, EditorLinkPopover);
  return app;
};

export {
  RichTextEditor,
  RichTextEditorToolbar,
  RichTextEditorDragHandle,
  RichTextEditorMentionMenu,
  RichTextEditorEmojiMenu,
  RichTextEditorSuggestionMenu,
  EditorLinkPopover,
};

export default RichTextEditor as typeof RichTextEditor & Plugin;
