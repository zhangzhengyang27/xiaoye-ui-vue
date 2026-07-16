import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AngleDoubleRightIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    AngleDoubleRightIcon: DefineComponent<AngleDoubleRightIcon>;
  }
}

export default AngleDoubleRightIcon;
