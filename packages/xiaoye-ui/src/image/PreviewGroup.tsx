import type { PreviewGroupPreview } from '../vc-image/src/PreviewGroup';
import PreviewGroup from '../vc-image/src/PreviewGroup';
import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';

import {
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  SwapOutlined,
} from '@xiaoye-ui/icons';
import { getTransitionName } from '../_util/transition';
import useStyle from './style';
import { anyType } from '../_util/type';

export const icons = {
  rotateLeft: <RotateLeftOutlined />,
  rotateRight: <RotateRightOutlined />,
  zoomIn: <ZoomInOutlined />,
  zoomOut: <ZoomOutOutlined />,
  close: <CloseOutlined />,
  left: <LeftOutlined />,
  right: <RightOutlined />,
  flipX: <SwapOutlined />,
  flipY: <SwapOutlined rotate={90} />,
};
const previewGroupProps = () => ({
  previewPrefixCls: String,
  preview: anyType<boolean | PreviewGroupPreview>(),
});
export type ImageGroupProps = Partial<ExtractPropTypes<ReturnType<typeof previewGroupProps>>>;

const InternalPreviewGroup = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: previewGroupProps(),
  setup(props, { attrs, slots }) {
    const { prefixCls, rootPrefixCls } = useConfigInject('image', props);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedPreview = computed(() => {
      const { preview } = props;
      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' ? preview : {};

      return {
        ..._preview,
        rootClassName: hashId.value,
        transitionName: getTransitionName(rootPrefixCls.value, 'zoom', _preview.transitionName),
        maskTransitionName: getTransitionName(
          rootPrefixCls.value,
          'fade',
          _preview.maskTransitionName,
        ),
      };
    });
    return () => {
      return wrapSSR(
        <PreviewGroup
          {...{ ...attrs, ...props }}
          preview={mergedPreview.value}
          icons={icons}
          previewPrefixCls={previewPrefixCls.value}
          v-slots={slots}
        ></PreviewGroup>,
      );
    };
  },
});
export default InternalPreviewGroup;
