/// <reference types="vue/jsx" />
import type { ComputedRef } from 'vue';
import {
  addStyle,
  findSingle,
  focus,
  getHiddenElementOuterHeight,
  getHiddenElementOuterWidth,
  getViewport,
  isTouchDevice,
} from '@xiaoye-ui/utils/dom';
import {
  findLastIndex,
  isEmpty,
  isNotEmpty,
  isPrintableCharacter,
  resolve,
} from '@xiaoye-ui/utils/object';
import Portal from '../portal';
import ContextMenuSub from './ContextMenuSub';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  Transition,
  watch,
  useSlots,
} from 'vue';
import contextMenuProps from './contextMenuTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

// 内联 ZIndex 管理器（避免 @xiaoye-ui/utils/zindex 子路径在 Vite 中的解析问题）
const zIndexRecords: { key: string; value: number }[] = [];
const ZIndex = {
  get(element?: HTMLElement): number {
    return element ? parseInt(element.style.zIndex, 10) || 0 : 0;
  },
  set(key: string, element: HTMLElement, baseZIndex?: number): void {
    const base = baseZIndex ?? 0;
    const last = zIndexRecords.length > 0 ? zIndexRecords[zIndexRecords.length - 1] : null;
    const newValue = last ? last.value + 1 : base + 1;
    zIndexRecords.push({ key, value: newValue });
    element.style.zIndex = String(newValue);
  },
  clear(element: HTMLElement): void {
    const z = parseInt(element.style.zIndex, 10) || 0;
    const idx = zIndexRecords.findIndex(r => r.value === z);
    if (idx !== -1) zIndexRecords.splice(idx, 1);
    element.style.zIndex = '';
  },
  getCurrent(_key: string): number {
    return zIndexRecords.length > 0 ? zIndexRecords[zIndexRecords.length - 1].value : 0;
  },
};

export default defineComponent({
  name: 'XYContextMenu',
  inheritAttrs: false,
  __XY_CONTEXT_MENU: true,
  props: initDefaultProps(contextMenuProps(), {}),
  emits: ['focus', 'blur', 'show', 'hide', 'before-show', 'before-hide'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('contextmenu', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const slots = useSlots();
    const instance = getCurrentInstance()!;

    const id = computed(() => `xy_contextmenu_${instance.uid}`);

    const focused = ref<boolean>(false);
    const focusedItemInfo = ref<{ index: number; level: number; parentKey: string }>({
      index: -1,
      level: 0,
      parentKey: '',
    });
    const activeItemPath = ref<any[]>([]);
    const visible = ref<boolean>(false);
    const submenuVisible = ref<boolean>(false);
    const query = ref<MediaQueryList | null>(null);
    const queryMatches = ref<boolean>(false);
    const searchValue = ref<string>('');
    const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

    let target: HTMLElement | null = null;
    let outsideClickListener: ((event: Event) => void) | null = null;
    let resizeListener: ((event: Event) => void) | null = null;
    let documentContextMenuListener: ((event: MouseEvent) => void) | null = null;
    let matchMediaListener: ((event: MediaQueryListEvent) => void) | null = null;
    let pageX: number | null = null;
    let pageY: number | null = null;
    let container: HTMLElement | null = null;
    let list: any = null;

    const processedItems: ComputedRef<any[]> = computed(() =>
      createProcessedItems(props.model || []),
    );

    const visibleItems: ComputedRef<any[]> = computed(() => {
      const processedItem = activeItemPath.value.find(
        p => p.key === focusedItemInfo.value.parentKey,
      );

      return processedItem ? processedItem.items : processedItems.value;
    });

    const focusedItemIdx: ComputedRef<string | null> = computed(() => {
      return focusedItemInfo.value.index !== -1
        ? `${id.value}${isNotEmpty(focusedItemInfo.value.parentKey) ? '_' + focusedItemInfo.value.parentKey : ''}_${focusedItemInfo.value.index}`
        : null;
    });

    function getItemProp(item: any, name: string): any {
      return item ? resolve(item[name]) : undefined;
    }

    function getItemLabel(item: any): string | undefined {
      return getItemProp(item, 'label');
    }

    function isItemDisabled(item: any): boolean {
      return getItemProp(item, 'disabled');
    }

    function isItemVisible(item: any): boolean {
      return getItemProp(item, 'visible') !== false;
    }

    function isItemGroup(item: any): boolean {
      return isNotEmpty(getItemProp(item, 'items'));
    }

    function isItemSeparator(item: any): boolean {
      return getItemProp(item, 'separator');
    }

    function getProccessedItemLabel(processedItem: any): string | undefined {
      return processedItem ? getItemLabel(processedItem.item) : undefined;
    }

    function isProccessedItemGroup(processedItem: any): boolean {
      return processedItem && isNotEmpty(processedItem.items);
    }

    function toggle(event: MouseEvent) {
      visible.value ? hide() : show(event);
    }

    function show(event: MouseEvent) {
      emit('before-show');
      activeItemPath.value = [];
      focusedItemInfo.value = { index: -1, level: 0, parentKey: '' };

      if (list) {
        focus(list);
      }

      pageX = event.pageX;
      pageY = event.pageY;
      visible.value ? position() : (visible.value = true);

      event.stopPropagation();
      event.preventDefault();
    }

    function hide() {
      emit('before-hide');
      visible.value = false;
      activeItemPath.value = [];
      focusedItemInfo.value = { index: -1, level: 0, parentKey: '' };
    }

    function onFocus(event: FocusEvent) {
      focused.value = true;
      focusedItemInfo.value =
        focusedItemInfo.value.index !== -1
          ? focusedItemInfo.value
          : { index: -1, level: 0, parentKey: '' };
      emit('focus', event);
    }

    function onBlur(event: FocusEvent) {
      focused.value = false;
      focusedItemInfo.value = { index: -1, level: 0, parentKey: '' };
      searchValue.value = '';
      emit('blur', event);
    }

    function onKeyDown(event: KeyboardEvent) {
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
          onEscapeKey(event);
          break;

        case 'Tab':
          onTabKey(event);
          break;

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

    function onItemChange(event: any, type?: string) {
      const { processedItem, isFocus } = event;

      if (isEmpty(processedItem)) return;

      const { index, key, level, parentKey, items } = processedItem;
      const grouped = isNotEmpty(items);
      const activeItemPathValue = activeItemPath.value.filter(
        p => p.parentKey !== parentKey && p.parentKey !== key,
      );

      if (grouped) {
        activeItemPathValue.push(processedItem);
        submenuVisible.value = true;
      }

      focusedItemInfo.value = { index, level, parentKey };

      if (isFocus && list) {
        focus(list);
      }

      if (type === 'hover' && queryMatches.value) {
        return;
      }

      activeItemPath.value = activeItemPathValue;
    }

    function onItemClick(event: any) {
      const { processedItem } = event;
      const grouped = isProccessedItemGroup(processedItem);
      const selected = isSelected(processedItem);

      if (selected) {
        const { index, key, level, parentKey } = processedItem;

        activeItemPath.value = activeItemPath.value.filter(
          p => key !== p.key && key.startsWith(p.key),
        );
        focusedItemInfo.value = { index, level, parentKey };

        if (list) {
          focus(list);
        }
      } else {
        grouped ? onItemChange(event) : hide();
      }
    }

    function onItemMouseEnter(event: any) {
      onItemChange(event, 'hover');
    }

    function onItemMouseMove(event: any) {
      if (focused.value) {
        changeFocusedItemIndex(event, event.processedItem.index);
      }
    }

    function onArrowDownKey(event: KeyboardEvent) {
      const itemIndex =
        focusedItemInfo.value.index !== -1
          ? findNextItemIndex(focusedItemInfo.value.index)
          : findFirstFocusedItemIndex();

      changeFocusedItemIndex(event, itemIndex);
      event.preventDefault();
    }

    function onArrowUpKey(event: KeyboardEvent) {
      if (event.altKey) {
        if (focusedItemInfo.value.index !== -1) {
          const processedItem = visibleItems.value[focusedItemInfo.value.index];
          const grouped = isProccessedItemGroup(processedItem);

          !grouped && onItemChange({ originalEvent: event, processedItem });
        }

        hide();
        event.preventDefault();
      } else {
        const itemIndex =
          focusedItemInfo.value.index !== -1
            ? findPrevItemIndex(focusedItemInfo.value.index)
            : findLastFocusedItemIndex();

        changeFocusedItemIndex(event, itemIndex);
        event.preventDefault();
      }
    }

    function onArrowLeftKey(event: KeyboardEvent) {
      const processedItem = visibleItems.value[focusedItemInfo.value.index];
      const parentItem = activeItemPath.value.find(p => p.key === processedItem.parentKey);
      const root = isEmpty(processedItem.parent);

      if (!root) {
        focusedItemInfo.value = {
          index: -1,
          level: focusedItemInfo.value.level,
          parentKey: parentItem ? parentItem.parentKey : '',
        };
        searchValue.value = '';
        onArrowDownKey(event);
      }

      activeItemPath.value = activeItemPath.value.filter(
        p => p.parentKey !== focusedItemInfo.value.parentKey,
      );

      event.preventDefault();
    }

    function onArrowRightKey(event: KeyboardEvent) {
      const processedItem = visibleItems.value[focusedItemInfo.value.index];
      const grouped = isProccessedItemGroup(processedItem);

      if (grouped) {
        onItemChange({ originalEvent: event, processedItem });
        focusedItemInfo.value = {
          index: -1,
          level: focusedItemInfo.value.level,
          parentKey: processedItem.key,
        };
        searchValue.value = '';
        onArrowDownKey(event);
      }

      event.preventDefault();
    }

    function onHomeKey(event: KeyboardEvent) {
      changeFocusedItemIndex(event, findFirstItemIndex());
      event.preventDefault();
    }

    function onEndKey(event: KeyboardEvent) {
      changeFocusedItemIndex(event, findLastItemIndex());
      event.preventDefault();
    }

    function onEnterKey(event: KeyboardEvent) {
      if (focusedItemInfo.value.index !== -1 && list) {
        const element = findSingle(list, `li[id="${`${focusedItemIdx.value}`}"]`);
        const anchorElement = element && findSingle(element, '.xy-contextmenu-item-link');

        anchorElement
          ? (anchorElement as HTMLElement).click()
          : element && (element as HTMLElement).click();
        const processedItem = visibleItems.value[focusedItemInfo.value.index];
        const grouped = isProccessedItemGroup(processedItem);

        !grouped && (focusedItemInfo.value.index = findFirstFocusedItemIndex());
      }

      event.preventDefault();
    }

    function onSpaceKey(event: KeyboardEvent) {
      onEnterKey(event);
    }

    function onEscapeKey(event: KeyboardEvent) {
      hide();

      event.preventDefault();
    }

    function onTabKey(event: KeyboardEvent) {
      if (focusedItemInfo.value.index !== -1) {
        const processedItem = visibleItems.value[focusedItemInfo.value.index];
        const grouped = isProccessedItemGroup(processedItem);

        !grouped && onItemChange({ originalEvent: event, processedItem });
      }

      hide();
    }

    function onEnter(el: HTMLElement) {
      addStyle(el, { position: 'absolute' });
      position();

      if (props.autoZIndex) {
        ZIndex.set('menu', el, props.baseZIndex);
      }
    }

    function onAfterEnter() {
      bindOutsideClickListener();
      bindResizeListener();

      emit('show');
      if (list) {
        focus(list);
      }
    }

    function onLeave() {
      emit('hide');
      container = null;
    }

    function onAfterLeave(el: HTMLElement) {
      if (props.autoZIndex) {
        ZIndex.clear(el);
      }

      unbindOutsideClickListener();
      unbindResizeListener();
    }

    function position() {
      if (!isClient || !container || pageX === null || pageY === null) return;

      let left = pageX + 1;
      let top = pageY + 1;
      const width = container.offsetParent
        ? container.offsetWidth
        : getHiddenElementOuterWidth(container);
      const height = container.offsetParent
        ? container.offsetHeight
        : getHiddenElementOuterHeight(container);
      const viewport = getViewport();
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollLeft =
        window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

      if (left + width - scrollLeft > viewport.width) {
        left -= width;
      }

      if (top + height - scrollTop > viewport.height) {
        top -= height;
      }

      if (left < scrollLeft) {
        left = scrollLeft;
      }

      if (top < scrollTop) {
        top = scrollTop;
      }

      container.style.left = left + 'px';
      container.style.top = top + 'px';
    }

    function bindOutsideClickListener() {
      if (!isClient) return;

      if (!outsideClickListener) {
        outsideClickListener = (event: Event) => {
          const isOutsideContainer = container && !container.contains(event.target as Node);
          const isOutsideTarget = visible.value
            ? !(target && (target === event.target || target.contains(event.target as Node)))
            : true;

          if (isOutsideContainer && isOutsideTarget) {
            hide();
          }
        };

        document.addEventListener('click', outsideClickListener, true);
      }
    }

    function unbindOutsideClickListener() {
      if (!isClient) return;

      if (outsideClickListener) {
        document.removeEventListener('click', outsideClickListener, true);
        outsideClickListener = null;
      }
    }

    function bindResizeListener() {
      if (!isClient) return;

      if (!resizeListener) {
        resizeListener = () => {
          if (visible.value && !isTouchDevice()) {
            hide();
          }
        };

        window.addEventListener('resize', resizeListener);
      }
    }

    function unbindResizeListener() {
      if (!isClient) return;

      if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
        resizeListener = null;
      }
    }

    function bindDocumentContextMenuListener() {
      if (!isClient) return;

      if (!documentContextMenuListener) {
        documentContextMenuListener = (event: MouseEvent) => {
          event.button === 2 && show(event);
        };

        document.addEventListener('contextmenu', documentContextMenuListener);
      }
    }

    function unbindDocumentContextMenuListener() {
      if (!isClient) return;

      if (documentContextMenuListener) {
        document.removeEventListener('contextmenu', documentContextMenuListener);
        documentContextMenuListener = null;
      }
    }

    function bindMatchMediaListener() {
      if (!isClient) return;

      if (!matchMediaListener) {
        const queryVal = matchMedia(`(max-width: ${props.breakpoint})`);

        query.value = queryVal;
        queryMatches.value = queryVal.matches;

        matchMediaListener = () => {
          queryMatches.value = queryVal.matches;
        };

        queryVal.addEventListener('change', matchMediaListener);
      }
    }

    function unbindMatchMediaListener() {
      if (!isClient) return;

      if (matchMediaListener) {
        query.value!.removeEventListener('change', matchMediaListener);
        matchMediaListener = null;
      }
    }

    function isItemMatched(processedItem: any): boolean {
      return (
        isValidItem(processedItem) &&
        getProccessedItemLabel(processedItem)
          ?.toLocaleLowerCase()
          .startsWith(searchValue.value.toLocaleLowerCase())
      );
    }

    function isValidItem(processedItem: any): boolean {
      return (
        !!processedItem &&
        !isItemDisabled(processedItem.item) &&
        !isItemSeparator(processedItem.item) &&
        isItemVisible(processedItem.item)
      );
    }

    function isValidSelectedItem(processedItem: any): boolean {
      return isValidItem(processedItem) && isSelected(processedItem);
    }

    function isSelected(processedItem: any): boolean {
      return activeItemPath.value.some(p => p.key === processedItem.key);
    }

    function findFirstItemIndex(): number {
      return visibleItems.value.findIndex(processedItem => isValidItem(processedItem));
    }

    function findLastItemIndex(): number {
      return findLastIndex(visibleItems.value, processedItem => isValidItem(processedItem));
    }

    function findNextItemIndex(index: number): number {
      const matchedItemIndex =
        index < visibleItems.value.length - 1
          ? visibleItems.value
              .slice(index + 1)
              .findIndex(processedItem => isValidItem(processedItem))
          : -1;

      return matchedItemIndex > -1 ? matchedItemIndex + index + 1 : index;
    }

    function findPrevItemIndex(index: number): number {
      const matchedItemIndex =
        index > 0
          ? findLastIndex(visibleItems.value.slice(0, index), processedItem =>
              isValidItem(processedItem),
            )
          : -1;

      return matchedItemIndex > -1 ? matchedItemIndex : index;
    }

    function findSelectedItemIndex(): number {
      return visibleItems.value.findIndex(processedItem => isValidSelectedItem(processedItem));
    }

    function findFirstFocusedItemIndex(): number {
      const selectedIndex = findSelectedItemIndex();

      return selectedIndex < 0 ? findFirstItemIndex() : selectedIndex;
    }

    function findLastFocusedItemIndex(): number {
      const selectedIndex = findSelectedItemIndex();

      return selectedIndex < 0 ? findLastItemIndex() : selectedIndex;
    }

    function searchItems(event: KeyboardEvent, char: string): boolean {
      searchValue.value = (searchValue.value || '') + char;

      let itemIndex = -1;
      let matched = false;

      if (focusedItemInfo.value.index !== -1) {
        itemIndex = visibleItems.value
          .slice(focusedItemInfo.value.index)
          .findIndex(processedItem => isItemMatched(processedItem));
        itemIndex =
          itemIndex === -1
            ? visibleItems.value
                .slice(0, focusedItemInfo.value.index)
                .findIndex(processedItem => isItemMatched(processedItem))
            : itemIndex + focusedItemInfo.value.index;
      } else {
        itemIndex = visibleItems.value.findIndex(processedItem => isItemMatched(processedItem));
      }

      if (itemIndex !== -1) {
        matched = true;
      }

      if (itemIndex === -1 && focusedItemInfo.value.index === -1) {
        itemIndex = findFirstFocusedItemIndex();
      }

      if (itemIndex !== -1) {
        changeFocusedItemIndex(event, itemIndex);
      }

      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }

      searchTimeout.value = setTimeout(() => {
        searchValue.value = '';
        searchTimeout.value = null;
      }, 500);

      return matched;
    }

    function changeFocusedItemIndex(_event: KeyboardEvent, index: number) {
      if (focusedItemInfo.value.index !== index) {
        focusedItemInfo.value.index = index;
        scrollInView();
      }
    }

    function scrollInView(index: number = -1) {
      if (!list) return;

      const itemId = index !== -1 ? `${id.value}_${index}` : focusedItemIdx.value;
      const element = findSingle(list, `li[id="${itemId}"]`);

      if (element) {
        element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
      }
    }

    function createProcessedItems(
      items: any[],
      level: number = 0,
      parent: any = {},
      parentKey: string = '',
    ): any[] {
      const processedItemsArr: any[] = [];

      items &&
        items.forEach((item, index) => {
          const key = (parentKey !== '' ? parentKey + '_' : '') + index;
          const newItem = {
            item,
            index,
            level,
            key,
            parent,
            parentKey,
          };

          newItem['items'] = createProcessedItems(item.items, level + 1, newItem, key);
          processedItemsArr.push(newItem);
        });

      return processedItemsArr;
    }

    function containerRef(el: HTMLElement) {
      container = el;
    }

    function listRef(el: any) {
      list = el ? el.$el : undefined;
    }

    function onOverlayClick() {
      // NOOP
    }

    watch(activeItemPath, newPath => {
      if (isNotEmpty(newPath)) {
        bindOutsideClickListener();
        bindResizeListener();
      } else if (!visible.value) {
        unbindOutsideClickListener();
        unbindResizeListener();
      }
    });

    onMounted(() => {
      bindMatchMediaListener();

      if (props.global) {
        bindDocumentContextMenuListener();
      }
    });

    onBeforeUnmount(() => {
      unbindResizeListener();
      unbindOutsideClickListener();
      unbindDocumentContextMenuListener();
      unbindMatchMediaListener();

      if (container && props.autoZIndex) {
        ZIndex.clear(container);
      }

      target = null;
      container = null;
    });

    expose({
      model: props.model,
      appendTo: props.appendTo,
      autoZIndex: props.autoZIndex,
      baseZIndex: props.baseZIndex,
      global: props.global,
      breakpoint: props.breakpoint,
      tabindex: props.tabindex,
      ariaLabelledby: props.ariaLabelledby,
      ariaLabel: props.ariaLabel,
      focused,
      focusedItemInfo,
      activeItemPath,
      visible,
      submenuVisible,
      query,
      queryMatches,
      searchValue,
      processedItems,
      visibleItems,
      focusedItemIdx,
      getItemProp,
      getItemLabel,
      isItemDisabled,
      isItemVisible,
      isItemGroup,
      isItemSeparator,
      getProccessedItemLabel,
      isProccessedItemGroup,
      toggle,
      show,
      hide,
      onFocus,
      onBlur,
      onKeyDown,
      onItemChange,
      onItemClick,
      onItemMouseEnter,
      onItemMouseMove,
      onArrowDownKey,
      onArrowUpKey,
      onArrowLeftKey,
      onArrowRightKey,
      onHomeKey,
      onEndKey,
      onEnterKey,
      onSpaceKey,
      onEscapeKey,
      onTabKey,
      onEnter,
      onAfterEnter,
      onLeave,
      onAfterLeave,
      position,
      bindOutsideClickListener,
      unbindOutsideClickListener,
      bindResizeListener,
      unbindResizeListener,
      bindDocumentContextMenuListener,
      unbindDocumentContextMenuListener,
      bindMatchMediaListener,
      unbindMatchMediaListener,
      isItemMatched,
      isValidItem,
      isValidSelectedItem,
      isSelected,
      findFirstItemIndex,
      findLastItemIndex,
      findNextItemIndex,
      findPrevItemIndex,
      findSelectedItemIndex,
      findFirstFocusedItemIndex,
      findLastFocusedItemIndex,
      searchItems,
      changeFocusedItemIndex,
      scrollInView,
      createProcessedItems,
      containerRef,
      listRef,
    });

    return () => {
      return wrapSSR(
        <Portal appendTo={props.appendTo}>
          <Transition
            name="xy-anchored-overlay"
            onEnter={onEnter}
            onAfterEnter={onAfterEnter}
            onLeave={onLeave}
            onAfterLeave={onAfterLeave}
          >
            {visible.value ? (
              <div
                ref={containerRef}
                id={id.value}
                class={[
                  'xy-contextmenu',
                  { 'xy-contextmenu-mobile': queryMatches.value },
                  hashId.value,
                ]}
                onClick={onOverlayClick}
              >
                <ContextMenuSub
                  ref={listRef}
                  id={id.value + '_list'}
                  class="xy-contextmenu-list"
                  role="menubar"
                  root={true}
                  tabindex={props.tabindex}
                  ariaOrientation="vertical"
                  ariaActivedescendant={focused.value ? focusedItemIdx.value : undefined}
                  menuId={id.value}
                  focusedItemId={focused.value ? focusedItemIdx.value : undefined}
                  items={processedItems.value}
                  templates={slots}
                  activeItemPath={activeItemPath.value}
                  ariaLabelledby={props.ariaLabelledby}
                  ariaLabel={props.ariaLabel}
                  level={0}
                  visible={submenuVisible.value}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeydown={onKeyDown}
                  onItemClick={onItemClick}
                  onItemMouseenter={onItemMouseEnter}
                  onItemMousemove={onItemMouseMove}
                />
              </div>
            ) : null}
          </Transition>
        </Portal>,
      );
    };
  },
});
