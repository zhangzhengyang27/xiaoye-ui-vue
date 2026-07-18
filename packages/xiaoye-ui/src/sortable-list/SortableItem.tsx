/// <reference types="vue/jsx" />
import { computed, defineComponent, ref } from 'vue';
import { useSortable } from '@dnd-kit/vue/sortable';
import { GripVerticalIcon } from '@xiaoye-ui/icons';
import { sortableItemProps } from './sortableListTypes';
import type { SortableKeyboardDirection } from './sortableListTypes';
import { initDefaultProps } from '../_util/props-util';
import type { CustomSlotsType } from '../_util/type';

export default defineComponent({
  name: 'XYSortableItem',
  inheritAttrs: false,
  __XY_SORTABLE_ITEM: true,
  props: initDefaultProps(sortableItemProps(), {}),
  slots: Object as CustomSlotsType<{
    default?: { item: any; index: number };
    handle?: { item: any; index: number };
  }>,
  emits: ['keyboardGrab', 'keyboardDrop', 'keyboardCancel', 'keyboardMove'],
  setup(props, { slots, attrs, emit }) {
    const elementRef = ref<HTMLElement | null>(null);
    const handleRef = ref<HTMLElement | null>(null);

    // 列表项的唯一标识
    const itemId = computed(() => props.item?.[props.itemKey]);

    // 是否禁用该项拖拽
    const isDisabled = computed(() => props.disabled === true || props.item?.disabled === true);

    // 注册为可排序项
    const { isDragging, isDragSource, isDropTarget } = useSortable({
      id: itemId,
      index: props.index,
      element: elementRef,
      handle: props.handle ? handleRef : undefined,
      disabled: isDisabled,
    });

    // 当前是否处于"被拾起"状态：鼠标拖拽 或 键盘拖拽（由父级通过 keyboardActive 控制）
    const isGrabbed = computed(
      () => isDragging.value || isDragSource.value || props.keyboardActive,
    );

    // 容器类名
    const classes = computed(() => [
      `${props.prefixCls}-item`,
      {
        [`${props.prefixCls}-item-dragging`]: isDragging.value,
        [`${props.prefixCls}-item-drag-source`]: isDragSource.value,
        [`${props.prefixCls}-item-drop-target`]: isDropTarget.value,
        [`${props.prefixCls}-item-disabled`]: isDisabled.value,
        [`${props.prefixCls}-item-keyboard-grabbed`]: props.keyboardActive,
      },
    ]);

    // 将键盘方向键归一化为 SortableKeyboardDirection
    function resolveDirection(key: string): SortableKeyboardDirection | null {
      switch (key) {
        case 'ArrowUp':
          return 'up';
        case 'ArrowDown':
          return 'down';
        case 'ArrowLeft':
          return 'left';
        case 'ArrowRight':
          return 'right';
        case 'Home':
          return 'home';
        case 'End':
          return 'end';
        default:
          return null;
      }
    }

    // 拖拽手柄键盘事件处理（WAI-ARIA sortable list 模式）
    // 是否处于键盘拖拽中由父级 keyboardActive prop 决定，便于焦点跟随
    function handleKeyDown(event: KeyboardEvent) {
      if (isDisabled.value) return;

      // Space / Enter：拾起 / 放下
      if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') {
        event.preventDefault();
        if (props.keyboardActive) {
          emit('keyboardDrop', {
            sourceId: itemId.value,
            sourceIndex: props.index,
            originalEvent: event,
          });
        } else {
          emit('keyboardGrab', {
            sourceId: itemId.value,
            sourceIndex: props.index,
            originalEvent: event,
          });
        }
        return;
      }

      // Esc：取消拖拽
      if (event.key === 'Escape') {
        if (props.keyboardActive) {
          event.preventDefault();
          emit('keyboardCancel', {
            sourceId: itemId.value,
            sourceIndex: props.index,
            originalEvent: event,
          });
        }
        return;
      }

      // 方向键 / Home / End：仅在已拾起时响应
      if (!props.keyboardActive) return;
      const direction = resolveDirection(event.key);
      if (!direction) return;

      // 仅响应当前列表方向上的键，避免水平列表里 ArrowUp/Down 干扰
      const isVertical = props.axis === 'y';
      const isHorizontal = props.axis === 'x';
      const isRelevant =
        (isVertical && (direction === 'up' || direction === 'down')) ||
        (isHorizontal && (direction === 'left' || direction === 'right')) ||
        direction === 'home' ||
        direction === 'end';
      if (!isRelevant) return;

      event.preventDefault();
      emit('keyboardMove', {
        sourceId: itemId.value,
        sourceIndex: props.index,
        direction,
        originalEvent: event,
      });
    }

    return () => {
      // 默认渲染内容：item.label
      const defaultContent = slots.default
        ? slots.default({ item: props.item, index: props.index })
        : props.item?.label;

      // 拖拽手柄节点：handle 模式下渲染
      const handleNode = props.handle ? (
        slots.handle ? (
          <span
            ref={handleRef}
            class={`${props.prefixCls}-item-handle`}
            role="button"
            tabindex={isDisabled.value ? -1 : 0}
            aria-label="拖拽排序"
            aria-grabbed={isGrabbed.value ? 'true' : 'false'}
            aria-disabled={isDisabled.value ? 'true' : undefined}
            onKeydown={handleKeyDown}
          >
            {slots.handle({ item: props.item, index: props.index })}
          </span>
        ) : (
          <span
            ref={handleRef}
            class={`${props.prefixCls}-item-handle`}
            role="button"
            tabindex={isDisabled.value ? -1 : 0}
            aria-label="拖拽排序"
            aria-grabbed={isGrabbed.value ? 'true' : 'false'}
            aria-disabled={isDisabled.value ? 'true' : undefined}
            onKeydown={handleKeyDown}
          >
            <GripVerticalIcon />
          </span>
        )
      ) : null;

      // 无 handle 模式：列表项自身承担可交互职责
      // - 保留 role="listitem" 维护列表语义
      // - 添加 tabindex 与 onKeydown 让其可键盘聚焦/操作
      // - 通过 aria-roledescription 描述其可拖拽语义
      const interactiveTabindex = props.handle ? undefined : isDisabled.value ? -1 : 0;
      const interactiveAriaRoleDesc = props.handle ? undefined : '可拖拽项';
      const interactiveOnKeydown = props.handle ? undefined : handleKeyDown;

      return (
        <div
          ref={elementRef}
          class={classes.value}
          {...attrs}
          role="listitem"
          aria-grabbed={isGrabbed.value ? 'true' : 'false'}
          aria-disabled={isDisabled.value ? 'true' : undefined}
          aria-roledescription={interactiveAriaRoleDesc}
          data-id={itemId.value}
          data-disabled={isDisabled.value}
          data-keyboard-grabbed={props.keyboardActive}
          tabindex={interactiveTabindex}
          onKeydown={interactiveOnKeydown}
        >
          {handleNode}
          <div class={`${props.prefixCls}-item-content`}>{defaultContent}</div>
        </div>
      );
    };
  },
});
