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
import { createHandlers } from './utils/editor';
import type { Editor } from '@tiptap/vue-3';
import type { EditorItem } from './types/editor';
import { initDefaultProps } from '../_util/props-util';
import { anyType, stringType } from '../_util/type';

// SSR 安全：仅浏览器端可访问 document/window
const isClient = typeof window !== 'undefined' && !!window.document;

export interface EditorToolbarButtonItem {
  label?: string;
  icon?: string;
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
    const handlers = inject(
      'editorHandlers',
      computed(() => createHandlers()),
    );

    const MenuComponent = computed<Component | 'template'>(() => {
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

    function showTooltip(event: MouseEvent, text: string, placement?: string) {
      if (!text) return;
      if (tooltipHideTimer) {
        clearTimeout(tooltipHideTimer);
        tooltipHideTimer = null;
      }

      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      tooltipState.text = text;
      tooltipState.placement = (placement || 'bottom') as typeof tooltipState.placement;
      tooltipState.visible = true;

      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      switch (tooltipState.placement) {
        case 'top':
          tooltipState.position.x = rect.left + rect.width / 2 + scrollX;
          tooltipState.position.y = rect.top + scrollY - 8;
          break;
        case 'bottom':
          tooltipState.position.x = rect.left + rect.width / 2 + scrollX;
          tooltipState.position.y = rect.bottom + scrollY + 6;
          break;
        case 'left':
          tooltipState.position.x = rect.left + scrollX - 6;
          tooltipState.position.y = rect.top + rect.height / 2 + scrollY;
          break;
        case 'right':
          tooltipState.position.x = rect.right + scrollX + 6;
          tooltipState.position.y = rect.top + rect.height / 2 + scrollY;
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

    function getActiveChildItem(
      item: EditorToolbarDropdownItem,
    ): EditorToolbarChildItem | undefined {
      if (!item.items) {
        return undefined;
      }

      const flatItems = isArrayOfArray(item.items) ? item.items.flat() : item.items;

      return flatItems.find((child): child is EditorToolbarChildItem => {
        if (!('kind' in child) || 'type' in child) {
          return false;
        }
        return isActive(child);
      });
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
        'onClick',
        'type',
        'class',
      ];

      for (const [key, value] of Object.entries(item as any)) {
        if (!excludedKeys.includes(key)) {
          baseProps[key] = value;
        }
      }

      if ('items' in item && Array.isArray(item.items) && item.items.length) {
        const activeChild = getActiveChildItem(item);
        if (activeChild && 'icon' in activeChild && activeChild.icon) {
          baseProps.icon = activeChild.icon;
        }
        if (
          activeChild &&
          'label' in activeChild &&
          activeChild.label &&
          baseProps.label !== undefined
        ) {
          baseProps.label = activeChild.label;
        }
      }

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
      // 修复 bug：清理 tooltip 隐藏定时器，避免组件卸载后定时器仍然执行
      if (tooltipHideTimer) {
        clearTimeout(tooltipHideTimer);
        tooltipHideTimer = null;
      }
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

      return [baseClass, itemClass, activeClass, disabledClass].filter(Boolean).join(' ').trim();
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

      return [baseClass, itemClass, activeClass, disabledClass].filter(Boolean).join(' ').trim();
    }

    function renderIcon(icon: any) {
      if (!icon) return null;
      if (typeof icon === 'object' || typeof icon === 'function') {
        const IconComp = icon as any;
        return <IconComp size={16} />;
      }
      return <span innerHTML={icon} />;
    }

    const dropdownArrowSvg = (
      <svg
        class="xy-rich-text-editor-toolbar-dropdown-arrow"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );

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
            class="xy-rich-text-editor-toolbar-separator"
            data-slot="separator"
            role="separator"
          />
        );
      }

      if ('type' in item && item.type === 'label') {
        return (
          <div key={key} class="xy-rich-text-editor-toolbar-label" data-slot="label">
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
              aria-haspopup={true}
              onClick={(e: Event) => {
                e.stopPropagation();
                toggleDropdown(key);
              }}
              onMouseenter={(e: MouseEvent) => showTooltip(e, tooltipText || '', tooltipPlacement)}
              onMouseleave={hideTooltip}
            >
              {buttonProps.icon && (
                <span class="xy-rich-text-editor-toolbar-icon">{renderIcon(buttonProps.icon)}</span>
              )}
              {buttonProps.label && <span>{buttonProps.label}</span>}
              {dropdownArrowSvg}
            </button>
            <Transition name="xy-dropdown">
              {dropdownOpen.value === key && (
                <div
                  ref={(el: any) => {
                    if (el) dropdownPanelRefs.set(key, el as HTMLElement);
                  }}
                  class="xy-rich-text-editor-toolbar-dropdown-panel"
                  data-slot="dropdown-panel"
                >
                  {dropdownItems.map((dropdownGroup: any[], dgIndex: number) => [
                    <div key={`dg-${dgIndex}`} class="xy-rich-text-editor-toolbar-dropdown-group">
                      {dropdownGroup.map((childItem: any, childIndex: number) => {
                        if ('type' in childItem && childItem.type === 'separator') {
                          return (
                            <div
                              key={`dgs-${dgIndex}-${childIndex}`}
                              class="xy-rich-text-editor-toolbar-dropdown-separator"
                              role="separator"
                            />
                          );
                        }
                        if ('type' in childItem && childItem.type === 'label') {
                          return (
                            <div
                              key={`dgl-${dgIndex}-${childIndex}`}
                              class="xy-rich-text-editor-toolbar-dropdown-label"
                            >
                              {childItem.label}
                            </div>
                          );
                        }
                        return (
                          <button
                            key={`dgi-${dgIndex}-${childIndex}`}
                            type="button"
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
                        class="xy-rich-text-editor-toolbar-dropdown-group-separator"
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
          onMouseenter={(e: MouseEvent) => showTooltip(e, tooltipText || '', tooltipPlacement)}
          onMouseleave={hideTooltip}
        >
          {buttonProps.icon && (
            <span class="xy-rich-text-editor-toolbar-icon">{renderIcon(buttonProps.icon)}</span>
          )}
          {buttonProps.label && <span>{buttonProps.label}</span>}
        </button>
      );
    }

    function renderContent(prefix: string) {
      const result: any[] = [];

      groups.value.forEach((group, groupIndex) => {
        result.push(
          <div
            key={`${prefix}-group-${groupIndex}`}
            role="group"
            class="xy-rich-text-editor-toolbar-group"
            data-slot="group"
          >
            {group.map((item: any, index: number) => renderItem(item, index, groupIndex, prefix))}
          </div>,
        );

        if (groupIndex < groups.value.length - 1) {
          result.push(
            <div
              key={`${prefix}-group-sep-${groupIndex}`}
              class="xy-rich-text-editor-toolbar-group-separator"
              data-slot="group-separator"
              role="separator"
            />,
          );
        }
      });

      return result;
    }

    function renderTooltip() {
      return (
        <Teleport to="body">
          <Transition name="tooltip">
            {tooltipState.visible && (
              <div
                class={[
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
      if (MenuComponent.value !== 'template') {
        const MenuComp = MenuComponent.value as any;
        const As = props.as as any;

        return [
          <MenuComp
            editor={props.editor}
            tabindex="-1"
            class="xy-rich-text-editor-toolbar"
            data-layout={props.layout}
            data-slot="root"
            {...menuOptions.value}
            {...attrs}
          >
            <As role="toolbar" class="xy-rich-text-editor-toolbar-base" data-slot="base">
              {renderContent('group')}
            </As>
          </MenuComp>,
          renderTooltip(),
        ];
      }

      const As = props.as as any;

      return [
        <As
          role="toolbar"
          class="xy-rich-text-editor-toolbar"
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
