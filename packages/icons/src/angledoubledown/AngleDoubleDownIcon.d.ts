import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AngleDoubleDownIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    AngleDoubleDownIcon: DefineComponent<AngleDoubleDownIcon>;
  }
}

export default AngleDoubleDownIcon;
