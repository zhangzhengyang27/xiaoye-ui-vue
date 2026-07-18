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
import Button from '../button';

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

// 将参考项目的 size（xs/sm/md/lg/xl）映射到 XYButton 的 size（small/middle/large）
function mapButtonSize(size: string | undefined): 'small' | 'middle' | 'large' {
  switch (size) {
    case 'xs':
    case 'sm':
      return 'small';
    case 'lg':
    case 'xl':
      return 'large';
    case 'md':
    default:
      return 'middle';
  }
}

// 将参考项目的 variant（ghost/solid/outline/link/soft）映射到 XYButton 的 type
function mapButtonType(
  variant: string | undefined,
): 'text' | 'default' | 'primary' | 'ghost' | 'dashed' | 'link' {
  switch (variant) {
    case 'link':
      return 'link';
    case 'solid':
      return 'primary';
    case 'outline':
      return 'default';
    case 'soft':
    case 'ghost':
    default:
      // drag handle 默认用 text 类型，避免边框干扰视觉
      return 'text';
  }
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

    // 默认拖拽图标（grip-vertical SVG），与 lucide grip-vertical 一致
    const defaultIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
    );

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
        }) || (
          <Button
            type={mapButtonType(props.variant)}
            size={mapButtonSize(props.size)}
            class="xy-rich-text-editor-drag-handle-default"
            aria-label="Drag to move"
            data-slot="handle"
          >
            {props.icon ? <span innerHTML={props.icon} /> : defaultIcon}
          </Button>
        )}
      </DragHandle>
    );
  },
});
