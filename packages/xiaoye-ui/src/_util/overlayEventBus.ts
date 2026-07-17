import { EventBus } from '@xiaoye-ui/utils/eventbus';

/**
 * Overlay 组件共享事件总线单例
 * 用于 overlay 类组件（如 ColorPicker、AutoComplete）协调滚动/隐藏行为
 */
const OverlayEventBus = EventBus();

export default OverlayEventBus;
