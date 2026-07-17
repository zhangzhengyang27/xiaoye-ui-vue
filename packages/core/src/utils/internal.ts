import type { VNode } from 'vue';

/**
 * ConnectedOverlayScrollHandler：监听元素所有可滚动父级的 scroll 事件，
 * 用于 overlay 类组件（如 Popover、Dropdown）在父级滚动时自动隐藏。
 */
export class ConnectedOverlayScrollHandler {
  element: HTMLElement;
  callback: () => void;
  scrollableParents: HTMLElement[] = [];

  constructor(element: HTMLElement, callback: () => void = () => {}) {
    this.element = element;
    this.callback = callback;
    this.scrollableParents = [];
  }

  bindScrollListener() {
    this.scrollableParents = this.getScrollableParents(this.element);
    for (let i = 0; i < this.scrollableParents.length; i++) {
      this.scrollableParents[i].addEventListener('scroll', this.callback);
    }
  }

  unbindScrollListener() {
    for (let i = 0; i < this.scrollableParents.length; i++) {
      this.scrollableParents[i].removeEventListener('scroll', this.callback);
    }
  }

  getScrollableParents(element: HTMLElement | null): HTMLElement[] {
    const scrollableParents: HTMLElement[] = [];

    if (!element) {
      return scrollableParents;
    }

    const getOverflow = (el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      const overflow = style.overflow;
      const overflowX = style.overflowX;
      const overflowY = style.overflowY;
      const overflowValues = ['auto', 'scroll'];

      return (
        overflowValues.indexOf(overflow) !== -1 ||
        overflowValues.indexOf(overflowX) !== -1 ||
        overflowValues.indexOf(overflowY) !== -1
      );
    };

    let parent = element.parentElement;

    while (parent) {
      if (getOverflow(parent)) {
        scrollableParents.push(parent);
      }
      parent = parent.parentElement;
    }

    // window 也作为可滚动父级，由调用方按需处理（这里不 push window）
    return scrollableParents;
  }
}

/**
 * getVNodeProp：从 VNode 中安全读取 prop 值
 * - 兼容 kebab-case 与 camelCase
 * - 兼容 Boolean 类型在 kebab 写法下的 "" → true 转换
 */
export function getVNodeProp(vnode: VNode | undefined, prop: string): any {
  if (vnode) {
    const props = vnode.props as Record<string, any> | undefined;

    if (props) {
      const kebabProp = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const propName = Object.prototype.hasOwnProperty.call(props, kebabProp) ? kebabProp : prop;

      // 兼容 defineComponent（.ts）与 Options API（.vue）
      const typeProps = (vnode.type as any).props || (vnode.type as any).extends?.props;

      // 修复：同时支持 Boolean 简写（expander: Boolean）和对象写法（expander: { type: Boolean }）
      const propDef = typeProps?.[prop];
      const isBooleanProp = propDef === Boolean || propDef?.type === Boolean;

      return isBooleanProp && props[propName] === '' ? true : props[propName];
    }
  }

  return null;
}
