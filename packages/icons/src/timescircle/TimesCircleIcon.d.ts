import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TimesCircleIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    TimesCircleIcon: DefineComponent<TimesCircleIcon>;
  }
}

export default TimesCircleIcon;
