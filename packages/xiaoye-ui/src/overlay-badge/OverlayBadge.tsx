/// <reference types="vue/jsx" />
import { computed, defineComponent } from 'vue';
import Badge from '../badge';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { overlayBadgeProps } from './overlayBadgeTypes';
import useStyle from './style';

export default defineComponent({
  name: 'XYOverlayBadge',
  inheritAttrs: false,
  __XY_OVERLAY_BADGE: true,
  props: initDefaultProps(overlayBadgeProps(), {}),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('overlay-badge', props);
    const [, hashId] = useStyle(prefixCls);

    // 修复源项目 bug：源项目直接把 value/severity/icon 透传给 Badge，
    // 但目标项目 Badge（Ant Design 风格）只接受 count/status/size/color/text 等。
    // 这里做 API 映射：value -> count；size 'large' -> 'default'（目标 Badge 仅支持 'small' | 'default'）。
    // severity/icon 在目标 Badge 中无对应 API，暂不透传，避免无效 prop 警告。
    const mergedBadgeProps = computed(() => {
      const size: 'default' | 'small' = props.size === 'small' ? 'small' : 'default';
      return {
        count: props.value,
        size,
      };
    });

    return () => (
      <div {...attrs} class={[prefixCls.value, hashId.value, props.class]} style={props.style}>
        {slots.default?.()}
        <Badge {...mergedBadgeProps.value} />
      </div>
    );
  },
});
