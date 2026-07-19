import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import mountTest from '../../../tests/shared/mountTest';
import {
  RichTextEditor,
  EditorLinkPopover,
  RichTextEditorToolbar,
  RichTextEditorDragHandle,
  RichTextEditorMentionMenu,
  RichTextEditorEmojiMenu,
  RichTextEditorSuggestionMenu,
} from '..';

// mock tiptap core 模块，避免 jsdom 下初始化真实 editor 报错
const mockEditor = {
  isDestroyed: false,
  isEditable: true,
  schema: { spec: { marks: { get: () => undefined } } },
  extensionManager: { extensions: [] },
  state: {
    selection: { from: 0, to: 0, empty: true, $from: { pos: 0, parent: {}, depth: 0 } },
    doc: { nodeAt: () => null, content: { size: 0 }, nodesBetween: () => false },
    storedMarks: [],
    tr: { setMeta: () => ({}) },
  },
  view: { dom: {}, state: { tr: { setMeta: () => ({}) } }, dispatch: () => {} },
  can: () => ({
    toggleMark: () => true,
    setMark: () => true,
    unsetMark: () => true,
    setTextAlign: () => true,
    toggleHeading: () => true,
    setLink: () => true,
    unsetLink: () => true,
    setImage: () => true,
    toggleBulletList: () => true,
    toggleOrderedList: () => true,
    toggleTaskList: () => true,
    liftListItem: () => true,
    insertTable: () => true,
    addColumnBefore: () => true,
    addColumnAfter: () => true,
    deleteColumn: () => true,
    addRowBefore: () => true,
    addRowAfter: () => true,
    deleteRow: () => true,
    mergeCells: () => true,
    splitCell: () => true,
    toggleHeaderRow: () => true,
    toggleHeaderColumn: () => true,
    toggleHeaderCell: () => true,
    clearNodes: () => true,
    unsetAllMarks: () => true,
    undo: () => true,
    redo: () => true,
  }),
  chain: () => ({
    focus: () => mockEditor.chain(),
    toggleMark: () => mockEditor.chain(),
    setMark: () => mockEditor.chain(),
    unsetMark: () => mockEditor.chain(),
    setTextAlign: () => mockEditor.chain(),
    toggleHeading: () => mockEditor.chain(),
    setLink: () => mockEditor.chain(),
    unsetLink: () => mockEditor.chain(),
    setImage: () => mockEditor.chain(),
    toggleBulletList: () => mockEditor.chain(),
    toggleOrderedList: () => mockEditor.chain(),
    toggleTaskList: () => mockEditor.chain(),
    liftListItem: () => mockEditor.chain(),
    lift: () => mockEditor.chain(),
    selectTextblockEnd: () => mockEditor.chain(),
    insertTable: () => mockEditor.chain(),
    addColumnBefore: () => mockEditor.chain(),
    addColumnAfter: () => mockEditor.chain(),
    deleteColumn: () => mockEditor.chain(),
    addRowBefore: () => mockEditor.chain(),
    addRowAfter: () => mockEditor.chain(),
    deleteRow: () => mockEditor.chain(),
    mergeCells: () => mockEditor.chain(),
    splitCell: () => mockEditor.chain(),
    toggleHeaderRow: () => mockEditor.chain(),
    toggleHeaderColumn: () => mockEditor.chain(),
    toggleHeaderCell: () => mockEditor.chain(),
    clearNodes: () => mockEditor.chain(),
    unsetAllMarks: () => mockEditor.chain(),
    setTextSelection: () => mockEditor.chain(),
    deleteRange: () => mockEditor.chain(),
    insertContent: () => mockEditor.chain(),
    insertContentAt: () => mockEditor.chain(),
    setContent: () => mockEditor.chain(),
    setNodeSelection: () => mockEditor.chain(),
    undo: () => mockEditor.chain(),
    redo: () => mockEditor.chain(),
    run: () => true,
  }),
  isActive: () => false,
  getAttributes: () => ({}),
  getHTML: () => '',
  getJSON: () => ({}),
  getMarkdown: () => '',
  getText: () => '',
  setEditable: () => {},
  registerPlugin: () => {},
  unregisterPlugin: () => {},
  destroy: vi.fn(),
  commands: { setContent: () => {}, setTextSelection: () => {}, setNodeSelection: () => {} },
};

// mock @tiptap/vue-3：useEditor 返回 ref(mockEditor)，EditorContent 渲染占位 div
vi.mock('@tiptap/vue-3', () => ({
  useEditor: () => ref(mockEditor),
  EditorContent: defineComponent({
    name: 'EditorContent',
    props: ['editor'],
    setup(_, { attrs }) {
      return () => h('div', { class: 'ProseMirror-mock', ...attrs });
    },
  }),
}));

vi.mock('@tiptap/vue-3/menus', () => ({
  BubbleMenu: defineComponent({
    name: 'BubbleMenu',
    props: ['editor', 'options'],
    setup(_, { slots }) {
      return () => h('div', { class: 'bubble-menu-mock' }, slots.default?.());
    },
  }),
  FloatingMenu: defineComponent({
    name: 'FloatingMenu',
    props: ['editor', 'options'],
    setup(_, { slots }) {
      return () => h('div', { class: 'floating-menu-mock' }, slots.default?.());
    },
  }),
}));

vi.mock('@tiptap/core', () => ({
  mergeAttributes: (...args) => Object.assign({}, ...args),
}));

vi.mock('@tiptap/starter-kit', () => ({
  default: { configure: () => ({ name: 'starterKit' }) },
}));
vi.mock('@tiptap/extension-placeholder', () => ({
  default: { configure: () => ({ name: 'placeholder' }) },
}));
vi.mock('@tiptap/extension-image', () => ({
  default: { configure: () => ({ name: 'image' }) },
}));
vi.mock('@tiptap/extension-mention', () => ({
  default: { configure: () => ({ name: 'mention' }) },
}));
vi.mock('@tiptap/extension-code', () => ({
  default: { extend: () => ({ name: 'code' }) },
}));
vi.mock('@tiptap/extension-horizontal-rule', () => ({
  default: { extend: () => ({ name: 'horizontalRule' }) },
}));
vi.mock('@tiptap/markdown', () => ({
  Markdown: { configure: () => ({ name: 'markdown' }) },
}));
vi.mock('@tiptap/extension-text-align', () => ({
  default: { configure: () => ({ name: 'textAlign' }) },
}));
vi.mock('@tiptap/extension-text-style', () => ({
  TextStyle: { name: 'textStyle' },
}));
vi.mock('@tiptap/extension-highlight', () => ({
  Highlight: { configure: () => ({ name: 'highlight' }) },
}));
vi.mock('@tiptap/extension-underline', () => ({
  default: { name: 'underline' },
}));
vi.mock('@tiptap/extension-table', () => ({
  Table: { configure: () => ({ name: 'table' }) },
}));
vi.mock('@tiptap/extension-table-row', () => ({
  TableRow: { name: 'tableRow' },
}));
vi.mock('@tiptap/extension-table-cell', () => ({
  TableCell: { name: 'tableCell' },
}));
vi.mock('@tiptap/extension-table-header', () => ({
  TableHeader: { name: 'tableHeader' },
}));
vi.mock('tiptap-extension-code-block-shiki', () => ({
  default: { configure: () => ({ name: 'codeBlockShiki' }) },
}));
vi.mock('@tiptap/extension-drag-handle-vue-3', () => ({
  default: defineComponent({
    name: 'DragHandle',
    inheritAttrs: false,
    props: ['editor', 'computePositionConfig', 'pluginKey', 'class', 'onClick'],
    setup(props, { emit, slots }) {
      return () =>
        h(
          'div',
          {
            class: ['drag-handle-mock', props.class],
            onClick: () => {
              // 模拟 DragHandle 扩展：先触发 nodeChange 设置 currentNodePos，再调用 onClick
              emit('nodeChange', { pos: 10 });
              props.onClick?.();
            },
          },
          slots.default?.(),
        );
    },
  }),
}));
vi.mock('@tiptap/suggestion', () => ({
  default: () => ({ name: 'suggestion-plugin' }),
}));
vi.mock('@tiptap/pm/state', () => ({
  PluginKey: class PluginKey {
    constructor(name) {
      this.name = name;
    }
  },
}));

describe('RichTextEditor', () => {
  mountTest(RichTextEditor);

  it('has correct name and flag', () => {
    expect(RichTextEditor.name).toBe('XYRichTextEditor');
    expect(RichTextEditor.__XY_RICH_TEXT_EDITOR).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof RichTextEditor.install).toBe('function');
  });

  it('renders root element with xy-rich-text-editor class', () => {
    const wrapper = mount(RichTextEditor);
    expect(wrapper.find('.xy-rich-text-editor').exists()).toBe(true);
    expect(wrapper.find('.xy-rich-text-editor-content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders custom as element', () => {
    const wrapper = mount(RichTextEditor, {
      props: { as: 'section' },
    });
    expect(wrapper.find('section.xy-rich-text-editor').exists()).toBe(true);
    wrapper.unmount();
  });

  it('exposes editor', () => {
    const wrapper = mount(RichTextEditor);
    expect(wrapper.vm.editor).toBeDefined();
    wrapper.unmount();
  });
});

describe('EditorLinkPopover', () => {
  // EditorLinkPopover 需要 editor prop，无法直接 mountTest
  it('has correct name and flag', () => {
    expect(EditorLinkPopover.name).toBe('XYEditorLinkPopover');
    expect(EditorLinkPopover.__XY_EDITOR_LINK_POPOVER).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof EditorLinkPopover.install).toBe('function');
  });

  it('renders nothing when not visible', () => {
    const wrapper = mount(EditorLinkPopover, {
      props: { editor: mockEditor },
    });
    expect(wrapper.find('.xy-rich-text-editor-link-popover').exists()).toBe(false);
    wrapper.unmount();
  });

  it('opens via exposed open method', async () => {
    const wrapper = mount(EditorLinkPopover, {
      props: { editor: mockEditor },
    });
    wrapper.vm.open();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xy-rich-text-editor-link-popover').exists()).toBe(true);
    wrapper.unmount();
  });
});

describe('RichTextEditorToolbar', () => {
  it('has correct name and flag', () => {
    expect(RichTextEditorToolbar.name).toBe('XYRichTextEditorToolbar');
    expect(RichTextEditorToolbar.__XY_RICH_TEXT_EDITOR_TOOLBAR).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof RichTextEditorToolbar.install).toBe('function');
  });

  it('renders fixed layout with items', () => {
    const wrapper = mount(RichTextEditorToolbar, {
      props: {
        editor: mockEditor,
        items: [
          { kind: 'bold', label: 'B' },
          { type: 'separator' },
          { kind: 'italic', label: 'I' },
        ],
      },
    });
    expect(wrapper.find('.xy-rich-text-editor-toolbar').exists()).toBe(true);
    expect(wrapper.findAll('.xy-rich-text-editor-toolbar-button').length).toBe(2);
    expect(wrapper.find('.xy-rich-text-editor-toolbar-separator').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders label item', () => {
    const wrapper = mount(RichTextEditorToolbar, {
      props: {
        editor: mockEditor,
        items: [{ type: 'label', label: '格式' }],
      },
    });
    expect(wrapper.find('.xy-rich-text-editor-toolbar-label').text()).toBe('格式');
    wrapper.unmount();
  });
});

describe('RichTextEditorDragHandle', () => {
  it('has correct name and flag', () => {
    expect(RichTextEditorDragHandle.name).toBe('XYRichTextEditorDragHandle');
    expect(RichTextEditorDragHandle.__XY_RICH_TEXT_EDITOR_DRAG_HANDLE).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof RichTextEditorDragHandle.install).toBe('function');
  });

  it('renders drag handle mock', () => {
    const wrapper = mount(RichTextEditorDragHandle, {
      props: { editor: mockEditor },
    });
    expect(wrapper.find('.xy-rich-text-editor-drag-handle').exists()).toBe(true);
    wrapper.unmount();
  });

  it('emits nodeChange with current pos on click', async () => {
    const nodeAtPos = { toJSON: () => ({ type: 'paragraph' }), nodeSize: 2 };
    const editorWithNode = {
      ...mockEditor,
      state: {
        ...mockEditor.state,
        doc: {
          ...mockEditor.state.doc,
          nodeAt: pos => (pos === 10 ? nodeAtPos : null),
        },
      },
    };

    const wrapper = mount(RichTextEditorDragHandle, {
      props: { editor: editorWithNode },
    });

    // 模拟 DragHandle 扩展：点击根元素触发 nodeChange 设置 currentNodePos，再调用 onClick
    await wrapper.find('.drag-handle-mock').trigger('click');

    expect(wrapper.emitted('nodeChange')).toHaveLength(1);
    expect(wrapper.emitted('nodeChange')[0][0]).toEqual({
      node: { type: 'paragraph' },
      pos: 10,
    });

    wrapper.unmount();
  });
});

describe('RichTextEditorMentionMenu', () => {
  it('has correct name and flag', () => {
    expect(RichTextEditorMentionMenu.name).toBe('XYRichTextEditorMentionMenu');
    expect(RichTextEditorMentionMenu.__XY_RICH_TEXT_EDITOR_MENTION_MENU).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof RichTextEditorMentionMenu.install).toBe('function');
  });

  it('renders placeholder div', () => {
    const wrapper = mount(RichTextEditorMentionMenu, {
      props: { editor: mockEditor },
    });
    expect(wrapper.find('div').exists()).toBe(true);
    wrapper.unmount();
  });
});

describe('RichTextEditorEmojiMenu', () => {
  it('has correct name and flag', () => {
    expect(RichTextEditorEmojiMenu.name).toBe('XYRichTextEditorEmojiMenu');
    expect(RichTextEditorEmojiMenu.__XY_RICH_TEXT_EDITOR_EMOJI_MENU).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof RichTextEditorEmojiMenu.install).toBe('function');
  });

  it('renders placeholder div', () => {
    const wrapper = mount(RichTextEditorEmojiMenu, {
      props: { editor: mockEditor },
    });
    expect(wrapper.find('div').exists()).toBe(true);
    wrapper.unmount();
  });
});

describe('RichTextEditorSuggestionMenu', () => {
  it('has correct name and flag', () => {
    expect(RichTextEditorSuggestionMenu.name).toBe('XYRichTextEditorSuggestionMenu');
    expect(RichTextEditorSuggestionMenu.__XY_RICH_TEXT_EDITOR_SUGGESTION_MENU).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof RichTextEditorSuggestionMenu.install).toBe('function');
  });

  it('renders placeholder div', () => {
    const wrapper = mount(RichTextEditorSuggestionMenu, {
      props: { editor: mockEditor },
    });
    expect(wrapper.find('div').exists()).toBe(true);
    wrapper.unmount();
  });
});
