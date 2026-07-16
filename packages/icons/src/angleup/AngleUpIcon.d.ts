import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AngleUpIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    AngleUpIcon: DefineComponent<AngleUpIcon>;
  }
}

export default AngleUpIcon;
