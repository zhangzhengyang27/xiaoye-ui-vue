import type { Editor, Mark } from '@tiptap/vue-3';
import type { Middleware } from '@floating-ui/dom';
import { flip, shift, offset, size, autoPlacement, hide, inline } from '@floating-ui/dom';
import type {
  EditorHandlers,
  EditorCustomHandlers,
  EditorItem,
  FloatingUIOptions,
} from '../types/editor';

/**
 * 安全调用 editor.can() 返回对象上的方法。
 * 当方法不存在或抛错时返回 false（避免 "is not a function" 运行时错误）。
 *
 * 某些 Tiptap 扩展（如 Table、TextAlign）的 can() 可能不暴露对应方法，
 * 直接调用会抛 `TypeError: ... is not a function`。
 */
function safeCanCall(editor: Editor, fnName: string, ...args: any[]): boolean {
  try {
    const can = editor.can() as any;
    const fn = can?.[fnName];
    if (typeof fn !== 'function') return false;
    return !!fn.apply(can, args);
  } catch {
    return false;
  }
}

export function isMarkInSchema(mark: string | Mark, editor: Editor | null): boolean {
  if (!editor?.schema) {
    return false;
  }

  const markName = typeof mark === 'string' ? mark : mark.name;
  return editor.schema.spec.marks.get(markName) !== undefined;
}

export function isNodeTypeSelected(editor: Editor | null, nodeTypes: string[]): boolean {
  if (!editor) {
    return false;
  }

  const { selection } = editor.state;
  const { $from, to } = selection;

  return nodeTypes.some(nodeType => {
    return editor.state.doc.nodesBetween($from.pos, to, node => {
      return node.type.name === nodeType;
    });
  });
}

export function isExtensionAvailable(editor: Editor | null, extensionName: string): boolean {
  if (!editor) {
    return false;
  }

  return editor.extensionManager.extensions.some(ext => ext.name === extensionName);
}

export function createToggleHandler(name: string) {
  const fnName = `toggle${name.charAt(0).toUpperCase()}${name.slice(1)}` as keyof Editor['chain'];

  return {
    canExecute: (editor: Editor) => safeCanCall(editor, fnName),
    execute: (editor: Editor) => (editor.chain().focus() as any)[fnName](),
    isActive: (editor: Editor) => editor.isActive(name),
    isDisabled: (editor: Editor) =>
      isNodeTypeSelected(editor, ['image']) || editor.isActive('code'),
  };
}

export function createSetHandler(name: string) {
  const fnName = `set${name.charAt(0).toUpperCase()}${name.slice(1)}` as keyof Editor['chain'];

  return {
    canExecute: (editor: Editor) => safeCanCall(editor, fnName),
    execute: (editor: Editor) => (editor.chain().focus() as any)[fnName](),
    isActive: (editor: Editor) => editor.isActive(name),
    isDisabled: (editor: Editor) =>
      isNodeTypeSelected(editor, ['image']) || editor.isActive('code'),
  };
}

export function createSimpleHandler(name: string) {
  return {
    canExecute: (editor: Editor) => safeCanCall(editor, name),
    execute: (editor: Editor) => (editor.chain() as any)[name](),
    isActive: () => false,
    isDisabled: undefined,
  };
}

export function createMarkHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => safeCanCall(editor, 'toggleMark', cmd.mark),
    execute: (editor: Editor, cmd: any) => editor.chain().focus().toggleMark(cmd.mark),
    isActive: (editor: Editor, cmd: any) => editor.isActive(cmd.mark),
    isDisabled: (editor: Editor, cmd: any) =>
      !isMarkInSchema(cmd.mark, editor) || isNodeTypeSelected(editor, ['image']),
  };
}

export function createTextAlignHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => safeCanCall(editor, 'setTextAlign', cmd.align),
    execute: (editor: Editor, cmd: any) => (editor.chain().focus() as any).setTextAlign(cmd.align),
    isActive: (editor: Editor, cmd: any) => editor.isActive({ textAlign: cmd.align }),
    isDisabled: (editor: Editor) =>
      !isExtensionAvailable(editor, 'textAlign') ||
      isNodeTypeSelected(editor, ['image', 'horizontalRule']),
  };
}

export function createHeadingHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) =>
      safeCanCall(editor, 'toggleHeading', { level: cmd.level }),
    execute: (editor: Editor, cmd: any) =>
      editor.chain().focus().toggleHeading({ level: cmd.level }),
    isActive: (editor: Editor, cmd: any) => editor.isActive('heading', { level: cmd.level }),
    isDisabled: (editor: Editor) =>
      isNodeTypeSelected(editor, ['image']) || editor.isActive('code'),
  };
}

export function createLinkHandler() {
  return {
    canExecute: (editor: Editor) => {
      return safeCanCall(editor, 'setLink', { href: '' }) || safeCanCall(editor, 'unsetLink');
    },
    execute: (editor: Editor, cmd: any) => {
      const chain = editor.chain();
      const previousUrl = editor.getAttributes('link').href;
      const hasCode = editor.isActive('code');

      if (previousUrl) {
        return chain.focus().unsetLink();
      }

      const href = cmd?.href || (typeof prompt === 'function' ? prompt('Enter the URL:') : '');
      if (!href) {
        return chain;
      }

      if (hasCode) {
        return chain.focus().extendMarkRange('code').setLink({ href });
      }

      return chain.focus().setLink({ href });
    },
    isActive: (editor: Editor) => editor.isActive('link'),
    isDisabled: (editor: Editor) => {
      if (!isExtensionAvailable(editor, 'link') || isNodeTypeSelected(editor, ['image'])) {
        return true;
      }
      const { selection } = editor.state;
      return selection.empty && !editor.isActive('link');
    },
  };
}

export function createImageHandler() {
  return {
    canExecute: (editor: Editor) => {
      return safeCanCall(editor, 'setImage', { src: '' });
    },
    execute: (editor: Editor, cmd: any) => {
      const chain = editor.chain().focus();

      // 优先使用传入的 src（URL 模式）
      if (cmd?.src) {
        return chain.setImage({ src: cmd.src });
      }

      // SSR 安全：非浏览器环境 fallback 到 URL 输入
      if (typeof document === 'undefined') {
        const src = typeof prompt === 'function' ? prompt('Enter the image URL:') : '';
        if (src) {
          return chain.setImage({ src });
        }
        return chain;
      }

      // 文件上传模式：通过 FileReader 转 base64
      // 注意：base64 会增大文档体积，生产环境建议通过 cmd.src 传入上传后的 URL
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = event => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            chain.setImage({ src: base64 }).run();
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return chain;
    },
    isActive: (editor: Editor) => editor.isActive('image'),
    isDisabled: (editor: Editor) => {
      return !isExtensionAvailable(editor, 'image');
    },
  };
}

export function createListHandler(listType: 'bulletList' | 'orderedList' | 'taskList') {
  const fnNameMap = {
    bulletList: 'toggleBulletList' as const,
    orderedList: 'toggleOrderedList' as const,
    taskList: 'toggleTaskList' as const,
  };
  const fnName = fnNameMap[listType];
  const listItemType = listType === 'taskList' ? 'taskItem' : 'listItem';
  const allListTypes = ['bulletList', 'orderedList', 'taskList'] as const;

  return {
    canExecute: (editor: Editor) => {
      return (
        safeCanCall(editor, fnName) ||
        editor.isActive('listItem') ||
        allListTypes.some(type => isExtensionAvailable(editor, type) && editor.isActive(type))
      );
    },
    execute: (editor: Editor) => {
      const { state } = editor;
      const { selection } = state;
      let chain = editor.chain().focus();

      if ((selection as any).node) {
        const node = (selection as any).node;
        const firstChild = node.firstChild?.firstChild;
        const lastChild = node.lastChild?.lastChild;

        const from = firstChild ? selection.from + firstChild.nodeSize : selection.from + 1;
        const to = lastChild ? selection.to - lastChild.nodeSize : selection.to - 1;

        chain = chain.setTextSelection({ from, to }).clearNodes();
      }

      if (editor.isActive(listType)) {
        let result = chain.liftListItem(listItemType);
        for (const type of allListTypes) {
          if (isExtensionAvailable(editor, type)) {
            result = result.lift(type);
          }
        }
        return result.selectTextblockEnd();
      }

      if (allListTypes.some(type => isExtensionAvailable(editor, type) && editor.isActive(type))) {
        const currentListItemType = editor.isActive('taskList') ? 'taskItem' : 'listItem';
        let unwrapped = chain.liftListItem(currentListItemType);
        for (const type of allListTypes) {
          if (isExtensionAvailable(editor, type)) {
            unwrapped = unwrapped.lift(type);
          }
        }
        return (unwrapped as any)[fnName]().selectTextblockEnd();
      }

      return (chain as any)[fnName]().selectTextblockEnd();
    },
    isActive: (editor: Editor) => editor.isActive(listType),
    isDisabled: (editor: Editor) => {
      if (!isExtensionAvailable(editor, listType)) {
        return true;
      }
      return isNodeTypeSelected(editor, ['image']) || editor.isActive('code');
    },
  };
}

export function createMoveHandler(direction: 'up' | 'down') {
  return {
    canExecute: (editor: Editor, cmd: any) => {
      if (cmd?.pos == null) return false;
      const node = editor.state.doc.nodeAt(cmd.pos);
      if (!node) return false;
      const $pos = editor.state.doc.resolve(cmd.pos);
      const parent = $pos.parent;
      const index = $pos.index();
      return direction === 'up' ? index > 0 : index < parent.childCount - 1;
    },
    execute: (editor: Editor, cmd: any) => {
      if (cmd?.pos == null) return editor.chain();
      const node = editor.state.doc.nodeAt(cmd.pos);
      if (!node) return editor.chain();

      const $pos = editor.state.doc.resolve(cmd.pos);
      const parent = $pos.parent;
      const index = $pos.index();

      if (direction === 'up' && index > 0) {
        const prevNode = parent.child(index - 1);
        const targetPos = cmd.pos - prevNode.nodeSize;
        return editor
          .chain()
          .focus()
          .deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize })
          .insertContentAt(targetPos, node.toJSON());
      }

      if (direction === 'down' && index < parent.childCount - 1) {
        const nextNode = parent.child(index + 1);
        const targetPos = cmd.pos + nextNode.nodeSize;
        return editor
          .chain()
          .focus()
          .deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize })
          .insertContentAt(targetPos, node.toJSON());
      }

      return editor.chain();
    },
    isActive: () => false,
    isDisabled: undefined,
  };
}

export function createTableInsertHandler() {
  return {
    canExecute: (editor: Editor, cmd?: any) => {
      if (!isExtensionAvailable(editor, 'table')) return false;
      const rows = cmd?.rows ?? 3;
      const cols = cmd?.cols ?? 3;
      return safeCanCall(editor, 'insertTable', { rows, cols });
    },
    execute: (editor: Editor, cmd?: any) => {
      const rows = cmd?.rows ?? 3;
      const cols = cmd?.cols ?? 3;
      return (editor.chain().focus() as any).insertTable({
        rows,
        cols,
        withHeaderRow: true,
      });
    },
    isActive: () => false,
    isDisabled: (editor: Editor) => !isExtensionAvailable(editor, 'table'),
  };
}

export function createTableColumnHandler(
  action: 'addColumnBefore' | 'addColumnAfter' | 'deleteColumn',
) {
  return {
    canExecute: (editor: Editor) => {
      if (!isExtensionAvailable(editor, 'table')) return false;
      return safeCanCall(editor, action);
    },
    execute: (editor: Editor) => (editor.chain().focus() as any)[action](),
    isActive: () => false,
    isDisabled: (editor: Editor) => !isExtensionAvailable(editor, 'table'),
  };
}

export function createTableRowHandler(action: 'addRowBefore' | 'addRowAfter' | 'deleteRow') {
  return {
    canExecute: (editor: Editor) => {
      if (!isExtensionAvailable(editor, 'table')) return false;
      return safeCanCall(editor, action);
    },
    execute: (editor: Editor) => (editor.chain().focus() as any)[action](),
    isActive: () => false,
    isDisabled: (editor: Editor) => !isExtensionAvailable(editor, 'table'),
  };
}

export function createTableCellHandler(action: 'mergeCells' | 'splitCell') {
  return {
    canExecute: (editor: Editor) => {
      if (!isExtensionAvailable(editor, 'table')) return false;
      return safeCanCall(editor, action);
    },
    execute: (editor: Editor) => (editor.chain().focus() as any)[action](),
    isActive: () => false,
    isDisabled: (editor: Editor) => !isExtensionAvailable(editor, 'table'),
  };
}

export function createTableToggleHeaderHandler(type: 'headerRow' | 'headerColumn' | 'headerCell') {
  const fnName =
    `toggleHeader${type.charAt(0).toUpperCase()}${type.slice(1)}` as keyof Editor['chain'];
  return {
    canExecute: (editor: Editor) => {
      if (!isExtensionAvailable(editor, 'table')) return false;
      return safeCanCall(editor, fnName);
    },
    execute: (editor: Editor) => (editor.chain().focus() as any)[fnName](),
    isActive: (editor: Editor) => {
      if (type === 'headerRow') return editor.isActive('table', { headerRow: true });
      if (type === 'headerColumn') return editor.isActive('table', { headerColumn: true });
      return false;
    },
    isDisabled: (editor: Editor) => !isExtensionAvailable(editor, 'table'),
  };
}

export function createHandlers(): EditorHandlers {
  // 1:1 复刻 ui-4：保留 mark handler，通过 item.mark 区分 bold/italic/underline/strike/code
  const markHandler = createMarkHandler();

  // 为常用 mark 创建便捷别名，兼容示例中 handlers.bold.execute(editor).run() 等调用方式
  const createMarkAlias = (mark: string) => ({
    canExecute: (editor: Editor) => markHandler.canExecute(editor, { mark }),
    execute: (editor: Editor) => markHandler.execute(editor, { mark }),
    isActive: (editor: Editor) => markHandler.isActive(editor, { mark }),
    isDisabled: (editor: Editor) => markHandler.isDisabled(editor, { mark }),
  });

  return {
    mark: markHandler,
    bold: createMarkAlias('bold'),
    italic: createMarkAlias('italic'),
    underline: createMarkAlias('underline'),
    strike: createMarkAlias('strike'),
    code: createMarkAlias('code'),
    textAlign: createTextAlignHandler(),
    heading: createHeadingHandler(),
    link: createLinkHandler(),
    image: createImageHandler(),
    // 修复 bug：原实现 execute 返回 setMark(...).run() 的结果（已 run），
    // 与其他 handler 返回 chain 的约定不一致，会导致 mapEditorItems 中再次调用 .run() 报错。
    // 统一返回未 run 的 chain，由调用方决定是否 run。
    textColor: {
      canExecute: (editor: Editor) => safeCanCall(editor, 'setMark', 'textStyle'),
      execute: (editor: Editor, cmd: any) => {
        const color = cmd?.color;
        if (!color) return editor.chain().focus();
        return editor.chain().focus().setMark('textStyle', { color });
      },
      isActive: (editor: Editor, cmd?: any) => {
        const color = cmd?.color;
        if (!color) return false;
        const marks = editor.state.storedMarks || editor.state.selection.$head.marks();
        return marks.some(
          (mark: any) => mark.type.name === 'textStyle' && mark.attrs.color === color,
        );
      },
    },
    // 修复 bug：同 textColor，统一返回未 run 的 chain
    highlight: {
      canExecute: (editor: Editor) => safeCanCall(editor, 'setMark', 'highlight'),
      execute: (editor: Editor, cmd: any) => {
        const color = cmd?.color;
        if (!color) {
          // Remove highlight
          return editor.chain().focus().unsetMark('highlight');
        }
        return editor.chain().focus().setMark('highlight', { color });
      },
      isActive: (editor: Editor, cmd?: any) => {
        const color = cmd?.color;
        if (!color) return false;
        const marks = editor.state.storedMarks || editor.state.selection.$head.marks();
        return marks.some(
          (mark: any) => mark.type.name === 'highlight' && mark.attrs.color === color,
        );
      },
    },
    blockquote: createToggleHandler('blockquote'),
    bulletList: createListHandler('bulletList'),
    orderedList: createListHandler('orderedList'),
    taskList: createListHandler('taskList'),
    codeBlock: createToggleHandler('codeBlock'),
    horizontalRule: createSetHandler('horizontalRule'),
    paragraph: createSetHandler('paragraph'),
    undo: createSimpleHandler('undo'),
    redo: createSimpleHandler('redo'),
    clearFormatting: {
      canExecute: (editor: Editor, cmd: any) => {
        if (cmd?.pos != null) {
          const node = editor.state.doc.nodeAt(cmd.pos);
          return !!node;
        }
        return safeCanCall(editor, 'clearNodes') || safeCanCall(editor, 'unsetAllMarks');
      },
      execute: (editor: Editor, cmd: any) => {
        if (cmd?.pos != null) {
          const node = editor.state.doc.nodeAt(cmd.pos);
          if (!node) return editor.chain();

          const from = cmd.pos + 1;
          const to = cmd.pos + node.nodeSize - 1;

          return editor.chain().focus().setTextSelection({ from, to }).clearNodes().unsetAllMarks();
        }

        return editor.chain().focus().clearNodes().unsetAllMarks();
      },
      isActive: () => false,
      isDisabled: undefined,
    },
    duplicate: {
      canExecute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return false;
        const node = editor.state.doc.nodeAt(cmd.pos);
        return !!node;
      },
      execute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return editor.chain();
        const node = editor.state.doc.nodeAt(cmd.pos);
        if (!node) return editor.chain();
        return editor
          .chain()
          .focus()
          .insertContentAt(cmd.pos + node.nodeSize, node.toJSON());
      },
      isActive: () => false,
      isDisabled: undefined,
    },
    delete: {
      canExecute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return false;
        const node = editor.state.doc.nodeAt(cmd.pos);
        return !!node;
      },
      execute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return editor.chain();
        const node = editor.state.doc.nodeAt(cmd.pos);
        if (!node) return editor.chain();
        return editor
          .chain()
          .focus()
          .deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize });
      },
      isActive: () => false,
      isDisabled: undefined,
    },
    moveUp: createMoveHandler('up'),
    moveDown: createMoveHandler('down'),
    suggestion: {
      canExecute: () => true,
      execute: (editor: Editor, cmd?: any) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if (cmd?.pos !== undefined) {
          const node = state.doc.nodeAt(cmd.pos);
          if (node) {
            const insertPos = cmd.pos + node.nodeSize;
            return editor
              .chain()
              .focus()
              .insertContentAt(insertPos, {
                type: 'paragraph',
                content: [{ type: 'text', text: '/' }],
              });
          }
        }

        const currentNode = $from.node($from.depth);
        const currentNodePos = $from.before($from.depth);
        const insertPos = currentNodePos + currentNode.nodeSize;

        return editor
          .chain()
          .focus()
          .insertContentAt(insertPos, {
            type: 'paragraph',
            content: [{ type: 'text', text: '/' }],
          });
      },
      isActive: () => false,
      isDisabled: undefined,
    },
    mention: {
      canExecute: () => true,
      execute: (editor: Editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        const textBefore = $from.parent.textBetween(
          Math.max(0, $from.parentOffset - 1),
          $from.parentOffset,
          undefined,
          ' ',
        );
        const needsSpace = textBefore && textBefore !== ' ';

        return editor
          .chain()
          .focus()
          .insertContent(needsSpace ? ' @' : '@');
      },
      isActive: () => false,
      isDisabled: undefined,
    },
    emoji: {
      canExecute: () => true,
      execute: (editor: Editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        const textBefore = $from.parent.textBetween(
          Math.max(0, $from.parentOffset - 1),
          $from.parentOffset,
          undefined,
          ' ',
        );
        const needsSpace = textBefore && textBefore !== ' ';

        return editor
          .chain()
          .focus()
          .insertContent(needsSpace ? ' :' : ':');
      },
      isActive: () => false,
      isDisabled: undefined,
    },
    insertTable: createTableInsertHandler(),
    addColumnBefore: createTableColumnHandler('addColumnBefore'),
    addColumnAfter: createTableColumnHandler('addColumnAfter'),
    deleteColumn: createTableColumnHandler('deleteColumn'),
    addRowBefore: createTableRowHandler('addRowBefore'),
    addRowAfter: createTableRowHandler('addRowAfter'),
    deleteRow: createTableRowHandler('deleteRow'),
    mergeCells: createTableCellHandler('mergeCells'),
    splitCell: createTableCellHandler('splitCell'),
    toggleHeaderRow: createTableToggleHeaderHandler('headerRow'),
    toggleHeaderColumn: createTableToggleHeaderHandler('headerColumn'),
    toggleHeaderCell: createTableToggleHeaderHandler('headerCell'),
  };
}

export function mapEditorItems(
  editor: Editor,
  items:
    (Partial<EditorItem> & Record<string, any>)[] | (Partial<EditorItem> & Record<string, any>)[][],
  customHandlers?: EditorCustomHandlers,
): any[] | any[][] {
  const handlers = { ...createHandlers(), ...customHandlers };

  function isArrayOfArray(value: any): value is any[][] {
    return Array.isArray(value) && value.length > 0 && Array.isArray(value[0]);
  }

  if (isArrayOfArray(items)) {
    return items.map(group => mapEditorItems(editor, group, customHandlers)) as any[][];
  }

  return items.filter(Boolean).map(item => {
    if ('type' in item) {
      return item;
    }

    const { kind, children, ...rest } = item;

    const processedChildren = children?.length
      ? (mapEditorItems(editor, children as any, customHandlers) as any[])
      : undefined;

    if (kind) {
      const handler = handlers[kind];
      if (!handler) {
        return {
          ...rest,
          children: processedChildren,
        };
      }

      return {
        ...rest,
        children: processedChildren,
        disabled: handler.isDisabled?.(editor, item) || !handler.canExecute(editor, item),
        active: handler.isActive(editor, item),
        // 修复 bug：原实现直接调用 .run()，但部分 handler execute 已 run，
        // 这里改为安全调用，避免在 boolean 上调用 .run() 报错。
        onSelect: () => {
          const result = handler.execute(editor, item);
          if (result && typeof result.run === 'function') {
            result.run();
          }
        },
      };
    }

    return { ...rest, children: processedChildren };
  });
}

export function buildFloatingUIMiddleware(options: FloatingUIOptions): Middleware[] {
  const middleware: Middleware[] = [];

  if (options.offset) {
    middleware.push(offset(typeof options.offset !== 'boolean' ? options.offset : undefined));
  }

  if (options.flip) {
    middleware.push(flip(typeof options.flip !== 'boolean' ? options.flip : undefined));
  }

  if (options.shift) {
    middleware.push(shift(typeof options.shift !== 'boolean' ? options.shift : undefined));
  }

  if (options.size) {
    middleware.push(size(typeof options.size !== 'boolean' ? options.size : undefined));
  }

  if (options.autoPlacement) {
    middleware.push(
      autoPlacement(typeof options.autoPlacement !== 'boolean' ? options.autoPlacement : undefined),
    );
  }

  if (options.hide) {
    middleware.push(hide(typeof options.hide !== 'boolean' ? options.hide : undefined));
  }

  if (options.inline) {
    middleware.push(inline(typeof options.inline !== 'boolean' ? options.inline : undefined));
  }

  return middleware;
}
