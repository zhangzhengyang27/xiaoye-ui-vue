/// <reference types="vue/jsx" />
import type { PropType, VNode, ExtractPropTypes } from 'vue';
import { defineComponent, computed, ref, useSlots } from 'vue';
import type { Placement, Strategy, Middleware, VirtualElement } from '@floating-ui/dom';
import type { Editor, JSONContent } from '@tiptap/vue-3';
import type { PluginKey } from '@tiptap/pm/state';
import DragHandle from '@tiptap/extension-drag-handle-vue-3';
import { defu } from 'defu';
import type { FloatingUIOptions } from './types/editor';
import { buildFloatingUIMiddleware } from './utils/editor';
import { initDefaultProps } from '../_util/props-util';
import { anyType, stringType } from '../_util/type';

// 本地定义的 DragHandleProps 等价类型
// 避免 .d.ts 生成时引用 @tiptap/extension-drag-handle 内部类型（TS2742）
export interface DragHandleComputePositionConfig {
  placement?: Placement;
  strategy?: Strategy;
  middleware?: Middleware[];
}

export interface DragHandlePropsLike {
  pluginKey?: PluginKey | string;
  nested?: boolean;
  nestedOptions?: any;
  onElementDragEnd?: (e: DragEvent) => void;
  onElementDragStart?: (e: DragEvent) => void;
  getReferencedVirtualElement?: () => VirtualElement | null;
  computePositionConfig?: DragHandleComputePositionConfig;
  class?: string;
}

export interface EditorDragHandleProps extends Omit<
  DragHandlePropsLike,
  'editor' | 'element' | 'onNodeChange' | 'computePositionConfig' | 'class'
> {
  editor: Editor;
  icon?: string;
  color?: string;
  variant?: string;
  size?: string;
  options?: FloatingUIOptions;
}

export interface EditorDragHandleSlots {
  default?(props: {
    classes: Record<string, string>;
    onClick: () => { node: JSONContent; pos: number } | undefined;
  }): VNode[];
}

export interface EditorDragHandleEmits {
  nodeChange: [{ node: JSONContent; pos: number }];
  hover: [{ node: JSONContent; pos: number }];
}

export const richTextEditorDragHandleProps = () => ({
  prefixCls: String,
  editor: { type: Object as PropType<Editor>, required: true },
  color: { type: String, default: 'neutral' },
  variant: { type: String, default: 'ghost' },
  size: stringType('sm'),
  options: { type: Object as PropType<FloatingUIOptions>, default: undefined },
  pluginKey: anyType<DragHandlePropsLike['pluginKey']>(),
  nested: { type: Boolean as PropType<DragHandlePropsLike['nested']>, default: undefined },
  nestedOptions: {
    type: Object as PropType<DragHandlePropsLike['nestedOptions']>,
    default: undefined,
  },
  onElementDragEnd: {
    type: Function as PropType<DragHandlePropsLike['onElementDragEnd']>,
    default: undefined,
  },
  onElementDragStart: {
    type: Function as PropType<DragHandlePropsLike['onElementDragStart']>,
    default: undefined,
  },
  getReferencedVirtualElement: {
    type: Function as PropType<DragHandlePropsLike['getReferencedVirtualElement']>,
    default: undefined,
  },
  icon: { type: String, default: undefined },
});

export type RichTextEditorDragHandleProps = Partial<
  ExtractPropTypes<ReturnType<typeof richTextEditorDragHandleProps>>
>;

export default defineComponent({
  name: 'XYRichTextEditorDragHandle',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_DRAG_HANDLE: true,
  props: initDefaultProps(richTextEditorDragHandleProps(), {}),
  // emits 使用 camelCase，避免 JSX 中 onItem-click 推断问题
  emits: ['nodeChange', 'hover'],
  setup(props, { emit }) {
    const slots = useSlots();

    const dragHandleProps = computed(() => ({
      pluginKey: props.pluginKey,
      nested: props.nested,
      nestedOptions: props.nestedOptions,
      onElementDragEnd: props.onElementDragEnd,
      onElementDragStart: props.onElementDragStart,
      getReferencedVirtualElement: props.getReferencedVirtualElement,
    }));

    const floatingUIOptions = computed(() =>
      defu(props.options, {
        strategy: 'absolute' as Strategy,
        placement: 'left-start' as Placement,
        offset: ({
          rects,
        }: {
          rects: { reference: { height: number }; floating: { height: number } };
        }) => {
          const blockHeight = rects.reference.height;
          const handleHeight = rects.floating.height;

          if (blockHeight > 40) {
            return {
              alignmentAxis: 0,
              mainAxis: 8,
            };
          }

          return {
            alignmentAxis: (blockHeight - handleHeight) / 2,
            mainAxis: 8,
          };
        },
        flip: {},
        shift: {},
        size: false,
        autoPlacement: false,
        hide: false,
        inline: false,
      } as FloatingUIOptions),
    );

    const middleware = computed(() => buildFloatingUIMiddleware(floatingUIOptions.value));

    const computePositionConfig = computed<DragHandleComputePositionConfig>(() => ({
      placement: floatingUIOptions.value.placement,
      strategy: floatingUIOptions.value.strategy,
      middleware: middleware.value,
    }));

    const currentNodePos = ref<number | null>(undefined);

    function onNodeChange({ pos }: { pos: number }) {
      currentNodePos.value = pos;
      if (pos == null || pos < 0) return;

      const node = props.editor.state.doc.nodeAt(pos);
      if (node) {
        emit('hover', { node: node.toJSON(), pos });
      }
    }

    function onClick() {
      if (!props.editor) return;

      const pos = currentNodePos.value;
      if (pos == null || pos < 0) return;

      const node = props.editor.state.doc.nodeAt(pos);
      if (node) {
        const selectedNode = { node: node.toJSON(), pos };

        emit('nodeChange', selectedNode);

        props.editor.chain().setNodeSelection(pos).run();

        return selectedNode;
      }
    }

    return () => (
      <DragHandle
        {...(dragHandleProps.value as any)}
        computePositionConfig={computePositionConfig.value}
        editor={props.editor}
        onNodeChange={onNodeChange}
        class="xy-rich-text-editor-drag-handle"
        {...({ 'data-slot': 'root', onClick } as any)}
      >
        {slots.default?.({
          ui: {
            root: 'xy-rich-text-editor-drag-handle',
            handle: 'xy-rich-text-editor-drag-handle-handle',
          },
          class: {
            root: 'xy-rich-text-editor-drag-handle',
            handle: 'xy-rich-text-editor-drag-handle-handle',
          },
          onClick,
        }) || null}
      </DragHandle>
    );
  },
});
