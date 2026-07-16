// Re-export components from subdirectory for backward compatibility
export { default as BaseInput } from './BaseInput';
export { default as BaseInputInner } from './BaseInputInner';
export { default as Portal } from './Portal';
export { default as PortalWrapper } from './PortalWrapper';
export { default as ActionButton } from './ActionButton';
export { default as transButton } from './transButton';
export { default as collapseMotion } from './collapseMotion';
export {
  getTransitionProps,
  getTransitionGroupProps,
  getTransitionName,
  getTransitionDirection,
  type SelectCommonPlacement,
  type MotionEvent,
  type MotionEventHandler,
  type MotionEndEventHandler,
  type CSSMotionProps,
} from './transition';
