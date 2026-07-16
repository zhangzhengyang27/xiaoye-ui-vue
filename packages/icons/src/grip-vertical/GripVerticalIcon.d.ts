import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class GripVerticalIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    GripVerticalIcon: DefineComponent<GripVerticalIcon>;
  }
}

export default GripVerticalIcon;
