import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TimesIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    TimesIcon: DefineComponent<TimesIcon>;
  }
}

export default TimesIcon;
