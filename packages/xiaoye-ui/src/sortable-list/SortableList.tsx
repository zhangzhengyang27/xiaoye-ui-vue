/// <reference types="vue/jsx" />
import { computed, defineComponent, ref, watch } from 'vue';
import { DragDropProvider, useDragDropMonitor } from '@dnd-kit/vue';
import { sortableListProps } from './sortableListTypes';
import type {
  SortableKeyboardDirection,
  SortableListDragEvent,
  SortableListUpdateEvent,
  SortableListItem,
} from './sortableListTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import SortableItem from './SortableItem';
import useStyle from './style';

/**
 * 内部容器组件：在 DragDropProvider 内部渲染，可使用 useDragDropMonitor
 * 负责监听拖拽事件、维护顺序、渲染列表项、处理键盘交互
 */
const SortableListInner = defineComponent({
  name: 'XYSortableListInner',
  inheritAttrs: false,
  props: initDefaultProps(sortableListProps(), {
    model: [],
    itemKey: 'key',
    disabled: false,
    axis: 'y',
    handle: false,
  }),
  slots: Object as CustomSlotsType<{
    item?: { item: any; index: number };
    handle?: { item: any; index: number };
  }>,
  emits: ['update', 'dragStart', 'dragEnd', 'dragOver', 'keyboardActiveChange'],
  setup(props, { slots, emit }) {
    // 内部维护的列表顺序，便于拖拽时即时反馈
    const internalItems = ref<SortableListItem[]>([...(props.model || [])]);

    // 同步外部 model 变化（受控）
    watch(
      () => props.model,
      next => {
        internalItems.value = [...(next || [])];
      },
      { deep: true },
    );

    // 键盘拖拽状态：当前处于键盘拖拽的项索引（null 表示无）
    const keyboardActiveIndex = ref<number | null>(null);
    // 键盘拖拽开始时的快照（用于 Esc 取消恢复）
    let keyboardSnapshot: SortableListItem[] | null = null;

    // 朗读给屏幕阅读器的提示文本
    const liveMessage = ref('');

    // 根据 id 查找项在数组中的索引
    const findIndexById = (id: any): number => {
      return internalItems.value.findIndex(it => it?.[props.itemKey] === id);
    };

    // 通过 useDragDropMonitor 监听 manager 拖拽事件
    useDragDropMonitor({
      onDragStart: (event: any) => {
        const sourceId = event?.operation?.source?.id;
        const dragEvent: SortableListDragEvent = {
          sourceId,
          originalEvent: event?.nativeEvent,
        };
        emit('dragStart', dragEvent);
      },
      onDragOver: (event: any) => {
        const sourceId = event?.operation?.source?.id;
        const targetId = event?.operation?.target?.id;
        const dragEvent: SortableListDragEvent = {
          sourceId,
          targetId,
          originalEvent: event?.nativeEvent,
        };
        emit('dragOver', dragEvent);
      },
      onDragEnd: (event: any) => {
        const sourceId = event?.operation?.source?.id;
        const targetId = event?.operation?.target?.id;
        const canceled = event?.canceled;

        const dragEvent: SortableListDragEvent = {
          sourceId,
          targetId,
          originalEvent: event?.nativeEvent,
        };
        emit('dragEnd', dragEvent);

        // 拖拽被取消则不更新顺序
        if (canceled || sourceId == null) return;

        const sourceIndex = findIndexById(sourceId);
        const targetIndex = targetId != null ? findIndexById(targetId) : -1;
        if (sourceIndex < 0) return;

        // 重新排序
        const next = [...internalItems.value];
        if (targetIndex >= 0 && sourceIndex !== targetIndex) {
          const [moved] = next.splice(sourceIndex, 1);
          next.splice(targetIndex, 0, moved);
          internalItems.value = next;

          const updateEvent: SortableListUpdateEvent = {
            sourceId,
            targetId,
            value: next,
            originalEvent: event?.nativeEvent,
          };
          emit('update', updateEvent);
        }
      },
    });

    // ===== 键盘交互处理 =====
    function onKeyboardGrab(payload: { sourceId: any; sourceIndex: number }) {
      if (keyboardActiveIndex.value !== null) return; // 已有项处于拖拽中
      keyboardActiveIndex.value = payload.sourceIndex;
      // 记录当前顺序快照，用于 Esc 取消时恢复
      keyboardSnapshot = [...internalItems.value];
      const itemLabel =
        internalItems.value[payload.sourceIndex]?.label ?? `第 ${payload.sourceIndex + 1} 项`;
      liveMessage.value = `已拾起：${itemLabel}。使用方向键移动，空格键放下，Esc 取消。`;
      emit('keyboardActiveChange', payload.sourceIndex);

      const dragEvent: SortableListDragEvent = { sourceId: payload.sourceId };
      emit('dragStart', dragEvent);
    }

    function onKeyboardDrop(payload: { sourceId: any; sourceIndex: number }) {
      keyboardActiveIndex.value = null;
      keyboardSnapshot = null;
      const itemLabel =
        internalItems.value[payload.sourceIndex]?.label ?? `第 ${payload.sourceIndex + 1} 项`;
      liveMessage.value = `已放下：${itemLabel}。当前位置第 ${payload.sourceIndex + 1} 项。`;

      // 触发 update 与 dragEnd 事件，让外部使用者获取最新顺序
      const dragEvent: SortableListDragEvent = { sourceId: payload.sourceId };
      emit('dragEnd', dragEvent);
      const updateEvent: SortableListUpdateEvent = {
        sourceId: payload.sourceId,
        targetId: payload.sourceId,
        value: internalItems.value,
      };
      emit('update', updateEvent);
    }

    function onKeyboardCancel(payload: { sourceId: any; sourceIndex: number }) {
      if (keyboardSnapshot) {
        internalItems.value = [...keyboardSnapshot];
      }
      keyboardActiveIndex.value = null;
      keyboardSnapshot = null;
      liveMessage.value = '已取消拖拽，位置已恢复。';

      const dragEvent: SortableListDragEvent = { sourceId: payload.sourceId };
      emit('dragEnd', dragEvent);
    }

    function onKeyboardMove(payload: {
      sourceId: any;
      sourceIndex: number;
      direction: SortableKeyboardDirection;
    }) {
      const total = internalItems.value.length;
      if (total <= 1) return;

      const from = payload.sourceIndex;
      let to = from;

      if (payload.direction === 'up' || payload.direction === 'left') {
        to = from - 1;
      } else if (payload.direction === 'down' || payload.direction === 'right') {
        to = from + 1;
      } else if (payload.direction === 'home') {
        to = 0;
      } else if (payload.direction === 'end') {
        to = total - 1;
      }

      if (to < 0 || to >= total || to === from) return;

      // 跳过禁用项：尽量寻找下一个可用位置
      while (to >= 0 && to < total && internalItems.value[to]?.disabled === true) {
        if (payload.direction === 'up' || payload.direction === 'left') to--;
        else if (payload.direction === 'down' || payload.direction === 'right') to++;
        else break;
      }
      if (to < 0 || to >= total || to === from) return;

      const next = [...internalItems.value];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      internalItems.value = next;
      // 更新当前键盘拖拽位置
      keyboardActiveIndex.value = to;

      const itemLabel = moved?.label ?? `第 ${to + 1} 项`;
      liveMessage.value = `正在移动：${itemLabel}，当前第 ${to + 1} 项，共 ${total} 项。`;

      // 通知外部当前正在拖拽经过新位置（保留 dragOver 语义）
      const targetId = internalItems.value[to]?.[props.itemKey];
      const dragEvent: SortableListDragEvent = { sourceId: payload.sourceId, targetId };
      emit('dragOver', dragEvent);
    }

    return () => {
      const { prefixCls } = props;
      if (internalItems.value.length === 0) {
        return <div class={`${prefixCls}-empty`}>暂无数据</div>;
      }
      return (
        <>
          {internalItems.value.map((item, index) => (
            <SortableItem
              key={item?.[props.itemKey] ?? index}
              prefixCls={prefixCls}
              item={item}
              index={index}
              itemKey={props.itemKey}
              disabled={props.disabled}
              handle={props.handle}
              axis={props.axis}
              keyboardActive={keyboardActiveIndex.value === index}
              v-slots={{
                default: slots.item ? (slotProps: any) => slots.item!(slotProps) : undefined,
                handle: slots.handle ? (slotProps: any) => slots.handle!(slotProps) : undefined,
              }}
              onKeyboardGrab={onKeyboardGrab}
              onKeyboardDrop={onKeyboardDrop}
              onKeyboardCancel={onKeyboardCancel}
              onKeyboardMove={onKeyboardMove}
            />
          ))}
          {/* 视觉隐藏的 aria-live 区域：用于屏幕阅读器朗读拖拽状态 */}
          <div class={`${prefixCls}-sr-only`} aria-live="polite" aria-atomic="true">
            {liveMessage.value}
          </div>
        </>
      );
    };
  },
});

export default defineComponent({
  name: 'XYSortableList',
  inheritAttrs: false,
  __XY_SORTABLE_LIST: true,
  props: initDefaultProps(sortableListProps(), {
    model: [],
    itemKey: 'key',
    disabled: false,
    axis: 'y',
    handle: false,
  }),
  slots: Object as CustomSlotsType<{
    item?: { item: any; index: number };
    handle?: { item: any; index: number };
  }>,
  emits: ['update', 'dragStart', 'dragEnd', 'dragOver'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('sortable-list', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // aria-label：默认"可排序列表"
    const ariaLabel = computed(() => props.ariaLabel || '可排序列表');

    // 容器类名
    const classes = computed(() => [
      prefixCls.value,
      `${prefixCls.value}-${props.axis}`,
      {
        [`${prefixCls.value}-disabled`]: props.disabled,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-with-handle`]: props.handle,
      },
      hashId.value,
      attrs.class,
    ]);

    // 透传事件到内部子组件
    const innerListeners = {
      onUpdate: (e: SortableListUpdateEvent) => emit('update', e),
      onDragStart: (e: SortableListDragEvent) => emit('dragStart', e),
      onDragEnd: (e: SortableListDragEvent) => emit('dragEnd', e),
      onDragOver: (e: SortableListDragEvent) => emit('dragOver', e),
    };

    return () =>
      wrapSSR(
        <DragDropProvider>
          <div
            {...attrs}
            class={classes.value}
            role="list"
            aria-label={ariaLabel.value}
            data-axis={props.axis}
          >
            <div class={`${prefixCls.value}-container`}>
              <SortableListInner
                prefixCls={prefixCls.value}
                model={props.model}
                itemKey={props.itemKey}
                disabled={props.disabled}
                axis={props.axis}
                handle={props.handle}
                {...innerListeners}
                v-slots={{
                  item: slots.item,
                  handle: slots.handle,
                }}
              />
            </div>
          </div>
        </DragDropProvider>,
      );
  },
});
