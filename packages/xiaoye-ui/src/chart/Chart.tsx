/// <reference types="vue/jsx" />
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import chartProps from './chartTypes';

export default defineComponent({
  name: 'XYChart',
  inheritAttrs: false,
  __XY_CHART: true,
  props: initDefaultProps(chartProps(), {}),
  emits: ['select', 'loaded'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('chart', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // SSR 安全：仅浏览器端可访问 document/window
    const isClient = typeof window !== 'undefined' && !!window.document;

    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let chart: any = null;

    function initChart() {
      if (!isClient) return;
      import('chart.js/auto').then(module => {
        if (chart) {
          chart.destroy();
          chart = null;
        }

        if (module && module.default && canvasRef.value) {
          // chart.js 构造参数类型较为严格，这里放宽为 any 避免侵入业务类型
          const config: any = {
            type: props.type,
            data: props.data,
            options: props.options,
            plugins: props.plugins,
          };
          chart = new module.default(canvasRef.value, config);
        }

        emit('loaded', chart);
      });
    }

    function getCanvas() {
      return canvasRef.value;
    }

    function getChart() {
      return chart;
    }

    function getBase64Image() {
      return chart ? chart.toBase64Image() : null;
    }

    function refresh() {
      if (chart) {
        chart.update();
      }
    }

    function reinit() {
      initChart();
    }

    function onCanvasClick(event: Event) {
      if (chart) {
        const element = chart.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          false,
        );
        const dataset = chart.getElementsAtEventForMode(
          event,
          'dataset',
          { intersect: true },
          false,
        );

        if (element && element[0] && dataset) {
          emit('select', { originalEvent: event, element: element[0], dataset });
        }
      }
    }

    function generateLegend() {
      if (chart) {
        return chart.generateLegend();
      }
      return null;
    }

    watch(
      () => props.data,
      () => {
        reinit();
      },
      { deep: true },
    );

    watch(
      () => props.type,
      () => {
        reinit();
      },
    );

    watch(
      () => props.options,
      () => {
        reinit();
      },
      { deep: true },
    );

    // 客户端初始化
    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    });

    expose({
      getCanvas,
      getChart,
      getBase64Image,
      refresh,
      reinit,
      generateLegend,
    });

    return () =>
      wrapSSR(
        <div class={[prefixCls.value, hashId.value]}>
          <canvas
            ref={canvasRef}
            class={`${prefixCls.value}-canvas`}
            width={props.width}
            height={props.height}
            onClick={onCanvasClick}
            {...props.canvasProps}
          />
        </div>,
      );
  },
});
