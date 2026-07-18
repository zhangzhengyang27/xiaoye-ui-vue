import type { VNode } from 'vue';
import { isNotEmpty, resolve } from '@xiaoye-ui/utils/object';
import { DownOutlined, RightOutlined } from '@xiaoye-ui/icons';
import Ripple from '../ripple';
import { computed, defineComponent, mergeProps, useAttrs, Transition } from 'vue';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { panelMenuSubProps } from './panelMenuTypes';

// 递归渲染子菜单：保持源项目 BEM 类名扁平化（xy-panel-menu-*）风格
const PanelMenuSub = defineComponent({
  name: 'XYPanelMenuSub',
  directives: { ripple: Ripple },
  inheritAttrs: false,
  props: panelMenuSubProps(),
  emits: {
    'item-toggle': (payload: any) => !!payload,
    'item-click': (payload: any) => !!payload,
    'item-mousemove': (payload: any) => !!payload,
  },
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('panel-menu', props);
    const [, hashId] = useStyle(prefixCls);
    const attrs = useAttrs();
    const rootClass = computed(() => ['xy-panel-menu-submenu', attrs.class, hashId.value]);

    // 生成子项唯一 id（与父级 panelId 拼接）
    function getItemId(processedItem: any) {
      return `${props.panelId}_${processedItem.key}`;
    }

    function getItemProp(processedItem: any, name: string, params?: any) {
      return processedItem && processedItem.item
        ? resolve(processedItem.item[name], params)
        : undefined;
    }

    function getItemLabel(processedItem: any) {
      return getItemProp(processedItem, 'label');
    }

    function isItemActive(processedItem: any) {
      return !!props.activeItemPath?.some((path: any) => path.key === processedItem.key);
    }

    function isItemVisible(processedItem: any) {
      return getItemProp(processedItem, 'visible') !== false;
    }

    function isItemDisabled(processedItem: any) {
      return getItemProp(processedItem, 'disabled');
    }

    function isItemFocused(processedItem: any) {
      return props.focusedItemId === getItemId(processedItem);
    }

    function isItemGroup(processedItem: any) {
      return isNotEmpty(processedItem.items);
    }

    function onItemClick(event: Event, processedItem: any) {
      const command = getItemProp(processedItem, 'command');
      if (typeof command === 'function') {
        command({ originalEvent: event, item: processedItem.item });
      }
      emit('item-click', { originalEvent: event, item: processedItem.item });
      emit('item-toggle', { processedItem, expanded: !isItemActive(processedItem) });
    }

    function onItemToggle(event: any) {
      emit('item-toggle', event);
    }

    function onItemClickBubble(event: any) {
      emit('item-click', event);
    }

    function onItemMouseMove(event: MouseEvent, processedItem: any) {
      emit('item-mousemove', { originalEvent: event, processedItem });
    }

    function getAriaSetSize() {
      return (
        props.items?.filter(
          (processedItem: any) =>
            isItemVisible(processedItem) && !getItemProp(processedItem, 'separator'),
        ).length ?? 0
      );
    }

    function getAriaPosInset(index: number) {
      return (
        index -
        (props.items
          ?.slice(0, index)
          .filter(
            (processedItem: any) =>
              isItemVisible(processedItem) && getItemProp(processedItem, 'separator'),
          ).length ?? 0) +
        1
      );
    }

    function getMenuItemProps(processedItem: any, _index: number) {
      return {
        action: mergeProps({ class: 'xy-panel-menu-item-link', tabindex: -1 }, {}),
        icon: mergeProps(
          { class: ['xy-panel-menu-item-icon', getItemProp(processedItem, 'icon')] },
          {},
        ),
        label: mergeProps({ class: 'xy-panel-menu-item-label' }, {}),
        submenuicon: mergeProps({ class: 'xy-panel-menu-submenu-icon' }, {}),
      };
    }

    expose({
      getItemId,
      getItemProp,
      getItemLabel,
      isItemActive,
      isItemVisible,
      isItemDisabled,
      isItemFocused,
      isItemGroup,
      onItemClick,
      onItemToggle,
      onItemMouseMove,
      getAriaSetSize,
      getAriaPosInset,
      getMenuItemProps,
    });

    return () => {
      const itemVNodes: VNode[] = [];

      props.items?.forEach((processedItem: any, index: number) => {
        if (isItemVisible(processedItem) && !getItemProp(processedItem, 'separator')) {
          const itemClass = [
            'xy-panel-menu-item',
            {
              'xy-panel-menu-item-focused': isItemFocused(processedItem),
              'xy-panel-menu-item-disabled': isItemDisabled(processedItem),
            },
            getItemProp(processedItem, 'class'),
          ];

          let contentVNode: VNode | VNode[];
          if (!props.templates?.item) {
            // 子菜单展开/折叠图标：展开用 DownOutlined，折叠用 RightOutlined
            const groupIconVNode = isItemGroup(processedItem) ? (
              props.templates?.submenuicon ? (
                <props.templates.submenuicon
                  class="xy-panel-menu-submenu-icon"
                  active={isItemActive(processedItem)}
                />
              ) : isItemActive(processedItem) ? (
                <DownOutlined class="xy-panel-menu-submenu-icon" />
              ) : (
                <RightOutlined class="xy-panel-menu-submenu-icon" />
              )
            ) : null;

            const itemIconVNode = props.templates?.itemicon ? (
              <props.templates.itemicon item={processedItem.item} class="xy-panel-menu-item-icon" />
            ) : getItemProp(processedItem, 'icon') ? (
              <span class={['xy-panel-menu-item-icon', getItemProp(processedItem, 'icon')]} />
            ) : null;

            contentVNode = (
              <a
                v-ripple
                href={getItemProp(processedItem, 'url')}
                class="xy-panel-menu-item-link"
                target={getItemProp(processedItem, 'target')}
                tabindex="-1"
              >
                {groupIconVNode}
                {itemIconVNode}
                <span class="xy-panel-menu-item-label">{getItemLabel(processedItem)}</span>
              </a>
            );
          } else {
            contentVNode = (
              <props.templates.item
                item={processedItem.item}
                root={false}
                active={isItemActive(processedItem)}
                hasSubmenu={isItemGroup(processedItem)}
                label={getItemLabel(processedItem)}
                props={getMenuItemProps(processedItem, index)}
              />
            );
          }

          const childVNode =
            isItemVisible(processedItem) && isItemGroup(processedItem) ? (
              <Transition name="xy-collapsible">
                <div
                  class="xy-panel-menu-content-container"
                  style={{ display: isItemActive(processedItem) ? 'block' : 'none' }}
                >
                  <div class="xy-panel-menu-content-wrapper">
                    <PanelMenuSub
                      {...({
                        id: getItemId(processedItem) + '_list',
                        role: 'group',
                      } as any)}
                      panelId={props.panelId}
                      focusedItemId={props.focusedItemId}
                      items={processedItem.items}
                      level={props.level + 1}
                      templates={props.templates}
                      activeItemPath={props.activeItemPath}
                      expandedKeys={props.expandedKeys}
                      onItemToggle={onItemToggle}
                      onItemClick={onItemClickBubble}
                      onItemMousemove={(e: any) => emit('item-mousemove', e)}
                    />
                  </div>
                </div>
              </Transition>
            ) : null;

          itemVNodes.push(
            <li
              id={getItemId(processedItem)}
              class={itemClass}
              style={getItemProp(processedItem, 'style')}
              role="treeitem"
              aria-label={getItemLabel(processedItem)}
              aria-expanded={isItemGroup(processedItem) ? isItemActive(processedItem) : undefined}
              aria-level={props.level + 1}
              aria-setsize={getAriaSetSize()}
              aria-posinset={getAriaPosInset(index)}
              data-xy-focused={isItemFocused(processedItem)}
              data-xy-disabled={isItemDisabled(processedItem)}
            >
              <div
                class="xy-panel-menu-item-content"
                onClick={(e: Event) => onItemClick(e, processedItem)}
                onMousemove={(e: MouseEvent) => onItemMouseMove(e, processedItem)}
              >
                {contentVNode}
              </div>
              {childVNode}
            </li>,
          );
        } else if (isItemVisible(processedItem) && getItemProp(processedItem, 'separator')) {
          itemVNodes.push(
            <li
              style={getItemProp(processedItem, 'style')}
              class={['xy-panel-menu-separator', getItemProp(processedItem, 'class')]}
              role="separator"
            />,
          );
        }
      });

      return (
        <ul class={rootClass.value} tabindex={props.tabindex as number | string}>
          {itemVNodes}
        </ul>
      ) as VNode;
    };
  },
});

export default PanelMenuSub;
