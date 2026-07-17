// Core utils：补充迁移组件所需的工具函数与类

// 工具类
export { default as HelperSet } from './HelperSet';
export type { HelperSetOptions } from './HelperSet';
export { ConnectedOverlayScrollHandler, getVNodeProp } from './internal';

/**
 * EventBus 占位实现：旧版本 core 包内置了一个 EventBus 类，
 * 现已被 @xiaoye-ui/utils/eventbus 取代，这里保留以避免破坏老调用方。
 */
class EventBusClass {
  private handlers = new Map<string, Array<(evt: unknown) => void>>();
  on(type: string, handler: (evt: unknown) => void) {
    const arr = this.handlers.get(type) ?? [];
    arr.push(handler);
    this.handlers.set(type, arr);
    return this;
  }
  off(type: string, handler: (evt: unknown) => void) {
    const arr = this.handlers.get(type);
    if (arr) {
      const i = arr.indexOf(handler);
      if (i !== -1) arr.splice(i, 1);
    }
    return this;
  }
  emit(type: string, evt?: unknown) {
    this.handlers.get(type)?.forEach(h => h(evt));
  }
  clear() {
    this.handlers.clear();
  }
}
export function EventBus() {
  return new EventBusClass();
}
export default EventBus();
