import { isNotEmpty } from '@xiaoye-ui/utils/object';

export interface HelperSetOptions {
  init?: Iterable<any>;
  type?: string;
}

/**
 * HelperSet：管理一组"helper"组件实例，支持按 key 匹配递归查找。
 * 主要用于 Toolbar/Panel 等容器组件通过 #default 插槽收集内部子组件。
 */
export default class HelperSet {
  helpers: Set<any>;
  type: string;

  constructor({ init, type }: HelperSetOptions = {}) {
    this.helpers = new Set(init);
    this.type = type ?? '';
  }

  add(instance: any) {
    this.helpers.add(instance);
  }

  update() {
    // @todo
  }

  delete(instance: any) {
    this.helpers.delete(instance);
  }

  clear() {
    this.helpers.clear();
  }

  get(parentInstance?: any, slots?: any): any[] | null {
    const children = this._get(parentInstance, slots);
    const computed = children ? this._recursive([...this.helpers], children) : null;
    return isNotEmpty(computed) ? computed : null;
  }

  private _isMatched(instance: any, key: any): boolean {
    const parent = instance?.parent;
    return parent?.vnode?.key === key || (parent && this._isMatched(parent, key)) || false;
  }

  private _get(parentInstance?: any, slots?: any) {
    return (slots || parentInstance?.$slots)?.default?.() || null;
  }

  private _recursive(helpers: any[] = [], children: any[] = []): any[] {
    let components: any[] = [];

    children.forEach(child => {
      // 处理嵌套数组（如 JSX slot 编译产物）
      if (Array.isArray(child)) {
        components = components.concat(this._recursive(helpers, child));
        return;
      }

      let childChildren = child.children;

      // 若 child 有 slot 函数（如包裹组件），调用它获取实际渲染子节点
      if (typeof childChildren === 'function') {
        childChildren = childChildren();
      }

      if (childChildren instanceof Array) {
        components = components.concat(this._recursive(helpers, childChildren));
      } else if (child.type?.name === this.type) {
        components.push(child);
      } else if (isNotEmpty(child.key)) {
        const matched = helpers
          .filter(c => this._isMatched(c, child.key))
          .map(c => c.vnode)
          .filter((v: any) => v != null);

        components = components.concat(matched);
      }
    });

    return components;
  }
}
