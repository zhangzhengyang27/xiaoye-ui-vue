import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TypeIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    TypeIcon: DefineComponent<TypeIcon>;
  }
}

export default TypeIcon;
