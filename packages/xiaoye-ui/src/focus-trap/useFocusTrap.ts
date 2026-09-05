import { computed, onBeforeUnmount, watch, type ComputedRef, type Ref } from 'vue';
import {
  createElement,
  focus,
  getFirstFocusableElement,
  getLastFocusableElement,
  isFocusableElement,
} from '@xiaoye-ui/utils/dom';
import { isNotEmpty } from '@xiaoye-ui/utils/object';

export interface FocusTrapOptions {
  disabled?: boolean;
  autoFocus?: boolean;
  autoFocusSelector?: string;
  firstFocusableSelector?: string;
  lastFocusableSelector?: string;
  tabIndex?: number;
  onFocusIn?: (event: FocusEvent) => void;
  onFocusOut?: (event: FocusEvent) => void;
}

const HIDDEN_ACCESSIBLE_CLASS = 'xy-hidden-accessible xy-hidden-focusable';

function getComputedSelector(selector?: string) {
  return `:not(.xy-hidden-focusable):not([data-xy-hidden-focusable="true"])${selector ?? ''}`;
}

function createHiddenFocusableElement(
  tabIndex: number,
  onFocus: (event: FocusEvent) => void,
): HTMLElement {
  const el = createElement('span', {
    class: HIDDEN_ACCESSIBLE_CLASS,
    tabIndex,
    role: 'presentation',
    'aria-hidden': true,
    'data-xy-hidden-accessible': true,
    'data-xy-hidden-focusable': true,
  }) as HTMLElement;
  el.addEventListener('focus', onFocus);
  return el;
}

/**
 * 在目标元素上启用焦点陷阱
 * @param target 目标元素的 ref
 * @param options 选项（响应式 ref）
 */
export function useFocusTrap(
  target: Ref<HTMLElement | undefined | null>,
  options?: Ref<FocusTrapOptions | undefined> | ComputedRef<FocusTrapOptions | undefined>,
) {
  const optsComputed = computed(() => (options === undefined ? {} : (options.value ?? {})));
  let firstHidden: HTMLElement | undefined;
  let lastHidden: HTMLElement | undefined;
  let mutationObserver: MutationObserver | undefined;
  let focusInListener: ((event: FocusEvent) => void) | undefined;
  let focusOutListener: ((event: FocusEvent) => void) | undefined;
  // 记录 bind 时绑定的元素，供 unbind 精确解绑（不能依赖 target.value，
  // watch 重跑时它可能已指向新元素）
  let boundEl: HTMLElement | null = null;

  function getOptions() {
    return optsComputed.value;
  }

  function getSelector() {
    const o = getOptions();
    return getComputedSelector(o.firstFocusableSelector ?? o.lastFocusableSelector ?? '');
  }

  function onFirstHiddenFocus(event: FocusEvent) {
    const el = target.value;
    if (!el) return;
    const { currentTarget, relatedTarget } = event;
    const cur = currentTarget as HTMLElement & {
      $_xy_lasthidden?: HTMLElement;
    };
    const focusableElement =
      relatedTarget === cur.$_xy_lasthidden || !el.contains(relatedTarget as Node)
        ? getFirstFocusableElement(el.parentElement!, getSelector())
        : cur.$_xy_lasthidden;
    focus(focusableElement as HTMLElement);
  }

  function onLastHiddenFocus(event: FocusEvent) {
    const el = target.value;
    if (!el) return;
    const { currentTarget, relatedTarget } = event;
    const cur = currentTarget as HTMLElement & {
      $_xy_firsthidden?: HTMLElement;
    };
    const focusableElement =
      relatedTarget === cur.$_xy_firsthidden || !el.contains(relatedTarget as Node)
        ? getLastFocusableElement(el.parentElement!, getSelector())
        : cur.$_xy_firsthidden;
    focus(focusableElement as HTMLElement);
  }

  function createHiddenFocusableElements(el: HTMLElement) {
    const o = getOptions();
    const tabIndex = o.tabIndex ?? 0;
    const firstFocusableSelector = o.firstFocusableSelector ?? '';
    const lastFocusableSelector = o.lastFocusableSelector ?? '';

    firstHidden = createHiddenFocusableElement(tabIndex, onFirstHiddenFocus);
    lastHidden = createHiddenFocusableElement(tabIndex, onLastHiddenFocus);

    (firstHidden as any).$_xy_lasthidden = lastHidden;
    (firstHidden as any).$_xy_focusableselector = firstFocusableSelector;
    firstHidden.setAttribute('data-xy-section', 'firstfocusableelement');

    (lastHidden as any).$_xy_firsthidden = firstHidden;
    (lastHidden as any).$_xy_focusableselector = lastFocusableSelector;
    lastHidden.setAttribute('data-xy-section', 'lastfocusableelement');

    el.prepend(firstHidden);
    el.append(lastHidden);
  }

  function autoElementFocus(el: HTMLElement) {
    const o = getOptions();
    const { autoFocusSelector = '', firstFocusableSelector = '', autoFocus = false } = o;
    let focusableElement = getFirstFocusableElement(
      el,
      `[autofocus]${getComputedSelector(autoFocusSelector)}`,
    );

    if (autoFocus && !focusableElement) {
      focusableElement = getFirstFocusableElement(el, getComputedSelector(firstFocusableSelector));
    }
    focus(focusableElement as HTMLElement);
  }

  function bind(el: HTMLElement) {
    const o = getOptions();
    const { onFocusIn, onFocusOut } = o;

    mutationObserver = new MutationObserver(mutationList => {
      mutationList.forEach(mutation => {
        if (mutation.type === 'childList' && !el.contains(document.activeElement)) {
          const findNextFocusableElement = (_el: Element | null): Element | null => {
            const focusableElement = isFocusableElement(_el as HTMLElement)
              ? isFocusableElement(
                  _el as HTMLElement,
                  getComputedSelector(getOptions().firstFocusableSelector),
                )
                ? _el
                : getFirstFocusableElement(
                    el,
                    getComputedSelector(getOptions().firstFocusableSelector),
                  )
              : getFirstFocusableElement(_el as HTMLElement);
            return isNotEmpty(focusableElement)
              ? focusableElement
              : _el?.nextSibling
                ? findNextFocusableElement(_el.nextSibling as Element)
                : null;
          };
          focus(findNextFocusableElement(mutation.nextSibling as Element) as HTMLElement);
        }
      });
    });

    mutationObserver.observe(el, { childList: true });

    focusInListener = (event: FocusEvent) => onFocusIn && onFocusIn(event);
    focusOutListener = (event: FocusEvent) => onFocusOut && onFocusOut(event);

    el.addEventListener('focusin', focusInListener);
    el.addEventListener('focusout', focusOutListener);
    boundEl = el;
  }

  function unbind() {
    mutationObserver?.disconnect();
    mutationObserver = undefined;

    const el = boundEl;
    boundEl = null;
    if (!el) return;

    if (focusInListener) {
      el.removeEventListener('focusin', focusInListener);
      focusInListener = undefined;
    }
    if (focusOutListener) {
      el.removeEventListener('focusout', focusOutListener);
      focusOutListener = undefined;
    }
  }

  function apply(el: HTMLElement) {
    const o = getOptions();
    if (!o.disabled) {
      createHiddenFocusableElements(el);
      bind(el);
      autoElementFocus(el);
    }
    el.setAttribute('data-xy-focustrap', 'true');
  }

  function clear(el: HTMLElement) {
    unbind();
    firstHidden?.remove();
    lastHidden?.remove();
    firstHidden = undefined;
    lastHidden = undefined;
    el.removeAttribute('data-xy-focustrap');
  }

  const stop = watch(
    [target, optsComputed] as const,
    ([el, _opts], _old, onCleanup) => {
      if (!el) return;
      apply(el);
      onCleanup(() => clear(el));
    },
    { immediate: true, flush: 'post' },
  );

  onBeforeUnmount(() => {
    stop();
    const el = target.value;
    if (el) clear(el);
  });
}
