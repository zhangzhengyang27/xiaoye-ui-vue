/// <reference types="vue/jsx" />
import type { PropType } from 'vue';
import { nestedPosition } from '@xiaoye-ui/utils/dom';
import { isNotEmpty, resolve } from '@xiaoye-ui/utils/object';
import { AngleRightIcon } from '@xiaoye-ui/icons';
import { computed, defineComponent, mergeProps, ref, Transition, useAttrs } from 'vue';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

const ContextMenuSub = defineComponent({
  name: 'XYContextMenuSub',
  inheritAttrs: false,
  __XY_CONTEXT_MENU_SUB: true,
  props: {
    items: { type: Array as PropType<any[]>, default: null },
    menuId: { type: String as PropType<string | null>, default: null },
    focusedItemId: { type: String as PropType<string | null>, default: null },
    root: { type: Boolean, default: false },
    visible: { type: Boolean, default: false },
    level: { type: Number, default: 0 },
    templates: { type: Object as PropType<Record<string, any> | null>, default: null },
    activeItemPath: { type: Array as PropType<any[] | null>, default: null },
    tabindex: { type: [Number, String] as PropType<number | string>, default: 0 },
    id: { type: String as PropType<string | undefined>, default: undefined },
    role: { type: String as PropType<string | undefined>, default: undefined },
    ariaLabelledby: { type: String as PropType<string | undefined>, default: undefined },
    ariaLabel: { type: String as PropType<string | undefined>, default: undefined },
    ariaOrientation: { type: String as PropType<string | undefined>, default: undefined },
    ariaActivedescendant: { type: String as PropType<string | undefined>, default: undefined },
  },
  emits: ['itemClick', 'itemMouseenter', 'itemMousemove', 'focus', 'blur', 'keydown'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('contextmenu', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const attrs = useAttrs();
    const rootClass = computed(() => ['xy-contextmenu-submenu', attrs.class, hashId.value]);

    const container = ref<HTMLElement | null>(null);

    function getItemId(processedItem: any): string {
      return `${props.menuId}_${processedItem.key}`;
    }

    function getItemKey(processedItem: any): string {
      return getItemId(processedItem);
    }

    function getItemProp(processedItem: any, name: string, params?: any): any {
      return processedItem && processedItem.item
        ? resolve(processedItem.item[name], params)
        : undefined;
    }

    function getItemLabel(processedItem: any): string | undefined {
      return getItemProp(processedItem, 'label');
    }

    function getItemLabelId(processedItem: any): string {
      return `${props.menuId}_${processedItem.key}_label`;
    }

    function isItemActive(processedItem: any): boolean {
      return !!props.activeItemPath?.some((path: any) => path.key === processedItem.key);
    }

    function isItemVisible(processedItem: any): boolean {
      return getItemProp(processedItem, 'visible') !== false;
    }

    function isItemDisabled(processedItem: any): boolean {
      return getItemProp(processedItem, 'disabled');
    }

    function isItemFocused(processedItem: any): boolean {
      return props.focusedItemId === getItemId(processedItem);
    }

    function isItemGroup(processedItem: any): boolean {
      return isNotEmpty(processedItem.items);
    }

    function onItemClick(event: Event, processedItem: any) {
      getItemProp(processedItem, 'command', { originalEvent: event, item: processedItem.item });
      emit('itemClick', { originalEvent: event as MouseEvent, processedItem, isFocus: true });
    }

    function onItemMouseEnter(event: MouseEvent, processedItem: any) {
      emit('itemMouseenter', { originalEvent: event, processedItem });
    }

    function onItemMouseMove(event: MouseEvent, processedItem: any) {
      emit('itemMousemove', { originalEvent: event, processedItem, isFocus: true });
    }

    function getAriaSetSize(): number {
      return (
        props.items?.filter(
          (processedItem: any) =>
            isItemVisible(processedItem) && !getItemProp(processedItem, 'separator'),
        ).length || 0
      );
    }

    function getAriaPosInset(index: number): number {
      return (
        index -
        (props.items
          ?.slice(0, index)
          .filter(
            (processedItem: any) =>
              isItemVisible(processedItem) && getItemProp(processedItem, 'separator'),
          ).length || 0) +
        1
      );
    }

    function onEnter() {
      if (!isClient || !container.value) return;
      nestedPosition(container.value, props.level);
    }

    function getMenuItemProps(processedItem: any, _index: number) {
      return {
        action: mergeProps({ class: 'xy-contextmenu-item-link', tabindex: -1 }, {}),
        icon: mergeProps(
          { class: ['xy-contextmenu-item-icon', getItemProp(processedItem, 'icon')] },
          {},
        ),
        label: mergeProps({ class: 'xy-contextmenu-item-label' }, {}),
        submenuicon: mergeProps({ class: 'xy-contextmenu-submenu-icon' }, {}),
      };
    }

    expose({
      items: props.items,
      menuId: props.menuId,
      focusedItemId: props.focusedItemId,
      root: props.root,
      visible: props.visible,
      level: props.level,
      templates: props.templates,
      activeItemPath: props.activeItemPath,
      tabindex: props.tabindex,
      container,
      getItemId,
      getItemKey,
      getItemProp,
      getItemLabel,
      getItemLabelId,
      isItemActive,
      isItemVisible,
      isItemDisabled,
      isItemFocused,
      isItemGroup,
      onItemClick,
      onItemMouseEnter,
      onItemMouseMove,
      getAriaSetSize,
      getAriaPosInset,
      onEnter,
      getMenuItemProps,
    });

    return () => {
      const showContent = props.root ? true : props.visible;

      if (!showContent) return null;

      return wrapSSR(
        <Transition name="xy-anchored-overlay" onEnter={onEnter}>
          <ul ref={container} tabindex={props.tabindex as any} class={rootClass.value}>
            {props.items?.map((processedItem, index) => {
              if (!isItemVisible(processedItem)) return null;

              if (getItemProp(processedItem, 'separator')) {
                return (
                  <li
                    key={getItemKey(processedItem)}
                    id={getItemId(processedItem)}
                    style={getItemProp(processedItem, 'style')}
                    class={['xy-contextmenu-separator', getItemProp(processedItem, 'class')]}
                    role="separator"
                  />
                );
              }

              const itemClasses = [
                'xy-contextmenu-item',
                {
                  'xy-contextmenu-item-active': isItemActive(processedItem),
                  'xy-contextmenu-item-focused': isItemFocused(processedItem),
                  'xy-contextmenu-item-disabled': isItemDisabled(processedItem),
                },
                getItemProp(processedItem, 'class'),
              ];

              return (
                <li
                  key={getItemKey(processedItem)}
                  id={getItemId(processedItem)}
                  style={getItemProp(processedItem, 'style')}
                  class={itemClasses}
                  role="menuitem"
                  aria-label={getItemLabel(processedItem)}
                  aria-disabled={isItemDisabled(processedItem) || undefined}
                  aria-expanded={
                    isItemGroup(processedItem) ? isItemActive(processedItem) : undefined
                  }
                  aria-haspopup={
                    isItemGroup(processedItem) && !getItemProp(processedItem, 'to')
                      ? 'menu'
                      : undefined
                  }
                  aria-level={props.level + 1}
                  aria-setsize={getAriaSetSize()}
                  aria-posinset={getAriaPosInset(index)}
                  data-xy-active={isItemActive(processedItem)}
                  data-xy-focused={isItemFocused(processedItem)}
                  data-xy-disabled={isItemDisabled(processedItem)}
                >
                  <div
                    class="xy-contextmenu-item-content"
                    onClick={(e: Event) => onItemClick(e, processedItem)}
                    onMouseenter={(e: MouseEvent) => onItemMouseEnter(e, processedItem)}
                    onMousemove={(e: MouseEvent) => onItemMouseMove(e, processedItem)}
                  >
                    {!props.templates?.item ? (
                      <a
                        href={getItemProp(processedItem, 'url')}
                        class="xy-contextmenu-item-link"
                        target={getItemProp(processedItem, 'target')}
                        tabindex="-1"
                      >
                        {props.templates?.itemicon ? (
                          <props.templates.itemicon
                            item={processedItem.item}
                            class="xy-contextmenu-item-icon"
                          />
                        ) : getItemProp(processedItem, 'icon') ? (
                          <span
                            class={['xy-contextmenu-item-icon', getItemProp(processedItem, 'icon')]}
                          />
                        ) : null}
                        <span id={getItemLabelId(processedItem)} class="xy-contextmenu-item-label">
                          {getItemLabel(processedItem)}
                        </span>
                        {getItemProp(processedItem, 'items') ? (
                          props.templates?.submenuicon ? (
                            <props.templates.submenuicon
                              active={isItemActive(processedItem)}
                              class="xy-contextmenu-submenu-icon"
                            />
                          ) : (
                            <AngleRightIcon class="xy-contextmenu-submenu-icon" />
                          )
                        ) : null}
                      </a>
                    ) : (
                      <props.templates.item
                        item={processedItem.item}
                        hasSubmenu={!!getItemProp(processedItem, 'items')}
                        label={getItemLabel(processedItem)}
                        props={getMenuItemProps(processedItem, index)}
                      />
                    )}
                  </div>
                  {isItemVisible(processedItem) && isItemGroup(processedItem) ? (
                    <ContextMenuSub
                      id={getItemId(processedItem) + '_list'}
                      role="menu"
                      class="xy-contextmenu-submenu"
                      menuId={props.menuId}
                      focusedItemId={props.focusedItemId}
                      items={processedItem.items}
                      templates={props.templates}
                      activeItemPath={props.activeItemPath}
                      level={props.level + 1}
                      visible={isItemActive(processedItem) && isItemGroup(processedItem)}
                      onItemClick={(e: any) => emit('itemClick', e)}
                      onItemMouseenter={(e: any) => emit('itemMouseenter', e)}
                      onItemMousemove={(e: any) => emit('itemMousemove', e)}
                      ariaLabelledby={getItemLabelId(processedItem)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Transition>,
      );
    };
  },
});

export default ContextMenuSub;
