import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ExclamationTriangleIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ExclamationTriangleIcon: DefineComponent<ExclamationTriangleIcon>;
  }
}

export default ExclamationTriangleIcon;
