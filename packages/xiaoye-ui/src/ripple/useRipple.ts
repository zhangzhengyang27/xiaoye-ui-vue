import { computed, onBeforeUnmount, watch, type ComputedRef, type Ref } from 'vue';
import {
  addClass,
  createElement,
  getHeight,
  getOffset,
  getOuterHeight,
  getOuterWidth,
  getWidth,
  removeClass,
} from '@xiaoye-ui/utils/dom';

const INK_CLASS = 'xy-ripple__ink';
const INK_ACTIVE_CLASS = 'xy-ripple__ink--active';
const HOST_CLASS = 'xy-ripple';

let timeout: ReturnType<typeof setTimeout> | undefined;

function getInk(el: HTMLElement): HTMLElement | undefined {
  return el.querySelector(`.${INK_CLASS}`) as HTMLElement | undefined;
}

function createRipple(el: HTMLElement) {
  let ink = getInk(el);

  if (!ink) {
    ink = createElement('span', {
      role: 'presentation',
      'aria-hidden': true,
      class: INK_CLASS,
    }) as HTMLElement;

    ink.addEventListener('animationend', onAnimationEnd);
    el.appendChild(ink);
  }
}

function remove(el: HTMLElement) {
  const ink = getInk(el);

  if (ink) {
    el.style.overflow = '';
    el.style.position = '';

    el.removeEventListener('mousedown', onMouseDown);
    ink.removeEventListener('animationend', onAnimationEnd);
    ink.remove();
  }
}

function onMouseDown(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement;
  const ink = getInk(el);

  if (!ink || getComputedStyle(ink, null).display === 'none') {
    return;
  }

  removeClass(ink, INK_ACTIVE_CLASS);

  if (!getHeight(ink) && !getWidth(ink)) {
    const d = Math.max(getOuterWidth(el), getOuterHeight(el));
    ink.style.height = `${d}px`;
    ink.style.width = `${d}px`;
  }

  const offset = getOffset(el);
  const x = event.pageX - Number(offset.left) + document.body.scrollTop - getWidth(ink) / 2;
  const y = event.pageY - Number(offset.top) + document.body.scrollLeft - getHeight(ink) / 2;

  ink.style.top = `${y}px`;
  ink.style.left = `${x}px`;

  addClass(ink, INK_ACTIVE_CLASS);

  timeout = setTimeout(() => {
    if (ink) {
      removeClass(ink, INK_ACTIVE_CLASS);
    }
  }, 401);
}

function onAnimationEnd(event: AnimationEvent) {
  if (timeout) {
    clearTimeout(timeout);
  }
  const el = event.currentTarget as HTMLElement;
  removeClass(el, INK_ACTIVE_CLASS);
}

function bindEvents(el: HTMLElement) {
  el.addEventListener('mousedown', onMouseDown);
}

/**
 * 在目标元素上启用 ripple 涟漪效果
 * @param target 目标元素的 ref
 * @param enabled 是否启用（响应式 boolean ref，默认为 true）
 *
 * @example
 * const btnRef = ref<HTMLElement>();
 * useRipple(btnRef);
 *
 * // 受控启用/禁用
 * const enabled = ref(true);
 * useRipple(btnRef, enabled);
 */
export function useRipple(
  target: Ref<HTMLElement | undefined | null>,
  enabled?: Ref<boolean> | ComputedRef<boolean>,
) {
  const isEnabled = computed(() => (enabled === undefined ? true : !!enabled.value));

  function apply(el: HTMLElement) {
    createRipple(el);
    bindEvents(el);
    addClass(el, HOST_CLASS);
    el.style.overflow = 'hidden';
    el.style.position = 'relative';
  }

  function clear(el: HTMLElement) {
    remove(el);
    removeClass(el, HOST_CLASS);
  }

  const stop = watch(
    [target, isEnabled] as const,
    ([el, en]) => {
      if (!el) return;
      if (en) {
        apply(el);
      } else {
        clear(el);
      }
    },
    { immediate: true, flush: 'post' },
  );

  onBeforeUnmount(() => {
    stop();
    const el = target.value;
    if (el) {
      clear(el);
    }
  });
}

export { HOST_CLASS as RIPPLE_HOST_CLASS, INK_CLASS as RIPPLE_INK_CLASS };
