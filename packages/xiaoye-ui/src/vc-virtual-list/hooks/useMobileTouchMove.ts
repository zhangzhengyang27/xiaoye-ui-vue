import type { Ref } from 'vue';
import { onBeforeUnmount, watch, onMounted } from 'vue';

const SMOOTH_PTG = 14 / 15;
export default function useMobileTouchMove(
  inVirtual: Ref<boolean>,
  listRef: Ref<HTMLDivElement | undefined>,
  callback: (offsetY: number, smoothOffset?: boolean) => boolean,
) {
  let touched = false;
  let touchY = 0;

  let element: HTMLElement | null = null;

  // Smooth scroll
  let interval: any = null;

  const cleanUpEvents = () => {
    if (element) {
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (touched) {
      const currentY = Math.ceil(e.touches[0].pageY);
      let offsetY = touchY - currentY;
      touchY = currentY;

      if (callback(offsetY)) {
        e.preventDefault();
      }

      // Smooth interval
      clearInterval(interval);
      interval = setInterval(() => {
        offsetY *= SMOOTH_PTG;

        if (!callback(offsetY, true) || Math.abs(offsetY) <= 0.1) {
          clearInterval(interval);
        }
      }, 16);
    }
  };

  const onTouchEnd = () => {
    touched = false;

    cleanUpEvents();
  };

  const onTouchStart = (e: TouchEvent) => {
    cleanUpEvents();

    if (e.touches.length === 1 && !touched) {
      touched = true;
      touchY = Math.ceil(e.touches[0].pageY);

      element = e.target as HTMLElement;
      element!.addEventListener('touchmove', onTouchMove, { passive: false });
      element!.addEventListener('touchend', onTouchEnd);
    }
  };
  const noop = () => {};

  onMounted(() => {
    document.addEventListener('touchmove', noop, { passive: false });
    watch(
      inVirtual,
      val => {
        listRef.value.removeEventListener('touchstart', onTouchStart);
        cleanUpEvents();
        clearInterval(interval);
        if (val) {
          listRef.value.addEventListener('touchstart', onTouchStart, { passive: false });
        }
      },
      { immediate: true },
    );
  });
  onBeforeUnmount(() => {
    document.removeEventListener('touchmove', noop);
    // 卸载时同步清理惯性滚动定时器与元素监听，
    // 否则回调仍会在一段时间内操作已卸载组件的滚动状态
    clearInterval(interval);
    interval = null;
    listRef.value?.removeEventListener('touchstart', onTouchStart);
    cleanUpEvents();
    element = null;
  });
}
