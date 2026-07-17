import { ref, h, computed, unref, watch } from 'vue';
import type { Ref, MaybeRef } from 'vue';
import { defu } from 'defu';
import { computePosition } from '@floating-ui/dom';
import type { Strategy, Placement } from '@floating-ui/dom';
import type { Editor } from '@tiptap/vue-3';
import { VueRenderer } from '@tiptap/vue-3';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import type { Plugin } from '@tiptap/pm/state';
import type { FloatingUIOptions } from '../types/editor';
import { buildFloatingUIMiddleware } from '../utils/editor';

function isArrayOfArray(value: any): value is any[][] {
  return Array.isArray(value) && value.length > 0 && Array.isArray(value[0]);
}

function get(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return undefined;
  }
  return result;
}

function score(value: string, searchTerm: string): number | null {
  if (!searchTerm) return null;
  const lowerValue = value.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();
  if (!lowerValue.includes(lowerSearch)) return null;
  if (lowerValue === lowerSearch) return 0;
  if (lowerValue.startsWith(lowerSearch)) return 1;
  return 2;
}

const DEFAULT_MENU_CLASSES = {
  root: 'xy-rich-text-editor-menu',
  content: 'xy-rich-text-editor-menu__content',
  viewport: 'xy-rich-text-editor-menu__viewport',
  group: 'xy-rich-text-editor-menu__group',
  label: 'xy-rich-text-editor-menu__label',
  separator: 'xy-rich-text-editor-menu__separator',
  item: 'xy-rich-text-editor-menu__item',
  itemActive: 'xy-rich-text-editor-menu__item--active',
  itemLeading: 'xy-rich-text-editor-menu__item-leading',
  itemLeadingAvatar: 'xy-rich-text-editor-menu__item-leading-avatar',
  itemLeadingIcon: 'xy-rich-text-editor-menu__item-leading-icon',
  itemWrapper: 'xy-rich-text-editor-menu__item-wrapper',
  itemLabel: 'xy-rich-text-editor-menu__item-label',
  itemDescription: 'xy-rich-text-editor-menu__item-description',
};

export interface EditorMenuOptions<T = any> {
  editor: Editor;
  char: string;
  pluginKey: string;
  items?: MaybeRef<T[] | T[][] | undefined>;
  filterFields?: string[];
  filter?: (items: T[], query: string) => T[];
  ignoreFilter?: boolean;
  limit?: number;
  searchTerm?: Ref<string>;
  onSearchTermChange?: (term: string) => void;
  onSelect: (editor: Editor, range: any, item: T) => void;
  renderItem: (item: T, classes: typeof DEFAULT_MENU_CLASSES) => any;
  options?: FloatingUIOptions;
  suggestion?: Omit<
    Partial<SuggestionOptions>,
    'pluginKey' | 'editor' | 'char' | 'items' | 'command' | 'render'
  >;
  appendTo?: HTMLElement | (() => HTMLElement);
  classes?: Partial<typeof DEFAULT_MENU_CLASSES>;
}

export interface EditorMenuReturn<T = any> {
  plugin: Plugin;
  destroy: () => void;
  filteredItems: Ref<T[]>;
  searchTerm: Ref<string>;
}

export function useEditorMenu<T = any>(options: EditorMenuOptions<T>): EditorMenuReturn<T> {
  const filteredItems: Ref<T[]> = ref([]);
  const selectedIndex = ref(0);
  const menuState = ref<'closed' | 'open'>('closed');
  const searchTerm = options.searchTerm ?? ref('');
  let renderer: VueRenderer | null = null;
  let element: HTMLElement | null = null;
  let handleMouseDown: ((e: MouseEvent) => void) | null = null;
  let commandFn: ((item: T) => void) | null = null;
  let keyDownHandler: ((props: { event: KeyboardEvent }) => boolean) | null = null;
  let globalKeyHandler: ((e: KeyboardEvent) => void) | null = null;
  let blurHandler: (() => void) | null = null;
  let scrollHandler: (() => void) | null = null;
  let triggerClientRect: (() => DOMRect | null) | null = null;
  let handleHover: ((index: number) => void) | null = null;
  let stopItemsWatch: (() => void) | null = null;

  const classes = { ...DEFAULT_MENU_CLASSES, ...(options.classes || {}) };

  // 同步 searchTerm 到外部回调（修复 bug：原实现 searchTerm 仅在内部更新，
  // 调用方无法感知，导致 RichTextEditorMentionMenu 用 onChange hack 也不生效）
  if (options.onSearchTermChange) {
    watch(searchTerm, val => {
      options.onSearchTermChange?.(val);
    });
  }

  const cleanupMenu = () => {
    if (menuState.value === 'closed') return;

    menuState.value = 'closed';

    if (globalKeyHandler) {
      document.removeEventListener('keydown', globalKeyHandler, true);
      globalKeyHandler = null;
    }
    if (blurHandler) {
      options.editor.view.dom.removeEventListener('blur', blurHandler);
      blurHandler = null;
    }
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler, true);
      scrollHandler = null;
    }

    if (element && handleMouseDown) {
      element.removeEventListener('mousedown', handleMouseDown);
      handleMouseDown = null;
    }
    if (renderer) {
      renderer.destroy();
      renderer = null;
    }
    if (element) {
      element.remove();
      element = null;
    }
  };

  const filterFields = options.filterFields ?? ['label'];

  const defaultFilter = (items: T[], query: string) => {
    if (!query) return items;

    const scored: { item: T; score: number }[] = [];

    for (const item of items) {
      let bestScore: number | null = null;

      for (const field of filterFields) {
        const value = get(item as any, field);
        if (value == null) continue;

        const values = Array.isArray(value) ? value.map(String) : [String(value)];

        for (const v of values) {
          const normalized = v.replace(/[\s_-]/g, '');
          const s = Math.min(score(v, query) ?? 3, score(normalized, query) ?? 3);
          if (bestScore === null || s < bestScore) bestScore = s;
          if (bestScore === 0) break;
        }
        if (bestScore === 0) break;
      }

      if (bestScore !== null && bestScore < 3) {
        scored.push({ item, score: bestScore });
      }
    }

    scored.sort((a, b) => a.score - b.score);
    return scored.map(({ item }) => item);
  };

  const filter = options.filter || defaultFilter;
  const limit = options.limit ?? 42;

  const pluginKeyInstance =
    typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey;

  const groups = computed<T[][]>(() => {
    const items = unref(options.items);

    return items?.length ? (isArrayOfArray(items) ? (items as T[][]) : [items as T[]]) : [];
  });

  const items = computed(() => groups.value.flatMap(group => group));

  const filteredGroups = computed<T[][]>(() => {
    if (!filteredItems.value.length) return [];

    if (options.ignoreFilter) {
      return [filteredItems.value];
    }

    return groups.value
      .map(group => {
        const filtered = group.filter(item => filteredItems.value.includes(item));
        filtered.sort((a, b) => filteredItems.value.indexOf(a) - filteredItems.value.indexOf(b));
        return filtered;
      })
      .filter(group => group.length > 0);
  });

  const selectableItems = computed<T[]>(() => {
    return filteredItems.value.filter((item: any) => {
      return item.type !== 'label' && item.type !== 'separator';
    });
  });

  const floatingUIOptions = defu(options.options, {
    strategy: 'absolute' as Strategy,
    placement: 'bottom-start' as Placement,
    offset: 8,
    flip: {},
    shift: { padding: 8 },
    size: false,
    autoPlacement: false,
    hide: false,
    inline: false,
  });

  const middleware = buildFloatingUIMiddleware(floatingUIOptions);

  const updatePosition = (el: HTMLElement) => {
    if (!triggerClientRect) return;

    const rect = triggerClientRect();
    if (!rect) return;

    const virtualElement = {
      getBoundingClientRect: () => rect,
    };

    computePosition(virtualElement, el, {
      placement: floatingUIOptions.placement,
      strategy: floatingUIOptions.strategy,
      middleware,
    }).then(({ x, y, strategy }) => {
      el.style.width = 'max-content';
      el.style.position = strategy;
      el.style.top = '0';
      el.style.left = '0';
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    });
  };

  const showMenu = () => {
    menuState.value = 'open';

    if (!globalKeyHandler) {
      globalKeyHandler = (e: KeyboardEvent) => {
        if (keyDownHandler) {
          const handled = keyDownHandler({ event: e });
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };
      document.addEventListener('keydown', globalKeyHandler, true);
    }

    if (!blurHandler) {
      blurHandler = () => {
        setTimeout(() => {
          if (menuState.value === 'open') {
            const tr = options.editor.view.state.tr.setMeta(pluginKeyInstance, {
              exit: true,
            });
            options.editor.view.dispatch(tr);
          }
        }, 0);
      };
      options.editor.view.dom.addEventListener('blur', blurHandler);
    }

    if (!scrollHandler) {
      scrollHandler = () => {
        if (element) {
          updatePosition(element);
        }
      };
      window.addEventListener('scroll', scrollHandler, true);
    }

    handleHover = (index: number) => {
      selectedIndex.value = index;
      if (renderer) {
        renderer.updateProps({
          groups: filteredGroups.value,
          selectedIndex: index,
          onSelect: commandFn,
          onHover: handleHover!,
          state: menuState.value,
        });
      }
    };

    renderer = new VueRenderer(MenuComponent, {
      props: {
        groups: filteredGroups.value,
        selectedIndex: selectedIndex.value,
        onSelect: commandFn,
        onHover: handleHover,
        state: menuState.value,
      },
      editor: options.editor,
    });

    element = document.createElement('div');
    element.className = classes.root;
    element.style.position = floatingUIOptions.strategy;
    element.style.zIndex = '50';

    handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
    };
    element.addEventListener('mousedown', handleMouseDown);

    const appendToElement =
      typeof options.appendTo === 'function' ? options.appendTo() : options.appendTo;
    const container = appendToElement ?? options.editor.view.dom.parentElement;
    container?.appendChild(element);
    if (renderer.element) {
      element.appendChild(renderer.element);
    }

    updatePosition(element);
  };

  if (options.ignoreFilter) {
    stopItemsWatch = watch(
      () => unref(options.items),
      newItems => {
        if (!triggerClientRect) return;

        const normalizedItems = newItems?.length
          ? isArrayOfArray(newItems)
            ? (newItems as T[][]).flat()
            : (newItems as T[])
          : [];

        filteredItems.value = normalizedItems.slice(0, limit);

        if (!filteredItems.value.length) {
          cleanupMenu();
          return;
        }

        if (selectedIndex.value >= selectableItems.value.length) {
          selectedIndex.value = Math.max(0, selectableItems.value.length - 1);
        }

        if (menuState.value === 'closed' && filteredItems.value.length) {
          showMenu();
          return;
        }

        if (renderer) {
          renderer.updateProps({
            groups: filteredGroups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover!,
            state: menuState.value,
          });
        }

        if (element) {
          updatePosition(element);
        }
      },
      { deep: true, flush: 'sync' },
    );
  }

  const MenuComponent = {
    props: {
      groups: { type: Array, required: true },
      selectedIndex: { type: Number, required: true },
      onSelect: { type: Function, required: true },
      onHover: { type: Function, required: true },
      state: { type: String, required: true },
    },
    setup(menuProps: any) {
      function handleClick(e: MouseEvent, item: T, selectableIndex: number) {
        e.preventDefault();
        menuProps.onSelect(item, selectableIndex);
      }

      function handleMouseEnter(selectableIndex: number) {
        menuProps.onHover(selectableIndex);
      }

      return () => {
        const groupsData = menuProps.groups as T[][];
        const selectableIndexMap = new Map<T, number>();
        let selectableCounter = 0;
        for (const group of groupsData) {
          for (const item of group) {
            const itemData = item as any;
            if (itemData.type !== 'label' && itemData.type !== 'separator') {
              selectableIndexMap.set(item, selectableCounter++);
            }
          }
        }

        return h(
          'div',
          {
            class: classes.content,
            role: 'listbox',
            'data-state': menuProps.state,
          },
          [
            h(
              'div',
              {
                class: classes.viewport,
                role: 'presentation',
              },
              groupsData.map((group, groupIndex) =>
                h(
                  'div',
                  {
                    key: `group-${groupIndex}`,
                    class: classes.group,
                    role: 'group',
                  },
                  group.map((item, itemInGroupIndex) => {
                    const itemData = item as any;

                    if (itemData.type === 'label') {
                      return h(
                        'div',
                        {
                          key: `label-${groupIndex}-${itemInGroupIndex}`,
                          class: [classes.label, itemData.class],
                        },
                        options.renderItem(item, classes),
                      );
                    }

                    if (itemData.type === 'separator') {
                      return h('div', {
                        key: `separator-${groupIndex}-${itemInGroupIndex}`,
                        class: [classes.separator, itemData.class],
                        role: 'separator',
                      });
                    }

                    const selectableIndex = selectableIndexMap.get(item)!;
                    const isHighlighted = selectableIndex === menuProps.selectedIndex;

                    return h(
                      'div',
                      {
                        key: `item-${selectableIndex}`,
                        class: [
                          classes.item,
                          { [classes.itemActive]: isHighlighted },
                          itemData.class,
                        ],
                        role: 'option',
                        'aria-selected': isHighlighted,
                        'data-highlighted': isHighlighted ? '' : undefined,
                        'data-disabled': itemData.disabled ? '' : undefined,
                        onMousedown: (e: MouseEvent) => handleClick(e, item, selectableIndex),
                        onMouseenter: () => handleMouseEnter(selectableIndex),
                        ref: (el: any) => {
                          if (el && isHighlighted) {
                            el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                          }
                        },
                      },
                      options.renderItem(item, classes),
                    );
                  }),
                ),
              ),
            ),
          ],
        );
      };
    },
  };

  const plugin: Plugin = Suggestion({
    ...(options.suggestion || {}),
    pluginKey: pluginKeyInstance,
    editor: options.editor,
    char: options.char,
    items: ({ query: q }: { query: string }) => {
      searchTerm.value = q;

      if (options.ignoreFilter) {
        return items.value.slice(0, limit);
      }

      const filtered = filter(items.value, q);
      return filtered.slice(0, limit);
    },
    command: ({ editor, range, props }: any) => {
      options.onSelect(editor, range, props);
    },
    render: () => {
      keyDownHandler = (props: { event: KeyboardEvent }) => {
        const { event } = props;

        if (!renderer || !selectableItems.value.length) {
          return false;
        }

        if (event.key === 'Escape') {
          cleanupMenu();
          return true;
        }

        if (event.key === 'ArrowUp') {
          selectedIndex.value =
            (selectedIndex.value + selectableItems.value.length - 1) % selectableItems.value.length;
          renderer?.updateProps({
            groups: filteredGroups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover!,
            state: menuState.value,
          });
          return true;
        }

        if (event.key === 'ArrowDown') {
          selectedIndex.value = (selectedIndex.value + 1) % selectableItems.value.length;
          renderer?.updateProps({
            groups: filteredGroups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover!,
            state: menuState.value,
          });
          return true;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
          const selectedItem = selectableItems.value[selectedIndex.value];
          if (selectedItem && commandFn) {
            commandFn(selectedItem);
          }
          return true;
        }

        return false;
      };

      const handlers = {
        onStart: (suggestionProps: SuggestionProps) => {
          filteredItems.value = options.ignoreFilter
            ? items.value.slice(0, limit)
            : (suggestionProps.items as T[]);

          selectedIndex.value = 0;

          commandFn = (item: T) => suggestionProps.command(item);

          triggerClientRect = suggestionProps.clientRect as () => DOMRect | null;

          if (!filteredItems.value.length) {
            return;
          }

          showMenu();
        },
        onUpdate: (suggestionProps: SuggestionProps) => {
          filteredItems.value = options.ignoreFilter
            ? items.value.slice(0, limit)
            : (suggestionProps.items as T[]);

          commandFn = (item: T) => suggestionProps.command(item);

          if (selectedIndex.value >= selectableItems.value.length) {
            selectedIndex.value = Math.max(0, selectableItems.value.length - 1);
          }

          if (!filteredItems.value.length) {
            cleanupMenu();
            return;
          }

          if (!renderer) {
            showMenu();
          } else {
            renderer.updateProps({
              groups: filteredGroups.value,
              selectedIndex: selectedIndex.value,
              onSelect: commandFn,
              onHover: handleHover!,
              state: menuState.value,
            });
          }

          if (element) {
            updatePosition(element);
          }
        },
        onKeyDown: keyDownHandler!,
        onExit: () => {
          cleanupMenu();
          triggerClientRect = null;
          searchTerm.value = '';
        },
      };
      return handlers;
    },
  });

  const destroy = () => {
    menuState.value = 'closed';

    if (globalKeyHandler) {
      document.removeEventListener('keydown', globalKeyHandler, true);
      globalKeyHandler = null;
    }
    if (blurHandler) {
      options.editor.view.dom.removeEventListener('blur', blurHandler);
      blurHandler = null;
    }
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler, true);
      scrollHandler = null;
    }
    if (element && handleMouseDown) {
      element.removeEventListener('mousedown', handleMouseDown);
      handleMouseDown = null;
    }
    if (renderer) {
      renderer.destroy();
      renderer = null;
    }
    if (element) {
      element.remove();
      element = null;
    }
    if (stopItemsWatch) {
      stopItemsWatch();
      stopItemsWatch = null;
    }
    // 修复 bug：原 destroy 未清理以下闭包变量，可能导致旧回调被复用或内存泄漏
    commandFn = null;
    keyDownHandler = null;
    triggerClientRect = null;
    handleHover = null;
  };

  return {
    plugin,
    destroy,
    filteredItems,
    searchTerm,
  };
}
