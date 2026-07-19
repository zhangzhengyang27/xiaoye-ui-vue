/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  Transition,
  type PropType,
} from 'vue';
import { absolutePosition, addStyle, focus, isTouchDevice } from '@xiaoye-ui/utils/dom';
import { ZIndex } from '@xiaoye-ui/utils/zindex';
import { ConnectedOverlayScrollHandler } from '@xiaoye-ui/core/utils';
import { FilterIcon, FilterFillIcon, PlusIcon, TrashIcon } from '@xiaoye-ui/icons';
import { FilterOperator } from 'xiaoye-ui/table-core';
import Button from 'xiaoye-ui/button';
import OverlayEventBus from '../_util/overlayEventBus';
import Portal from 'xiaoye-ui/portal';
import Select from 'xiaoye-ui/select';

const ColumnFilter = defineComponent({
  name: 'XYColumnFilter',
  inheritAttrs: false,
  props: {
    field: { type: String as PropType<string | null>, default: null },
    type: { type: String, default: 'text' },
    display: { type: String as PropType<string | null>, default: null },
    showMenu: { type: Boolean, default: true },
    matchMode: { type: String as PropType<string | null>, default: null },
    showOperator: { type: Boolean, default: true },
    showClearButton: { type: Boolean, default: true },
    showApplyButton: { type: Boolean, default: true },
    showMatchModes: { type: Boolean, default: true },
    showAddButton: { type: Boolean, default: true },
    matchModeOptions: {
      type: Array as PropType<Array<{ label: string; value: string }> | null>,
      default: null,
    },
    maxConstraints: { type: Number, default: 2 },
    filterElement: { type: Function as PropType<Function | null>, default: null },
    filterHeaderTemplate: { type: Function as PropType<Function | null>, default: null },
    filterFooterTemplate: { type: Function as PropType<Function | null>, default: null },
    filterClearTemplate: { type: Function as PropType<Function | null>, default: null },
    filterApplyTemplate: { type: Function as PropType<Function | null>, default: null },
    filterIconTemplate: { type: Function as PropType<Function | null>, default: null },
    filterAddIconTemplate: { type: Function as PropType<Function | null>, default: null },
    filterRemoveIconTemplate: { type: Function as PropType<Function | null>, default: null },
    filterClearIconTemplate: { type: Function as PropType<Function | null>, default: null },
    filters: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    filtersStore: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    filterMenuClass: { type: String as PropType<string | null>, default: null },
    filterMenuStyle: { type: null as any, default: null },
    filterInputProps: { type: null as any, default: null },
    filterButtonProps: { type: null as any, default: null },
    column: { type: null as any, default: null },
  },
  emits: [
    'filterChange',
    'filterApply',
    'operatorChange',
    'matchmodeChange',
    'constraintAdd',
    'constraintRemove',
    'filterClear',
    'applyClick',
  ],
  setup(props, { emit }) {
    const instance = getCurrentInstance()!;
    const $xiaoyeUI = inject<any>('$xiaoyeUI', {});

    const overlayVisible = ref(false);
    const defaultMatchMode = ref<string | null>(null);
    const defaultOperator = ref<string | null>(null);

    const overlay = ref<HTMLElement | null>(null);
    const iconRef = ref<any>(null);
    let selfClick = false;
    let overlayEventListener: ((e: any) => void) | null = null;
    let outsideClickListener: ((event: MouseEvent) => void) | null = null;
    let scrollHandler: ConnectedOverlayScrollHandler | null = null;
    let resizeListener: (() => void) | null = null;

    function clearFilter(): void {
      const _filters = { ...props.filters };

      if (_filters[props.field!].operator) {
        _filters[props.field!].constraints.splice(1);
        _filters[props.field!].operator = defaultOperator.value;
        _filters[props.field!].constraints[0] = { value: null, matchMode: defaultMatchMode.value };
      } else {
        _filters[props.field!].value = null;
        _filters[props.field!].matchMode = defaultMatchMode.value;
      }

      emit('filterClear');
      emit('filterChange', _filters);
      emit('filterApply');
      hide();
    }

    function applyFilter(): void {
      emit('applyClick', { field: props.field!, constraints: props.filters[props.field!] });
      emit('filterApply');
      hide();
    }

    function hasFilter(): boolean {
      if (props.filtersStore) {
        const fieldFilter = props.filtersStore[props.field!];

        if (fieldFilter) {
          if (fieldFilter.operator) return !isFilterBlank(fieldFilter.constraints[0].value);
          else return !isFilterBlank(fieldFilter.value);
        }
      }

      return false;
    }

    function isFilterBlank(filter: any): boolean {
      if (filter !== null && filter !== undefined) {
        if (
          (typeof filter === 'string' && filter.trim().length == 0) ||
          (filter instanceof Array && filter.length == 0)
        )
          return true;
        else return false;
      }

      return true;
    }

    function toggleMenu(event: MouseEvent): void {
      overlayVisible.value = !overlayVisible.value;

      event.preventDefault();
    }

    function onToggleButtonKeyDown(event: KeyboardEvent): void {
      switch (event.code) {
        case 'Enter':
        case 'NumpadEnter':
        case 'Space':
          toggleMenu(event as any);
          break;

        case 'Escape':
          overlayVisible.value = false;
          break;
      }
    }

    function onRowMatchModeChange(matchMode: string): void {
      const _filters = { ...props.filters };

      _filters[props.field!].matchMode = matchMode;
      emit('matchmodeChange', { field: props.field!, matchMode });
      emit('filterChange', _filters);
      emit('filterApply');
      hide();
    }

    function onRowMatchModeKeyDown(event: KeyboardEvent): void {
      const item = event.target as HTMLElement | null;

      if (!item) return;

      switch (event.code) {
        case 'ArrowDown': {
          const nextItem = findNextItem(item);

          if (nextItem) {
            item.removeAttribute('tabindex');
            nextItem.tabIndex = 0;
            nextItem.focus();
          }

          event.preventDefault();
          break;
        }

        case 'ArrowUp': {
          const prevItem = findPrevItem(item);

          if (prevItem) {
            item.removeAttribute('tabindex');
            prevItem.tabIndex = 0;
            prevItem.focus();
          }

          event.preventDefault();
          break;
        }
      }
    }

    function isRowMatchModeSelected(matchMode: string): boolean {
      return props.filters[props.field!].matchMode === matchMode;
    }

    function onOperatorChange(value: string): void {
      const _filters = { ...props.filters };

      _filters[props.field!].operator = value;
      emit('filterChange', _filters);

      emit('operatorChange', { field: props.field!, operator: value });

      if (!props.showApplyButton) {
        emit('filterApply');
      }
    }

    function onMenuMatchModeChange(value: string, index: number): void {
      const _filters = { ...props.filters };

      _filters[props.field!].constraints[index].matchMode = value;
      emit('matchmodeChange', { field: props.field!, matchMode: value, index });

      if (!props.showApplyButton) {
        emit('filterApply');
      }
    }

    function addConstraint(): void {
      const _filters = { ...props.filters };
      const newConstraint = { value: null, matchMode: defaultMatchMode.value };

      _filters[props.field!].constraints.push(newConstraint);
      emit('constraintAdd', { field: props.field!, constraint: newConstraint });
      emit('filterChange', _filters);

      if (!props.showApplyButton) {
        emit('filterApply');
      }
    }

    function removeConstraint(index: number): void {
      const _filters = { ...props.filters };
      const removedConstraint = _filters[props.field!].constraints.splice(index, 1);

      emit('constraintRemove', { field: props.field!, constraint: removedConstraint });
      emit('filterChange', _filters);

      if (!props.showApplyButton) {
        emit('filterApply');
      }
    }

    function filterCallback(): void {
      emit('filterApply');
    }

    function findNextItem(item: HTMLElement): HTMLElement | null {
      const nextItem = item.nextElementSibling as HTMLElement;

      if (nextItem)
        return nextItem.classList.contains('xy-data-table-filter-constraint-separator')
          ? findNextItem(nextItem)
          : nextItem;
      else return item.parentElement?.firstElementChild as HTMLElement;
    }

    function findPrevItem(item: HTMLElement): HTMLElement | null {
      const prevItem = item.previousElementSibling as HTMLElement;

      if (prevItem)
        return prevItem.classList.contains('xy-data-table-filter-constraint-separator')
          ? findPrevItem(prevItem)
          : prevItem;
      else return item.parentElement?.lastElementChild as HTMLElement;
    }

    function hide(): void {
      overlayVisible.value = false;

      if (showMenuButton.value && iconRef.value) {
        focus(iconRef.value.$el);
      }
    }

    function onContentClick(event: MouseEvent): void {
      selfClick = true;

      OverlayEventBus.emit('overlay-click', {
        originalEvent: event,
        target: overlay.value,
      });

      selfClick = false;
    }

    function onContentMouseDown(): void {
      selfClick = true;
    }

    function onRowClearItemClick(): void {
      clearFilter();
    }

    function onOverlayEnter(el: HTMLElement): void {
      if (props.filterMenuStyle) {
        addStyle(overlay.value!, props.filterMenuStyle);
      }

      ZIndex.set('overlay', el, $xiaoyeUI?.config?.zIndex?.overlay);
      addStyle(el, { position: 'absolute', top: '0' });
      absolutePosition(overlay.value!, iconRef.value?.$el);
      bindOutsideClickListener();
      bindScrollListener();
      bindResizeListener();

      overlayEventListener = (e: any) => {
        if (!isOutsideClicked(e.target)) {
          selfClick = true;
        }
      };

      OverlayEventBus.on('overlay-click', overlayEventListener);
    }

    function onOverlayAfterEnter(): void {
      (overlay.value as any)?.$focustrap?.autoFocus();
    }

    function onOverlayLeave(): void {
      onOverlayHide();
    }

    function onOverlayAfterLeave(el: HTMLElement): void {
      ZIndex.clear(el);
    }

    function onOverlayHide(): void {
      unbindOutsideClickListener();
      unbindResizeListener();
      unbindScrollListener();
      overlay.value = null;
      OverlayEventBus.off('overlay-click', overlayEventListener);
      overlayEventListener = null;
    }

    function overlayRef(el: any): void {
      overlay.value = el;
    }

    function isOutsideClicked(target: EventTarget): boolean {
      return (
        !isTargetClicked(target) &&
        !!overlay.value &&
        !(overlay.value.isSameNode(target as Node) || overlay.value.contains(target as Node))
      );
    }

    function isTargetClicked(target: EventTarget): boolean {
      return (
        !!iconRef.value &&
        (iconRef.value.$el.isSameNode(target) || iconRef.value.$el.contains(target as Node))
      );
    }

    function bindOutsideClickListener(): void {
      if (!outsideClickListener) {
        outsideClickListener = (event: MouseEvent) => {
          if (overlayVisible.value && !selfClick && isOutsideClicked(event.target as EventTarget)) {
            overlayVisible.value = false;
          }

          selfClick = false;
        };

        document.addEventListener('click', outsideClickListener, true);
      }
    }

    function unbindOutsideClickListener(): void {
      if (outsideClickListener) {
        document.removeEventListener('click', outsideClickListener, true);
        outsideClickListener = null;
        selfClick = false;
      }
    }

    function bindScrollListener(): void {
      if (!scrollHandler) {
        scrollHandler = new ConnectedOverlayScrollHandler(iconRef.value?.$el, () => {
          if (overlayVisible.value) {
            hide();
          }
        });
      }

      scrollHandler.bindScrollListener();
    }

    function unbindScrollListener(): void {
      if (scrollHandler) {
        scrollHandler.unbindScrollListener();
      }
    }

    function bindResizeListener(): void {
      if (!resizeListener) {
        resizeListener = () => {
          if (overlayVisible.value && !isTouchDevice()) {
            hide();
          }
        };

        window.addEventListener('resize', resizeListener);
      }
    }

    function unbindResizeListener(): void {
      if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
        resizeListener = null;
      }
    }

    const showMenuButton = computed(() => {
      return props.showMenu && (props.display === 'row' ? props.type !== 'boolean' : true);
    });

    const overlayId = computed(() => {
      return instance.uid + '_overlay';
    });

    const matchModes = computed(() => {
      return (
        props.matchModeOptions ||
        $xiaoyeUI?.config?.filterMatchModeOptions?.[props.type]?.map((key: string) => {
          return { label: $xiaoyeUI.config.locale[key], value: key };
        })
      );
    });

    const isShowMatchModes = computed(() => {
      return props.type !== 'boolean' && props.showMatchModes && matchModes.value;
    });

    const operatorOptions = computed(() => {
      return [
        { label: $xiaoyeUI?.config?.locale?.matchAll, value: FilterOperator.AND },
        { label: $xiaoyeUI?.config?.locale?.matchAny, value: FilterOperator.OR },
      ];
    });

    const noFilterLabel = computed(() => {
      return $xiaoyeUI?.config?.locale ? $xiaoyeUI.config.locale.noFilter : undefined;
    });

    const isShowOperator = computed(() => {
      return props.showOperator && props.filters[props.field!]?.operator;
    });

    const operator = computed(() => {
      return props.filters[props.field!]?.operator;
    });

    const fieldConstraints = computed(() => {
      return props.filters[props.field!]?.constraints || [props.filters[props.field!]];
    });

    const showRemoveIcon = computed(() => {
      return fieldConstraints.value.length > 1;
    });

    const removeRuleButtonLabel = computed(() => {
      return $xiaoyeUI?.config?.locale ? $xiaoyeUI.config.locale.removeRule : undefined;
    });

    const addRuleButtonLabel = computed(() => {
      return $xiaoyeUI?.config?.locale ? $xiaoyeUI.config.locale.addRule : undefined;
    });

    const isShowAddConstraint = computed(() => {
      return (
        props.showAddButton &&
        props.filters[props.field!]?.operator &&
        fieldConstraints.value &&
        fieldConstraints.value.length < props.maxConstraints
      );
    });

    const clearButtonLabel = computed(() => {
      return $xiaoyeUI?.config?.locale ? $xiaoyeUI.config.locale.clear : undefined;
    });

    const applyButtonLabel = computed(() => {
      return $xiaoyeUI?.config?.locale ? $xiaoyeUI.config.locale.apply : undefined;
    });

    const columnFilterButtonAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale?.aria
        ? overlayVisible.value
          ? $xiaoyeUI.config.locale.aria.hideFilterMenu
          : $xiaoyeUI.config.locale.aria.showFilterMenu
        : undefined;
    });

    const filterOperatorAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale ? $xiaoyeUI.config.locale.filterOperator : undefined;
    });

    const filterRuleAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale ? $xiaoyeUI.config.locale.filterConstraint : undefined;
    });

    onMounted(() => {
      if (props.filters && props.filters[props.field!]) {
        const fieldFilters = props.filters[props.field!];

        if (fieldFilters.operator) {
          defaultMatchMode.value = fieldFilters.constraints[0].matchMode;
          defaultOperator.value = fieldFilters.operator;
        } else {
          defaultMatchMode.value = props.filters[props.field!].matchMode;
        }
      }
    });

    onBeforeUnmount(() => {
      if (overlayEventListener) {
        OverlayEventBus.off('overlay-click', overlayEventListener);
        overlayEventListener = null;
      }

      if (overlay.value) {
        ZIndex.clear(overlay.value);
        onOverlayHide();
      }
    });

    const renderRowFilter = () => {
      return (
        <>
          <ul class="xy-data-table-filter-constraint-list">
            {(matchModes.value || []).map((matchMode: any, i: number) => (
              <li
                key={matchMode.label}
                class={[
                  'xy-data-table-filter-constraint',
                  {
                    'xy-data-table-filter-constraint--selected': isRowMatchModeSelected(
                      matchMode.value,
                    ),
                  },
                ]}
                onClick={() => onRowMatchModeChange(matchMode.value)}
                onKeydown={(event: KeyboardEvent) => {
                  onRowMatchModeKeyDown(event);
                  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                    event.preventDefault();
                    onRowMatchModeChange(matchMode.value);
                  }
                }}
                tabindex={i === 0 ? '0' : null}
              >
                {matchMode.label}
              </li>
            ))}
            <li class="xy-data-table-filter-constraint-separator"></li>
            <li
              class="xy-data-table-filter-constraint"
              onClick={clearFilter}
              onKeydown={(event: KeyboardEvent) => {
                onRowMatchModeKeyDown(event);
                if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                  onRowClearItemClick();
                }
              }}
            >
              {noFilterLabel.value}
            </li>
          </ul>
        </>
      );
    };

    const renderMenuFilter = () => {
      const FilterElement = props.filterElement as any;
      const FilterClearTemplate = props.filterClearTemplate as any;
      const FilterApplyTemplate = props.filterApplyTemplate as any;
      const FilterAddIconTemplate = (props.filterAddIconTemplate || PlusIcon) as any;
      const FilterRemoveIconTemplate = (props.filterRemoveIconTemplate || TrashIcon) as any;
      const popoverBtnProps = (props.filterButtonProps as any)?.popover || {};

      return (
        <>
          {isShowOperator.value ? (
            <div class="xy-data-table-filter-operator">
              <Select
                options={operatorOptions.value}
                value={operator.value}
                aria-label={filterOperatorAriaLabel.value}
                class="xy-data-table-filter-operator-dropdown"
                onUpdate:value={(v: any) => onOperatorChange(v)}
              />
            </div>
          ) : null}
          <div class="xy-data-table-filter-rule-list">
            {(fieldConstraints.value || []).map((fieldConstraint: any, i: number) => (
              <div key={i} class="xy-data-table-filter-rule">
                {isShowMatchModes.value ? (
                  <Select
                    options={matchModes.value}
                    value={fieldConstraint.matchMode}
                    class="xy-data-table-filter-constraint-dropdown"
                    aria-label={filterRuleAriaLabel.value}
                    onUpdate:value={(v: any) => onMenuMatchModeChange(v, i)}
                  />
                ) : null}
                {props.display === 'menu' ? (
                  <FilterElement
                    field={props.field}
                    filterModel={fieldConstraint}
                    filterCallback={filterCallback}
                    applyFilter={applyFilter}
                  />
                ) : null}
                {showRemoveIcon.value ? (
                  <div class="xy-data-table-filter-remove">
                    <Button
                      type="button"
                      class="xy-data-table-filter-remove-rule-button"
                      onClick={() => removeConstraint(i)}
                      label={removeRuleButtonLabel.value}
                      {...(popoverBtnProps.removeRule || {})}
                    >
                      {{
                        icon: (iconProps: any) => (
                          <FilterRemoveIconTemplate class={iconProps.class} />
                        ),
                      }}
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {isShowAddConstraint.value ? (
            <div class="xy-data-table-filter-add-button-container">
              <Button
                type="button"
                label={addRuleButtonLabel.value}
                iconPos="left"
                class="xy-data-table-filter-add-rule-button"
                onClick={addConstraint}
                {...(popoverBtnProps.addRule || {})}
              >
                {{ icon: (iconProps: any) => <FilterAddIconTemplate class={iconProps.class} /> }}
              </Button>
            </div>
          ) : null}
          <div class="xy-data-table-filter-buttonbar">
            {!FilterClearTemplate && props.showClearButton ? (
              <Button
                type="button"
                class="xy-data-table-filter-clear-button"
                label={clearButtonLabel.value}
                onClick={clearFilter}
                {...(popoverBtnProps.clear || {})}
              />
            ) : FilterClearTemplate ? (
              <FilterClearTemplate
                field={props.field}
                filterModel={props.filters[props.field!]}
                filterCallback={clearFilter}
              />
            ) : null}
            {props.showApplyButton ? (
              !FilterApplyTemplate ? (
                <Button
                  type="button"
                  class="xy-data-table-filter-apply-button"
                  label={applyButtonLabel.value}
                  onClick={applyFilter}
                  {...(popoverBtnProps.apply || {})}
                />
              ) : (
                <FilterApplyTemplate
                  field={props.field}
                  filterModel={props.filters[props.field!]}
                  filterCallback={applyFilter}
                />
              )
            ) : null}
          </div>
        </>
      );
    };

    return () => {
      const FilterElement = props.filterElement as any;
      const FilterHeaderTemplate = props.filterHeaderTemplate as any;
      const FilterFooterTemplate = props.filterFooterTemplate as any;
      const FilterIconComp = (props.filterIconTemplate ||
        (hasFilter() ? FilterFillIcon : FilterIcon)) as any;
      const filterBtnProps = (props.filterButtonProps as any)?.filter || {};

      return (
        <div
          class={[
            'xy-data-table-filter',
            props.display === 'row'
              ? 'xy-data-table-filter--inline'
              : 'xy-data-table-filter--popover',
          ]}
        >
          {props.display === 'row' ? (
            <div class="xy-data-table-filter-element-container" {...(props.filterInputProps || {})}>
              <FilterElement
                field={props.field}
                filterModel={props.filters[props.field!]}
                filterCallback={filterCallback}
              />
            </div>
          ) : null}
          {showMenuButton.value ? (
            <Button
              ref={iconRef}
              aria-label={columnFilterButtonAriaLabel.value}
              aria-haspopup="true"
              aria-expanded={overlayVisible.value}
              aria-controls={overlayVisible.value ? overlayId.value : undefined}
              class="xy-data-table-column-filter-button"
              onClick={toggleMenu}
              onKeydown={onToggleButtonKeyDown}
              {...filterBtnProps}
            >
              {{ icon: (slotProps: any) => <FilterIconComp class={slotProps.class} /> }}
            </Button>
          ) : null}
          <Portal>
            <Transition
              name="xy-anchored-overlay"
              onEnter={onOverlayEnter}
              onAfterEnter={onOverlayAfterEnter}
              onLeave={onOverlayLeave}
              onAfterLeave={onOverlayAfterLeave}
            >
              {overlayVisible.value ? (
                <div
                  ref={overlayRef}
                  id={overlayId.value}
                  {...{ directives: [{ name: 'focustrap' }] }}
                  aria-modal={overlayVisible.value}
                  role="dialog"
                  class={[
                    'xy-data-table-filter-overlay',
                    props.display === 'popover' ? 'xy-data-table-filter-overlay--popover' : '',
                    props.filterMenuClass,
                  ]}
                  onKeydown={(event: KeyboardEvent) => {
                    if (event.code === 'Escape') {
                      hide();
                    }
                  }}
                  onClick={onContentClick}
                  onMousedown={onContentMouseDown}
                >
                  {FilterHeaderTemplate ? (
                    <FilterHeaderTemplate
                      field={props.field}
                      filterModel={props.filters[props.field!]}
                      filterCallback={filterCallback}
                    />
                  ) : null}
                  {props.display === 'row' ? renderRowFilter() : renderMenuFilter()}
                  {FilterFooterTemplate ? (
                    <FilterFooterTemplate
                      field={props.field}
                      filterModel={props.filters[props.field!]}
                      filterCallback={filterCallback}
                    />
                  ) : null}
                </div>
              ) : null}
            </Transition>
          </Portal>
        </div>
      );
    };
  },
});

export default ColumnFilter;
