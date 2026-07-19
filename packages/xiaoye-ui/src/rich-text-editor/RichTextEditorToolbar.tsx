/// <reference types="vue/jsx" />
import type { Component, VNode, PropType, ExtractPropTypes } from 'vue';
import {
  computed,
  inject,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  Transition,
  Teleport,
} from 'vue';
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus';
import { defu } from 'defu';
import { tv } from './utils/tv';
import theme from './theme/editor-toolbar';
import { createHandlers } from './utils/editor';
import type { Editor } from '@tiptap/vue-3';
import type { EditorItem } from './types/editor';
import { initDefaultProps } from '../_util/props-util';
import { anyType, stringType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

// SSR 安全：仅浏览器端可访问 document/window
const isClient = typeof window !== 'undefined' && !!window.document;

export interface EditorToolbarButtonItem {
  label?: string;
  icon?: string;
  trailingIcon?: string;
  slot?: string;
  tooltip?: string | { text?: string; position?: 'top' | 'bottom' | 'left' | 'right' };
  ariaLabel?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: ((e: MouseEvent) => void) | ((e: MouseEvent) => void)[];
  class?: any;
}

export interface EditorToolbarDropdownItem {
  label?: string;
  icon?: string;
  trailingIcon?: string;
  items?: EditorToolbarChildItem[] | EditorToolbarChildItem[][];
  class?: any;
}

export interface EditorToolbarSeparatorItem {
  type: 'separator';
}

export interface EditorToolbarLabelItem {
  type: 'label';
  label?: string;
  class?: any;
}

export type EditorToolbarChildItem = EditorToolbarButtonItem & Partial<EditorItem>;

export type EditorToolbarItem =
  | EditorToolbarButtonItem
  | (EditorToolbarButtonItem & EditorItem)
  | EditorToolbarDropdownItem
  | EditorToolbarSeparatorItem
  | EditorToolbarLabelItem;

export const richTextEditorToolbarProps = () => ({
  prefixCls: String,
  layout: stringType<'fixed' | 'bubble' | 'floating'>('fixed'),
  as: { type: [String, Object] as PropType<string | object>, default: 'div' },
  color: { type: String, default: 'neutral' },
  variant: { type: String, default: 'ghost' },
  activeColor: { type: String, default: 'primary' },
  activeVariant: { type: String, default: 'soft' },
  size: stringType<'sm' | 'md' | 'lg'>('sm'),
  items: anyType<EditorToolbarItem[] | EditorToolbarItem[][]>(),
  editor: { type: Object as PropType<Editor>, required: true },
  options: { type: Object, default: undefined },
  shouldShow: {
    type: Function as PropType<
      (ctx: { editor: Editor; view: any; state: any; oldState?: any }) => boolean
    >,
    default: undefined,
  },
});

export type RichTextEditorToolbarProps = Partial<
  ExtractPropTypes<ReturnType<typeof richTextEditorToolbarProps>>
>;

interface SlotPropsInternal {
  index: number;
  isActive: (item: EditorToolbarItem) => boolean;
  isDisabled: (item: EditorToolbarItem) => boolean;
  onClick: (e: MouseEvent, item: EditorToolbarItem) => void;
}
type SlotPropsFn = (props: { item: EditorToolbarItem } & SlotPropsInternal) => VNode[];

export interface EditorToolbarSlots {
  item?: SlotPropsFn;
  [key: string]: SlotPropsFn | undefined;
}

export default defineComponent({
  name: 'XYRichTextEditorToolbar',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_TOOLBAR: true,
  props: initDefaultProps(richTextEditorToolbarProps(), {}),
  setup(props, { attrs, slots }) {
    // 使用 RichTextEditor 统一的 prefixCls，确保 Toolbar 共享同一 hashId
    const { prefixCls: _prefixCls } = useConfigInject('rich-text-editor', props);
    const [, hashId] = useStyle(_prefixCls);

    const handlers = inject(
      'editorHandlers',
      computed(() => createHandlers()),
    );

    // 1:1 复刻 ui-4：通过 tv() 组合 theme 与变体
    const ui = computed(() =>
      tv({
        extend: theme,
      })({
        layout: props.layout,
      }),
    );

    const Component = computed<Component | 'template'>(() => {
      return {
        bubble: BubbleMenu,
        floating: FloatingMenu,
        fixed: 'template',
      }[props.layout as string] as Component | 'template';
    });

    const menuOptions = computed(() =>
      defu(props.options, {
        offset: 8,
        shift: { padding: 8 },
      }),
    );

    function isArrayOfArray(value: any): value is any[][] {
      return Array.isArray(value) && value.length > 0 && Array.isArray(value[0]);
    }

    const groups = computed<any[][]>(() =>
      props.items?.length ? (isArrayOfArray(props.items) ? props.items : [props.items]) : [],
    );

    // Tooltip state
    const tooltipState = reactive({
      visible: false,
      text: '',
      position: { x: 0, y: 0 },
      placement: 'top' as 'top' | 'bottom' | 'left' | 'right',
    });

    let tooltipHideTimer: ReturnType<typeof setTimeout> | null = null;

    function showTooltip(
      event: MouseEvent,
      text: string,
      placement?: string,
      item?: EditorToolbarItem,
    ) {
      if (!text) return;
      if (item && isDisabled(item)) return;
      if (tooltipHideTimer) {
        clearTimeout(tooltipHideTimer);
        tooltipHideTimer = null;
      }

      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      tooltipState.text = text;
      tooltipState.placement = (placement || 'bottom') as typeof tooltipState.placement;
      tooltipState.visible = true;

      // Tooltip 使用 fixed 定位，直接使用视口坐标（getBoundingClientRect），无需加 scroll
      switch (tooltipState.placement) {
        case 'top':
          tooltipState.position.x = rect.left + rect.width / 2;
          tooltipState.position.y = rect.top - 8;
          break;
        case 'bottom':
          tooltipState.position.x = rect.left + rect.width / 2;
          tooltipState.position.y = rect.bottom + 6;
          break;
        case 'left':
          tooltipState.position.x = rect.left - 6;
          tooltipState.position.y = rect.top + rect.height / 2;
          break;
        case 'right':
          tooltipState.position.x = rect.right + 6;
          tooltipState.position.y = rect.top + rect.height / 2;
          break;
      }
    }

    function hideTooltip() {
      tooltipHideTimer = setTimeout(() => {
        tooltipState.visible = false;
      }, 100);
    }

    function cancelHideTooltip() {
      if (tooltipHideTimer) {
        clearTimeout(tooltipHideTimer);
        tooltipHideTimer = null;
      }
    }

    function isActive(item: EditorToolbarItem): boolean {
      if (!props.editor?.isEditable) {
        return false;
      }

      if ('items' in item && Array.isArray(item.items) && item.items.length) {
        return item.items.some((child): boolean => isActive(child as EditorToolbarItem)) || false;
      }

      if ('type' in item) {
        return false;
      }

      if (!('kind' in item)) {
        return (item as EditorToolbarButtonItem).active ?? false;
      }

      const handler = handlers?.value?.[(item as EditorToolbarButtonItem & EditorItem).kind];
      return handler?.isActive(props.editor, item as any) || false;
    }

    function isDisabled(item: EditorToolbarItem): boolean {
      if (!props.editor?.isEditable) {
        return true;
      }

      if ('items' in item && Array.isArray(item.items) && item.items.length) {
        const flatItems = isArrayOfArray(item.items) ? item.items.flat() : item.items;
        const actionableItems = flatItems.filter(
          (child: any) => child.type !== 'separator' && child.type !== 'label',
        );

        if (actionableItems.length === 0) {
          return true;
        }

        return actionableItems.every((child: any) => isDisabled(child));
      }

      if ('type' in item) {
        return false;
      }

      if (!('kind' in item)) {
        return (item as EditorToolbarButtonItem).disabled ?? false;
      }

      const handler = handlers?.value?.[(item as EditorToolbarButtonItem & EditorItem).kind];
      if (!handler) {
        return false;
      }

      if (handler.isDisabled?.(props.editor, item)) {
        return true;
      }

      return !handler.canExecute(props.editor, item);
    }

    function onClick(e: MouseEvent, item: EditorToolbarItem) {
      const rawItem = item as any;
      const kind = rawItem?.kind;

      if (!props.editor || !props.editor.isEditable || isDisabled(item)) {
        return;
      }

      if ('items' in item || !('kind' in item) || 'type' in item) {
        if ('onClick' in item) {
          const onClicks = (item as EditorToolbarButtonItem).onClick;
          for (const cb of Array.isArray(onClicks) ? onClicks : [onClicks]) {
            cb?.(e);
          }
        }
        return;
      }

      const handler = handlers?.value?.[kind];

      if (!handler) {
        return;
      }

      try {
        const result = handler.execute(props.editor, item);
        if (result && typeof result.run === 'function') {
          result.run();
        }
      } catch {
        // handler execution failed silently
      }
    }

    function getButtonProps(item: EditorToolbarItem) {
      const baseProps: Record<string, any> = {};
      const excludedKeys = [
        'kind',
        'mark',
        'align',
        'level',
        'href',
        'src',
        'pos',
        'items',
        'slot',
        'checkedIcon',
        'loadingIcon',
        'externalIcon',
        'content',
        'arrow',
        'portal',
        'modal',
        'tooltip',
        'trailingIcon',
        'onClick',
        'type',
        'class',
      ];

      for (const [key, value] of Object.entries(item as any)) {
        if (!excludedKeys.includes(key)) {
          baseProps[key] = value;
        }
      }

      // ui-4 行为：dropdown trigger 始终显示自身配置的 icon/label，
      // 不随 active child 改变；active 状态通过 button-active 类体现。

      return defu(baseProps, {
        color: props.color,
        activeColor: props.activeColor,
        activeVariant: props.activeVariant,
        variant: props.variant,
        size: props.size,
      });
    }

    function mapDropdownChildItem(item: EditorToolbarChildItem): Record<string, any> {
      const result: Record<string, any> = { ...item };

      if ('items' in item && Array.isArray((item as any).items) && (item as any).items.length) {
        const nestedItems = (item as any).items;
        result.items = isArrayOfArray(nestedItems)
          ? nestedItems.map((group: any[]) => group.map(mapDropdownChildItem))
          : nestedItems.map(mapDropdownChildItem);
      }

      if (!('kind' in item) || 'type' in item) {
        return result;
      }

      result.active = isActive(item);
      result.disabled = isDisabled(item);
      result.onSelect = (e: Event) => onClick(e as MouseEvent, item);

      return result;
    }

    function getDropdownItems(item: EditorToolbarDropdownItem) {
      if (!item.items) {
        return [];
      }

      return isArrayOfArray(item.items)
        ? item.items.map(group => group.map(mapDropdownChildItem))
        : [item.items.map(mapDropdownChildItem)];
    }

    const dropdownOpen = ref<string | null>(null);
    const dropdownTriggerRefs = new Map<string, HTMLElement>();
    const dropdownPanelRefs = new Map<string, HTMLElement>();

    function toggleDropdown(key: string) {
      dropdownOpen.value = dropdownOpen.value === key ? null : key;
    }

    function closeDropdown() {
      dropdownOpen.value = null;
    }

    function handleClickOutside(e: MouseEvent) {
      if (dropdownOpen.value === null) return;

      const trigger = dropdownTriggerRefs.get(dropdownOpen.value);
      const panel = dropdownPanelRefs.get(dropdownOpen.value);

      if (
        trigger &&
        !trigger.contains(e.target as Node) &&
        (!panel || !panel.contains(e.target as Node))
      ) {
        closeDropdown();
      }
    }

    onMounted(() => {
      if (!isClient) return;
      document.addEventListener('mousedown', handleClickOutside);
    });

    onBeforeUnmount(() => {
      if (isClient) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      if (tooltipHideTimer) {
        clearTimeout(tooltipHideTimer);
        tooltipHideTimer = null;
      }
      dropdownTriggerRefs.clear();
      dropdownPanelRefs.clear();
    });

    function getTooltipText(item: EditorToolbarItem): string | undefined {
      if ('tooltip' in item && item.tooltip) {
        return typeof item.tooltip === 'string' ? item.tooltip : item.tooltip.text;
      }
      return undefined;
    }

    function getItemClass(item: EditorToolbarItem): string {
      const baseClass = 'xy-rich-text-editor-toolbar-button';
      const itemClass =
        'class' in item && typeof (item as any).class === 'string' ? (item as any).class : '';
      const activeClass = isActive(item) ? 'xy-rich-text-editor-toolbar-button-active' : '';
      const disabledClass = isDisabled(item) ? 'xy-rich-text-editor-toolbar-button-disabled' : '';

      // 添加 hashId，确保 CSS-in-JS 生成的 :where(.hashId).class 选择器能命中
      return [hashId.value, baseClass, itemClass, activeClass, disabledClass]
        .filter(Boolean)
        .join(' ')
        .trim();
    }

    function getDropdownStyle(key: string): Record<string, string> {
      if (!isClient) return {};
      const trigger = dropdownTriggerRefs.get(key);
      if (!trigger) return {};

      const rect = trigger.getBoundingClientRect();
      return {
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
      };
    }

    function getDropdownItemClass(childItem: any): string {
      const baseClass = 'xy-rich-text-editor-toolbar-dropdown-item';
      const activeClass = childItem.active
        ? 'xy-rich-text-editor-toolbar-dropdown-item-active'
        : '';
      const disabledClass = childItem.disabled
        ? 'xy-rich-text-editor-toolbar-dropdown-item-disabled'
        : '';
      const itemClass = typeof childItem.class === 'string' ? childItem.class : '';

      // 添加 hashId，确保 CSS-in-JS 生成的 :where(.hashId).class 选择器能命中
      return [hashId.value, baseClass, itemClass, activeClass, disabledClass]
        .filter(Boolean)
        .join(' ')
        .trim();
    }

    function renderIcon(icon: any) {
      if (!icon) return null;
      if (typeof icon === 'object' || typeof icon === 'function') {
        const IconComp = icon as any;
        return <IconComp size={16} />;
      }
      return <span innerHTML={icon} />;
    }

    function renderItem(
      item: EditorToolbarItem,
      index: number,
      groupIndex: number,
      prefix: string,
    ) {
      const key = `${prefix}-${groupIndex}-${index}`;
      const slotName = ((item as EditorToolbarButtonItem).slot || 'item') as string;
      const slotFn = slots[slotName];

      if (slotFn) {
        return slotFn({ item, index, isActive, isDisabled, onClick });
      }

      if ('type' in item && item.type === 'separator') {
        return (
          <div
            key={key}
            class={['xy-rich-text-editor-toolbar-separator', hashId.value]
              .filter(Boolean)
              .join(' ')}
            data-slot="separator"
            role="separator"
          />
        );
      }

      if ('type' in item && item.type === 'label') {
        return (
          <div
            key={key}
            class={['xy-rich-text-editor-toolbar-label', hashId.value].filter(Boolean).join(' ')}
            data-slot="label"
          >
            {(item as EditorToolbarLabelItem).label}
          </div>
        );
      }

      const buttonProps = getButtonProps(item);
      const tooltipText = getTooltipText(item);
      const itemTooltip = (item as EditorToolbarButtonItem).tooltip;
      const tooltipPlacement = typeof itemTooltip === 'object' ? itemTooltip?.position : undefined;

      if ('items' in item && Array.isArray(item.items) && item.items.length) {
        const dropdownItems = getDropdownItems(item as EditorToolbarDropdownItem);
        return (
          <div key={key} class="xy-rich-text-editor-toolbar-dropdown" data-slot="dropdown">
            <button
              ref={(el: any) => {
                if (el) dropdownTriggerRefs.set(key, el as HTMLElement);
              }}
              type="button"
              class={getItemClass(item)}
              disabled={isDisabled(item)}
              title={tooltipText}
              aria-label={
                (item as EditorToolbarButtonItem).ariaLabel ||
                (item as EditorToolbarButtonItem).label
              }
              aria-expanded={dropdownOpen.value === key}
              aria-haspopup="menu"
              data-state={dropdownOpen.value === key ? 'open' : 'closed'}
              onClick={(e: Event) => {
                e.stopPropagation();
                toggleDropdown(key);
                onClick(e as MouseEvent, item);
              }}
              onMouseenter={(e: MouseEvent) =>
                showTooltip(e, tooltipText || '', tooltipPlacement, item)
              }
              onMouseleave={hideTooltip}
            >
              {buttonProps.icon && (
                <span class="xy-rich-text-editor-toolbar-icon">{renderIcon(buttonProps.icon)}</span>
              )}
              {buttonProps.label && <span>{buttonProps.label}</span>}
              {(item as any).trailingIcon && (
                <span class="xy-rich-text-editor-toolbar-icon xy-rich-text-editor-toolbar-button-trailing">
                  {renderIcon((item as any).trailingIcon)}
                </span>
              )}
            </button>
            <Transition name="xy-dropdown">
              {dropdownOpen.value === key && (
                <div
                  ref={(el: any) => {
                    if (el) dropdownPanelRefs.set(key, el as HTMLElement);
                  }}
                  class={['xy-rich-text-editor-toolbar-dropdown-panel', hashId.value]
                    .filter(Boolean)
                    .join(' ')}
                  style={getDropdownStyle(key)}
                  data-slot="dropdown-panel"
                  role="menu"
                  onKeydown={(e: KeyboardEvent) => {
                    if (e.key === 'Escape' && dropdownOpen.value === key) {
                      e.preventDefault();
                      closeDropdown();
                      const trigger = dropdownTriggerRefs.get(key);
                      if (trigger) trigger.focus();
                    }
                  }}
                >
                  {dropdownItems.map((dropdownGroup: any[], dgIndex: number) => [
                    <div
                      key={`dg-${dgIndex}`}
                      class={['xy-rich-text-editor-toolbar-dropdown-group', hashId.value]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {dropdownGroup.map((childItem: any, childIndex: number) => {
                        if ('type' in childItem && childItem.type === 'separator') {
                          return (
                            <div
                              key={`dgs-${dgIndex}-${childIndex}`}
                              class={[
                                'xy-rich-text-editor-toolbar-dropdown-separator',
                                hashId.value,
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              role="separator"
                            />
                          );
                        }
                        if ('type' in childItem && childItem.type === 'label') {
                          return (
                            <div
                              key={`dgl-${dgIndex}-${childIndex}`}
                              class={['xy-rich-text-editor-toolbar-dropdown-label', hashId.value]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {childItem.label}
                            </div>
                          );
                        }
                        return (
                          <button
                            key={`dgi-${dgIndex}-${childIndex}`}
                            type="button"
                            role="menuitem"
                            class={getDropdownItemClass(childItem)}
                            disabled={childItem.disabled}
                            title={
                              typeof childItem.tooltip === 'string'
                                ? childItem.tooltip
                                : childItem.tooltip?.text
                            }
                            onClick={(e: Event) => {
                              childItem.onSelect?.(e);
                              closeDropdown();
                            }}
                          >
                            {childItem.icon && (
                              <span class="xy-rich-text-editor-toolbar-icon">
                                {renderIcon(childItem.icon)}
                              </span>
                            )}
                            <span>{childItem.label}</span>
                          </button>
                        );
                      })}
                    </div>,
                    dgIndex < dropdownItems.length - 1 && (
                      <div
                        key={`dgs-end-${dgIndex}`}
                        class={[
                          'xy-rich-text-editor-toolbar-dropdown-group-separator',
                          hashId.value,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      />
                    ),
                  ])}
                </div>
              )}
            </Transition>
          </div>
        );
      }

      return (
        <button
          key={key}
          type="button"
          class={getItemClass(item)}
          disabled={isDisabled(item)}
          title={tooltipText}
          aria-label={
            (item as EditorToolbarButtonItem).ariaLabel || (item as EditorToolbarButtonItem).label
          }
          aria-pressed={isActive(item)}
          onClick={(e: MouseEvent) => onClick(e, item)}
          onMouseenter={(e: MouseEvent) =>
            showTooltip(e, tooltipText || '', tooltipPlacement, item)
          }
          onMouseleave={hideTooltip}
        >
          {buttonProps.icon && (
            <span class="xy-rich-text-editor-toolbar-icon">{renderIcon(buttonProps.icon)}</span>
          )}
          {buttonProps.label && <span>{buttonProps.label}</span>}
          {(item as any).trailingIcon && (
            <span class="xy-rich-text-editor-toolbar-icon xy-rich-text-editor-toolbar-button-trailing">
              {renderIcon((item as any).trailingIcon)}
            </span>
          )}
        </button>
      );
    }

    function renderContent(prefix: string) {
      return groups.value.map((group, groupIndex) => [
        <div
          key={`${prefix}-group-${groupIndex}`}
          role="group"
          class={ui.value.group({ class: hashId.value })}
          data-slot="group"
        >
          {group.map((item: any, index: number) => renderItem(item, index, groupIndex, prefix))}
        </div>,
        groupIndex < groups.value.length - 1 && (
          <div
            key={`${prefix}-group-sep-${groupIndex}`}
            role="separator"
            data-slot="separator"
            class={ui.value.separator({ class: hashId.value })}
          />
        ),
      ]);
    }

    function renderTooltip() {
      return (
        <Teleport to="body">
          <Transition name="tooltip">
            {tooltipState.visible && (
              <div
                class={[
                  hashId.value,
                  'xy-rich-text-editor-toolbar-tooltip',
                  `xy-rich-text-editor-toolbar-tooltip-${tooltipState.placement}`,
                ]}
                style={{
                  left: `${tooltipState.position.x}px`,
                  top: `${tooltipState.position.y}px`,
                }}
                role="tooltip"
                onMouseenter={cancelHideTooltip}
                onMouseleave={hideTooltip}
              >
                {tooltipState.text}
                <span class="xy-rich-text-editor-toolbar-tooltip-arrow" />
              </div>
            )}
          </Transition>
        </Teleport>
      );
    }

    return () => {
      const As = props.as as any;

      if (Component.value !== 'template') {
        const MenuComp = Component.value as any;

        return [
          <MenuComp
            editor={props.editor}
            shouldShow={props.shouldShow}
            tabindex="-1"
            class={ui.value.root({ class: hashId.value })}
            data-layout={props.layout}
            data-slot="root"
            {...menuOptions.value}
            {...attrs}
          >
            <As
              role="toolbar"
              class={ui.value.base({ class: [hashId.value, attrs.class] })}
              data-slot="base"
            >
              {renderContent('group')}
            </As>
          </MenuComp>,
          renderTooltip(),
        ];
      }

      return [
        <As
          role="toolbar"
          class={ui.value.root({ class: [hashId.value, attrs.class] })}
          data-layout={props.layout}
          data-slot="root"
          {...attrs}
        >
          {renderContent('fixed-group')}
        </As>,
        renderTooltip(),
      ];
    };
  },
});
