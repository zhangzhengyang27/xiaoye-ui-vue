import { UpOutlined } from '@xiaoye-ui/icons';
import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import getScroll from '../_util/getScroll';
import scrollTo from '../_util/scrollTo';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import { initDefaultProps } from '../_util/props-util';
import { backTopProps } from './backTopTypes';

import useStyle from './style';

const BackTop = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'XYBackTop',
  inheritAttrs: false,
  __XY_BACK_TOP: true,
  props: initDefaultProps(backTopProps(), {
    visibilityHeight: 400,
    duration: 450,
  }),
  emits: ['click'],
  setup(props, { slots, attrs, emit, expose }) {
    const { prefixCls, direction } = useConfigInject('back-top', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const domRef = ref<HTMLElement | null>(null);
    const state = reactive({
      visible: props.visibilityHeight === 0,
    });

    // SSR 安全：基于组件 DOM 的 ownerDocument 获取默认滚动容器
    const getDefaultTarget = () =>
      domRef.value && domRef.value.ownerDocument ? domRef.value.ownerDocument : window;

    // 平滑滚动到顶部
    const scrollToTop = (e: Event) => {
      const { target = getDefaultTarget, duration } = props;
      scrollTo(0, {
        getContainer: target,
        duration,
      });
      emit('click', e);
    };

    // 滚动事件处理：throttle 到 raf，立即提取 target 避免事件对象在异步回调中被重置
    const handleScroll = throttleByAnimationFrame((target: HTMLElement | Window | Document) => {
      const { visibilityHeight } = props;
      const scrollTop = getScroll(target, true);
      state.visible = scrollTop >= visibilityHeight;
    });

    const onScroll = (e: Event) => {
      handleScroll(e.target as HTMLElement | Window | Document);
    };

    const bindScrollEvent = () => {
      const { target } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll(container);
      container?.addEventListener('scroll', onScroll);
    };

    const scrollRemove = () => {
      const { target } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll.cancel();
      container?.removeEventListener('scroll', onScroll);
    };

    watch(
      () => props.target,
      () => {
        scrollRemove();
        nextTick(() => {
          bindScrollEvent();
        });
      },
    );

    onMounted(() => {
      nextTick(() => {
        bindScrollEvent();
      });
    });

    onActivated(() => {
      nextTick(() => {
        bindScrollEvent();
      });
    });

    onDeactivated(() => {
      scrollRemove();
    });

    onBeforeUnmount(() => {
      scrollRemove();
    });

    expose({
      visible: state,
      scrollToTop,
    });

    const classString = computed(() =>
      classNames(prefixCls.value, hashId.value, attrs.class, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-visible`]: state.visible,
      }),
    );

    return () =>
      wrapSSR(
        <div
          {...attrs}
          ref={domRef}
          class={classString.value}
          role="button"
          tabindex={state.visible ? 0 : -1}
          aria-label="back to top"
          onClick={scrollToTop}
        >
          {slots.default ? (
            slots.default()
          ) : (
            <div class={`${prefixCls.value}-content`}>
              <UpOutlined class={`${prefixCls.value}-icon`} />
            </div>
          )}
        </div>,
      );
  },
});

export default BackTop;
