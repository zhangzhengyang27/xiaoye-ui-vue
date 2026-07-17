import { config } from '@vue/test-utils';
import { TextEncoder, TextDecoder } from 'util';
import { vi } from 'vitest';
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue';

(globalThis as any).vi = vi;

// Custom transition stub that fires lifecycle hooks synchronously based on v-show state.
// This avoids jsdom CSS transition/animation timeouts while preserving the slot DOM.
const TransitionStub = defineComponent({
  name: 'TransitionStub',
  props: ['name', 'appear', 'mode', 'css'],
  emits: ['afterEnter', 'afterLeave', 'beforeEnter', 'beforeLeave', 'enter', 'leave'],
  setup(_props, { slots, emit }) {
    const wrapperRef = ref<HTMLElement>();
    const wasVisible = ref<boolean | null>(null);
    let observer: MutationObserver | null = null;

    const checkVisibility = (force = false) => {
      const el = wrapperRef.value;
      if (!el) return;
      // v-show applies display:none to the slotted element, not the wrapper
      const child = el.firstElementChild as HTMLElement | null;
      const isVisible = child ? child.style.display !== 'none' : true;
      if (wasVisible.value === null) {
        wasVisible.value = isVisible;
        if (isVisible) {
          emit('afterEnter');
        }
        return;
      }
      if (wasVisible.value !== isVisible || force) {
        if (isVisible) {
          emit('afterEnter');
        } else {
          emit('afterLeave');
        }
      }
      wasVisible.value = isVisible;
    };

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
        checkVisibility(true);
      }
    };

    onMounted(() => {
      const el = wrapperRef.value;
      if (el) {
        checkVisibility();
        el.addEventListener('transitionend', onTransitionEnd as EventListener);
        el.addEventListener('animationend', onTransitionEnd as EventListener);
        observer = new MutationObserver(() => checkVisibility());
        observer.observe(el, {
          attributes: true,
          attributeFilter: ['style'],
          subtree: true,
          childList: true,
        });
      }
    });

    onBeforeUnmount(() => {
      observer?.disconnect();
      const el = wrapperRef.value;
      if (el) {
        el.removeEventListener('transitionend', onTransitionEnd as EventListener);
        el.removeEventListener('animationend', onTransitionEnd as EventListener);
      }
    });

    return () => {
      const vnodes = slots.default?.() || [];
      return h('span', { ref: wrapperRef, style: { display: 'contents' } }, vnodes);
    };
  },
});

const TransitionGroupStub = defineComponent({
  name: 'TransitionGroupStub',
  props: ['name', 'appear', 'tag', 'css'],
  setup(props, { slots }) {
    return () => {
      const tag = props.tag || 'span';
      const vnodes = slots.default?.() || [];
      return h(tag, null, vnodes);
    };
  },
});

config.global.stubs = {
  transition: TransitionStub,
  'transition-group': TransitionGroupStub,
};

// Browser globals
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.resizeTo = (width: number, height: number) => {
    window.innerWidth = width || window.innerWidth;
    window.innerHeight = height || window.innerHeight;
    window.dispatchEvent(new Event('resize'));
  };
  window.scrollTo = () => {};

  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({
        matches: query.includes('max-width'),
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
  }

  Object.defineProperty(window, 'TextEncoder', {
    writable: true,
    value: TextEncoder,
  });
  Object.defineProperty(window, 'TextDecoder', {
    writable: true,
    value: TextDecoder,
  });
}

// Polyfills
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = MockResizeObserver;

global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0) as unknown as number;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Disable CSS transitions/animations in tests to avoid jsdom timeout
const style = document.createElement('style');
style.textContent = '* { transition: none !important; animation: none !important; }';
document.head.appendChild(style);

// Mock getComputedStyle to report zero transition duration so Vue Transition fires hooks immediately
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (el, pseudoElt) => {
  const computed = originalGetComputedStyle(el, pseudoElt);
  return new Proxy(computed, {
    get(target, prop: string | symbol) {
      if (prop === 'transitionDuration' || prop === 'transitionDelay') {
        return '0s';
      }
      if (prop === 'animationDuration' || prop === 'animationDelay') {
        return '0s';
      }
      const value = target[prop as keyof CSSStyleDeclaration];
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
};

// Mock Math.random for deterministic tests
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;
