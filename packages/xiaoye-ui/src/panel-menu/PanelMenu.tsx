import { findSingle, focus, getAttribute } from '@xiaoye-ui/utils/dom';
import {
  equals,
  isNotEmpty,
  resolve,
  findLast,
  isEmpty,
  isPrintableCharacter,
} from '@xiaoye-ui/utils/object';
import { DownOutlined, RightOutlined } from '@xiaoye-ui/icons';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  ref,
  useSlots,
  Transition,
  mergeProps,
} from 'vue';
import PanelMenuSub from './PanelMenuSub';
import { panelMenuProps } from './panelMenuTypes';
import type { PanelMenuItem, ProcessedPanelMenuItem } from './panelMenuTypes';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import type { CustomSlotsType } from '../_util/type';

let idCounter = 0;
function generateId() {
  return `xy_panel_menu_${++idCounter}`;
}

export default defineComponent({
  name: 'XYPanelMenu',
  inheritAttrs: false,
  __XY_PANEL_MENU: true,
  props: initDefaultProps(panelMenuProps(), {}),
  slots: Object as CustomSlotsType<{
    item: any;
    submenuicon: any;
    headericon: any;
    itemicon: any;
  }>,
  emits: [
    'update:expandedKeys',
    'update:activeItem',
    'expand',
    'collapse',
    'itemClick',
    'panel-open',
    'panel-close',
  ],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('panel-menu', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const slots = useSlots();
    const instance = getCurrentInstance()!;

    const id = generateId();

    // 非受控模式下的内部状态
    const activeItem = ref<PanelMenuItem | null>(null);
    const activeItems = ref<PanelMenuItem[]>([]);

    const rootClasses = computed(() => prefixCls.value);

    // ============ 项属性读取工具 ============
    function getItemProp(item: PanelMenuItem | ProcessedPanelMenuItem | null, name: string) {
      return item ? resolve((item as Record<string, any>)[name]) : undefined;
    }

    function getItemLabel(item: PanelMenuItem | ProcessedPanelMenuItem | null) {
      return getItemProp(item, 'label');
    }

    function isItemActive(item: PanelMenuItem | ProcessedPanelMenuItem) {
      const key = getItemProp(item, 'key');
      if (props.expandedKeys) {
        return !!props.expandedKeys[key as string];
      }
      return props.multiple
        ? activeItems.value.some(subItem => equals(item, subItem))
        : equals(item, activeItem.value);
    }

    function isItemVisible(item: PanelMenuItem | ProcessedPanelMenuItem) {
      return getItemProp(item, 'visible') !== false;
    }

    function isItemDisabled(item: PanelMenuItem | ProcessedPanelMenuItem) {
      return getItemProp(item, 'disabled');
    }

    function isItemGroup(item: PanelMenuItem | ProcessedPanelMenuItem) {
      return isNotEmpty((item as PanelMenuItem).items);
    }

    // ============ 面板 id 工具 ============
    function getPanelId(index: number) {
      return `${id}_${index}`;
    }

    function getPanelKey(index: number) {
      return getPanelId(index);
    }

    function getHeaderId(index: number) {
      return `${getPanelId(index)}_header`;
    }

    function getContentId(index: number) {
      return `${getPanelId(index)}_content`;
    }

    // ============ 顶层面板头部交互 ============
    function onHeaderClick(event: Event, item: PanelMenuItem) {
      if (isItemDisabled(item)) {
        event.preventDefault();
        return;
      }

      const command = getItemProp(item, 'command');
      if (typeof command === 'function') {
        command({ originalEvent: event, item });
      }

      changeActiveItem(event, item);
      focus(event.currentTarget as HTMLElement);
    }

    function onHeaderKeyDown(event: KeyboardEvent, item: PanelMenuItem) {
      switch (event.code) {
        case 'ArrowDown':
          onHeaderArrowDownKey(event);
          break;
        case 'ArrowUp':
          onHeaderArrowUpKey(event);
          break;
        case 'Home':
          onHeaderHomeKey(event);
          break;
        case 'End':
          onHeaderEndKey(event);
          break;
        case 'Enter':
        case 'NumpadEnter':
        case 'Space':
          onHeaderEnterKey(event, item);
          break;
        default:
          break;
      }
    }

    function onHeaderArrowDownKey(event: KeyboardEvent) {
      const currentTarget = event.currentTarget as HTMLElement;
      const rootList =
        getAttribute(currentTarget, 'data-xy-active') === true && currentTarget.nextElementSibling
          ? findSingle(
              currentTarget.nextElementSibling as HTMLElement,
              `.${prefixCls.value}-root-list`,
            )
          : null;

      rootList
        ? focus(rootList as HTMLElement)
        : updateFocusedHeader({ originalEvent: event, focusOnNext: true });
      event.preventDefault();
    }

    function onHeaderArrowUpKey(event: KeyboardEvent) {
      const currentTarget = event.currentTarget as HTMLElement;
      const prevHeader = findPrevHeader(currentTarget.parentElement) || findLastHeader();

      if (!prevHeader) {
        updateFocusedHeader({ originalEvent: event, focusOnNext: false });
        event.preventDefault();
        return;
      }

      const rootList =
        getAttribute(prevHeader, 'data-xy-active') === true && prevHeader.nextElementSibling
          ? findSingle(
              prevHeader.nextElementSibling as HTMLElement,
              `.${prefixCls.value}-root-list`,
            )
          : null;

      rootList
        ? focus(rootList as HTMLElement)
        : updateFocusedHeader({ originalEvent: event, focusOnNext: false });
      event.preventDefault();
    }

    function onHeaderHomeKey(event: Event) {
      changeFocusedHeader(event, findFirstHeader());
      event.preventDefault();
    }

    function onHeaderEndKey(event: Event) {
      changeFocusedHeader(event, findLastHeader());
      event.preventDefault();
    }

    function onHeaderEnterKey(event: KeyboardEvent, item: PanelMenuItem) {
      const headerAction = findSingle(
        event.currentTarget as HTMLElement,
        `.${prefixCls.value}-header-link`,
      );

      headerAction ? (headerAction as HTMLElement).click() : onHeaderClick(event, item);
      event.preventDefault();
    }

    function findNextHeader(
      panelElement: HTMLElement | null,
      selfCheck = false,
    ): HTMLElement | null {
      const nextPanelElement = selfCheck ? panelElement : panelElement?.nextElementSibling;
      const headerElement = findSingle(
        nextPanelElement as HTMLElement,
        `.${prefixCls.value}-header`,
      );

      return headerElement
        ? getAttribute(headerElement, 'data-xy-disabled')
          ? findNextHeader((headerElement as HTMLElement).parentElement)
          : (headerElement as HTMLElement)
        : null;
    }

    function findPrevHeader(
      panelElement: HTMLElement | null,
      selfCheck = false,
    ): HTMLElement | null {
      const prevPanelElement = selfCheck ? panelElement : panelElement?.previousElementSibling;
      const headerElement = findSingle(
        prevPanelElement as HTMLElement,
        `.${prefixCls.value}-header`,
      );

      return headerElement
        ? getAttribute(headerElement, 'data-xy-disabled')
          ? findPrevHeader((headerElement as HTMLElement).parentElement)
          : (headerElement as HTMLElement)
        : null;
    }

    function findFirstHeader() {
      return findNextHeader(instance.proxy?.$el?.firstElementChild as HTMLElement, true);
    }

    function findLastHeader() {
      return findPrevHeader(instance.proxy?.$el?.lastElementChild as HTMLElement, true);
    }

    function updateFocusedHeader(event: {
      originalEvent: Event;
      focusOnNext?: boolean;
      selfCheck?: boolean;
    }) {
      const { originalEvent, focusOnNext, selfCheck } = event;
      const panelElement = (originalEvent.currentTarget as HTMLElement)?.closest(
        `.${prefixCls.value}-panel`,
      );

      if (!panelElement) {
        focusOnNext ? onHeaderHomeKey(originalEvent) : onHeaderEndKey(originalEvent);
        return;
      }

      const header = selfCheck
        ? findSingle(panelElement as HTMLElement, `.${prefixCls.value}-header`)
        : focusOnNext
          ? findNextHeader(panelElement as HTMLElement)
          : findPrevHeader(panelElement as HTMLElement);

      header
        ? changeFocusedHeader(originalEvent, header as HTMLElement)
        : focusOnNext
          ? onHeaderHomeKey(originalEvent)
          : onHeaderEndKey(originalEvent);
    }

    function changeFocusedHeader(_event: Event, element: HTMLElement | null) {
      element && focus(element);
    }

    // ============ 展开 / 折叠状态管理 ============
    function changeActiveItem(event: Event, item: PanelMenuItem, selfActive = false) {
      if (!isItemDisabled(item)) {
        const active = isItemActive(item);

        activeItem.value = selfActive
          ? item
          : activeItem.value && equals(item, activeItem.value)
            ? null
            : item;

        if (props.multiple) {
          if (activeItems.value.some(subItem => equals(item, subItem))) {
            activeItems.value = activeItems.value.filter(subItem => !equals(item, subItem));
          } else {
            activeItems.value.push(item);
          }
        }

        changeExpandedKeys({ item, expanded: !active });

        // 触发任务要求的事件：expand / collapse
        if (!active) {
          emit('expand', { originalEvent: event, item });
          emit('panel-open', { originalEvent: event, item });
        } else {
          emit('collapse', { originalEvent: event, item });
          emit('panel-close', { originalEvent: event, item });
        }
      }
    }

    function changeExpandedKeys({
      item,
      expanded = false,
    }: {
      item: PanelMenuItem;
      expanded?: boolean;
    }) {
      if (props.expandedKeys) {
        const nextKeys: Record<string, boolean> = { ...props.expandedKeys };

        if (expanded) {
          nextKeys[item.key] = true;
        } else {
          delete nextKeys[item.key];
        }

        emit('update:expandedKeys', nextKeys);
      }
    }

    // ============ 子菜单项交互（来自 PanelMenuList 逻辑） ============
    const focused = ref(false);
    const focusedItem = ref<ProcessedPanelMenuItem | null>(null);
    const activeItemPath = ref<ProcessedPanelMenuItem[]>([]);
    let searchTimeout: ReturnType<typeof setTimeout> | null = null;
    let searchValue = '';

    const processedItems = computed(() => createProcessedItems(props.model || []));
    const visibleItems = computed(() => flatItems(processedItems.value));
    const focusedItemId = computed(() =>
      isNotEmpty(focusedItem.value) ? `${id}_${focusedItem.value.key}` : null,
    );

    function createProcessedItems(
      items: PanelMenuItem[],
      level = 0,
      parent: ProcessedPanelMenuItem | Record<string, any> = {},
      parentKey = '',
    ): ProcessedPanelMenuItem[] {
      const nextProcessedItems: ProcessedPanelMenuItem[] = [];

      items?.forEach((item: PanelMenuItem, index: number) => {
        const key = (parentKey !== '' ? parentKey + '_' : '') + index;
        const newItem: ProcessedPanelMenuItem = {
          item,
          index,
          level,
          key,
          parent,
          parentKey,
          items: [],
        };
        newItem.items = createProcessedItems(item.items || [], level + 1, newItem, key);
        nextProcessedItems.push(newItem);
      });

      return nextProcessedItems;
    }

    function flatItems(
      nextProcessedItems: ProcessedPanelMenuItem[] | null | undefined,
      processedFlattenItems: ProcessedPanelMenuItem[] = [],
    ): ProcessedPanelMenuItem[] {
      nextProcessedItems?.forEach((processedItem: ProcessedPanelMenuItem) => {
        if (isVisibleItem(processedItem)) {
          processedFlattenItems.push(processedItem);
          flatItems(processedItem.items, processedFlattenItems);
        }
      });
      return processedFlattenItems;
    }

    function isVisibleItem(processedItem: ProcessedPanelMenuItem) {
      return (
        !!processedItem &&
        (processedItem.level === 0 || isSubItemActive(processedItem)) &&
        getItemProp(processedItem, 'visible') !== false
      );
    }

    function isSubItemActive(processedItem: ProcessedPanelMenuItem) {
      return activeItemPath.value.some(
        (path: ProcessedPanelMenuItem) => path.key === processedItem.parentKey,
      );
    }

    function isValidItem(processedItem: ProcessedPanelMenuItem) {
      return (
        !!processedItem &&
        !getItemProp(processedItem, 'disabled') &&
        !getItemProp(processedItem, 'separator')
      );
    }

    function findFirstItem(): ProcessedPanelMenuItem | undefined {
      return visibleItems.value.find((processedItem: ProcessedPanelMenuItem) =>
        isValidItem(processedItem),
      );
    }

    function findLastItemFn(): ProcessedPanelMenuItem | undefined {
      return findLast(visibleItems.value, (processedItem: ProcessedPanelMenuItem) =>
        isValidItem(processedItem),
      );
    }

    function findNextItem(processedItem: ProcessedPanelMenuItem): ProcessedPanelMenuItem {
      const index = visibleItems.value.findIndex(
        (item: ProcessedPanelMenuItem) => item.key === processedItem.key,
      );
      const matchedItem =
        index < visibleItems.value.length - 1
          ? visibleItems.value
              .slice(index + 1)
              .find((pItem: ProcessedPanelMenuItem) => isValidItem(pItem))
          : undefined;

      return matchedItem || processedItem;
    }

    function findPrevItem(processedItem: ProcessedPanelMenuItem): ProcessedPanelMenuItem {
      const index = visibleItems.value.findIndex(
        (item: ProcessedPanelMenuItem) => item.key === processedItem.key,
      );
      const matchedItem =
        index > 0
          ? findLast(visibleItems.value.slice(0, index), (pItem: ProcessedPanelMenuItem) =>
              isValidItem(pItem),
            )
          : undefined;

      return matchedItem || processedItem;
    }

    function onListFocus(event: FocusEvent) {
      focused.value = true;
      focusedItem.value =
        focusedItem.value ||
        (isElementInPanel(event, event.relatedTarget)
          ? findFirstItem() || null
          : findLastItemFn() || null);
    }

    function onListBlur() {
      focused.value = false;
      focusedItem.value = null;
      searchValue = '';
    }

    function onListKeyDown(event: KeyboardEvent) {
      const metaKey = event.metaKey || event.ctrlKey;

      switch (event.code) {
        case 'ArrowDown':
          onArrowDownKey(event);
          break;
        case 'ArrowUp':
          onArrowUpKey(event);
          break;
        case 'ArrowLeft':
          onArrowLeftKey(event);
          break;
        case 'ArrowRight':
          onArrowRightKey(event);
          break;
        case 'Home':
          onHomeKey(event);
          break;
        case 'End':
          onEndKey(event);
          break;
        case 'Space':
          onSpaceKey(event);
          break;
        case 'Enter':
        case 'NumpadEnter':
          onEnterKey(event);
          break;
        case 'Escape':
        case 'Tab':
        case 'PageDown':
        case 'PageUp':
        case 'Backspace':
        case 'ShiftLeft':
        case 'ShiftRight':
          break;
        default:
          if (!metaKey && isPrintableCharacter(event.key)) {
            searchItems(event, event.key);
          }
          break;
      }
    }

    function onArrowDownKey(event: KeyboardEvent) {
      const processedItem = isNotEmpty(focusedItem.value)
        ? findNextItem(focusedItem.value)
        : findFirstItem();
      if (processedItem) {
        changeFocusedItem({ originalEvent: event, processedItem, focusOnNext: true });
      }
      event.preventDefault();
    }

    function onArrowUpKey(event: KeyboardEvent) {
      const processedItem = isNotEmpty(focusedItem.value)
        ? findPrevItem(focusedItem.value)
        : findLastItemFn();
      if (processedItem) {
        changeFocusedItem({ originalEvent: event, processedItem, selfCheck: true });
      }
      event.preventDefault();
    }

    function onArrowLeftKey(event: KeyboardEvent) {
      if (isNotEmpty(focusedItem.value)) {
        const matched = activeItemPath.value.some(
          (p: ProcessedPanelMenuItem) => p.key === focusedItem.value!.key,
        );

        if (matched) {
          activeItemPath.value = activeItemPath.value.filter(
            (p: ProcessedPanelMenuItem) => p.key !== focusedItem.value!.key,
          );
        } else {
          focusedItem.value = isNotEmpty(focusedItem.value.parent)
            ? (focusedItem.value.parent as ProcessedPanelMenuItem)
            : focusedItem.value;
        }

        event.preventDefault();
      }
    }

    function onArrowRightKey(event: KeyboardEvent) {
      if (isNotEmpty(focusedItem.value)) {
        const grouped = isNotEmpty(focusedItem.value.items);

        if (grouped) {
          const matched = activeItemPath.value.some(
            (p: ProcessedPanelMenuItem) => p.key === focusedItem.value!.key,
          );

          if (matched) {
            onArrowDownKey(event);
          } else {
            activeItemPath.value = activeItemPath.value.filter(
              (p: ProcessedPanelMenuItem) => p.parentKey !== focusedItem.value!.parentKey,
            );
            activeItemPath.value.push(focusedItem.value);
          }
        }

        event.preventDefault();
      }
    }

    function onHomeKey(event: KeyboardEvent) {
      changeFocusedItem({
        originalEvent: event,
        processedItem: findFirstItem(),
        allowHeaderFocus: false,
      });
      event.preventDefault();
    }

    function onEndKey(event: KeyboardEvent) {
      changeFocusedItem({
        originalEvent: event,
        processedItem: findLastItemFn(),
        focusOnNext: true,
        allowHeaderFocus: false,
      });
      event.preventDefault();
    }

    function onEnterKey(event: KeyboardEvent) {
      if (isNotEmpty(focusedItem.value)) {
        const element = findSingle(instance.proxy?.$el, `li[id="${focusedItemId.value}"]`);
        const anchorElement =
          (element && findSingle(element, `.${prefixCls.value}-item-link`)) ||
          (element && findSingle(element, 'a,button'));

        anchorElement
          ? (anchorElement as HTMLElement).click()
          : element && (element as HTMLElement).click();
      }

      event.preventDefault();
    }

    function onSpaceKey(event: KeyboardEvent) {
      onEnterKey(event);
    }

    function onItemToggle(event: { processedItem: ProcessedPanelMenuItem; expanded: boolean }) {
      const { processedItem, expanded } = event;

      if (props.expandedKeys) {
        // 受控模式：直接同步 expandedKeys，通过 update:expandedKeys 通知父级
        changeExpandedKeys({ item: processedItem.item, expanded });
      } else {
        activeItemPath.value = activeItemPath.value.filter(
          (p: ProcessedPanelMenuItem) => p.parentKey !== processedItem.parentKey,
        );
        if (expanded) {
          activeItemPath.value.push(processedItem);
        }
      }

      focusedItem.value = processedItem;
    }

    function onItemClickFromSub(event: { originalEvent: Event; item: PanelMenuItem }) {
      // 子菜单项点击：透传 itemClick 事件并同步 activeItem
      emit('itemClick', event);
      emit('update:activeItem', event?.item?.key);
    }

    function onItemMouseMove(event: {
      originalEvent: MouseEvent;
      processedItem: ProcessedPanelMenuItem;
    }) {
      if (focused.value) {
        focusedItem.value = event.processedItem;
      }
    }

    function isElementInPanel(event: FocusEvent, element: EventTarget | null) {
      const panel = (event.currentTarget as HTMLElement)?.closest(`.${prefixCls.value}-panel`);
      return panel && element instanceof Node && panel.contains(element);
    }

    function isItemMatched(processedItem: ProcessedPanelMenuItem) {
      return (
        isValidItem(processedItem) &&
        getItemLabel(processedItem)?.toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase())
      );
    }

    function searchItems(event: KeyboardEvent, char: string) {
      searchValue = (searchValue || '') + char;

      let matchedItem: ProcessedPanelMenuItem | null | undefined = null;

      if (isNotEmpty(focusedItem.value)) {
        const focusedItemIndex = visibleItems.value.findIndex(
          (processedItem: ProcessedPanelMenuItem) => processedItem.key === focusedItem.value!.key,
        );

        matchedItem = visibleItems.value
          .slice(focusedItemIndex)
          .find((processedItem: ProcessedPanelMenuItem) => isItemMatched(processedItem));
        matchedItem = isEmpty(matchedItem)
          ? visibleItems.value
              .slice(0, focusedItemIndex)
              .find((processedItem: ProcessedPanelMenuItem) => isItemMatched(processedItem))
          : matchedItem;
      } else {
        matchedItem = visibleItems.value.find((processedItem: ProcessedPanelMenuItem) =>
          isItemMatched(processedItem),
        );
      }

      if (isEmpty(matchedItem) && isEmpty(focusedItem.value)) {
        matchedItem = findFirstItem() || null;
      }

      if (isNotEmpty(matchedItem)) {
        changeFocusedItem({
          originalEvent: event,
          processedItem: matchedItem as ProcessedPanelMenuItem,
          allowHeaderFocus: false,
        });
      }

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      searchTimeout = setTimeout(() => {
        searchValue = '';
        searchTimeout = null;
      }, 500);

      return isNotEmpty(matchedItem);
    }

    function changeFocusedItem(event: {
      originalEvent: Event;
      processedItem: ProcessedPanelMenuItem;
      focusOnNext?: boolean;
      selfCheck?: boolean;
      allowHeaderFocus?: boolean;
    }) {
      const {
        originalEvent,
        processedItem,
        focusOnNext,
        selfCheck,
        allowHeaderFocus = true,
      } = event;

      if (isNotEmpty(focusedItem.value) && focusedItem.value.key !== processedItem.key) {
        focusedItem.value = processedItem;
        scrollInView();
      } else if (allowHeaderFocus) {
        // 焦点切回面板头部：直接复用 updateFocusedHeader
        updateFocusedHeader({ originalEvent, focusOnNext, selfCheck });
      }
    }

    function scrollInView() {
      const element = findSingle(instance.proxy?.$el, `li[id="${focusedItemId.value}"]`);
      if (element) {
        element.scrollIntoView?.({ block: 'nearest', inline: 'start' });
      }
    }

    function getMenuItemProps(item: PanelMenuItem, _index: number) {
      return {
        icon: mergeProps(
          {
            class: [`${prefixCls.value}-header-icon`, getItemProp(item, 'icon')],
          },
          {},
        ),
        label: mergeProps({ class: `${prefixCls.value}-header-label` }, {}),
      };
    }

    expose({
      model: props.model,
      activeItem,
      activeItems,
      getItemProp,
      getItemLabel,
      isItemActive,
      isItemVisible,
      isItemDisabled,
      isItemGroup,
      getPanelId,
      getPanelKey,
      getHeaderId,
      getContentId,
      onHeaderClick,
      onHeaderKeyDown,
      changeActiveItem,
      changeExpandedKeys,
      getMenuItemProps,
    });

    return () => {
      return wrapSSR(
        <div id={id} class={[rootClasses.value, hashId.value]}>
          {props.model?.map((item: PanelMenuItem, index: number) => {
            if (!isItemVisible(item)) return null;

            // 将 slots 转为 any 类型以便在 JSX 中作为组件使用（保持 class 自动合并行为）
            const HeaderIconSlot = slots.headericon as any;
            const ItemSlot = slots.item as any;

            const headerClass = [
              `${prefixCls.value}-header`,
              {
                [`${prefixCls.value}-header-active`]: isItemActive(item) && !!item.items,
                [`${prefixCls.value}-header-disabled`]: isItemDisabled(item),
              },
              getItemProp(item, 'headerClass'),
            ];

            let headerContentVNode;
            if (!slots.item) {
              // 顶层面板的展开/折叠图标
              const submenuIconVNode = getItemProp(item, 'items') ? (
                slots.submenuicon ? (
                  slots.submenuicon({ active: isItemActive(item) })
                ) : isItemActive(item) ? (
                  <DownOutlined class={`${prefixCls.value}-submenu-icon`} />
                ) : (
                  <RightOutlined class={`${prefixCls.value}-submenu-icon`} />
                )
              ) : null;

              const headerIconVNode = HeaderIconSlot ? (
                <HeaderIconSlot
                  item={item}
                  class={[`${prefixCls.value}-header-icon`, getItemProp(item, 'icon')]}
                />
              ) : getItemProp(item, 'icon') ? (
                <span class={[`${prefixCls.value}-header-icon`, getItemProp(item, 'icon')]} />
              ) : null;

              headerContentVNode = (
                <a
                  href={getItemProp(item, 'url')}
                  class={`${prefixCls.value}-header-link`}
                  tabindex="-1"
                >
                  {submenuIconVNode}
                  {headerIconVNode}
                  <span class={`${prefixCls.value}-header-label`}>{getItemLabel(item)}</span>
                </a>
              );
            } else {
              headerContentVNode = (
                <ItemSlot
                  item={item}
                  root={true}
                  active={isItemActive(item)}
                  hasSubmenu={isItemGroup(item)}
                  label={getItemLabel(item)}
                  props={getMenuItemProps(item, index)}
                />
              );
            }

            return (
              <div
                key={getPanelKey(index)}
                style={getItemProp(item, 'style')}
                class={[`${prefixCls.value}-panel`, getItemProp(item, 'class')]}
              >
                <div
                  id={getHeaderId(index)}
                  class={headerClass}
                  tabindex={isItemDisabled(item) ? -1 : (props.tabindex as number)}
                  role="button"
                  aria-label={getItemLabel(item)}
                  aria-expanded={isItemActive(item)}
                  aria-controls={getContentId(index)}
                  aria-disabled={isItemDisabled(item)}
                  onClick={(e: Event) => onHeaderClick(e, item)}
                  onKeydown={(e: KeyboardEvent) => onHeaderKeyDown(e, item)}
                  data-xy-active={isItemActive(item)}
                  data-xy-disabled={isItemDisabled(item)}
                >
                  <div class={`${prefixCls.value}-header-content`}>{headerContentVNode}</div>
                </div>
                <Transition name="xy-collapsible">
                  <div
                    id={getContentId(index)}
                    class={`${prefixCls.value}-content-container`}
                    role="region"
                    aria-labelledby={getHeaderId(index)}
                    style={{ display: isItemActive(item) ? 'block' : 'none' }}
                  >
                    <div class={`${prefixCls.value}-content-wrapper`}>
                      {getItemProp(item, 'items') ? (
                        <div class={`${prefixCls.value}-content`}>
                          <PanelMenuSub
                            {...({
                              role: 'tree',
                              'aria-activedescendant': focused.value
                                ? focusedItemId.value
                                : undefined,
                            } as any)}
                            panelId={getPanelId(index)}
                            class={`${prefixCls.value}-root-list`}
                            tabindex="-1"
                            items={processedItems.value[index]?.items || []}
                            templates={slots as any}
                            expandedKeys={props.expandedKeys}
                            focusedItemId={
                              focused.value ? (focusedItemId.value as string) : undefined
                            }
                            activeItemPath={activeItemPath.value}
                            onFocus={onListFocus}
                            onBlur={onListBlur}
                            onKeydown={onListKeyDown}
                            onItemToggle={onItemToggle}
                            onItemClick={onItemClickFromSub}
                            onItemMousemove={onItemMouseMove}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Transition>
              </div>
            );
          })}
        </div>,
      );
    };
  },
});
