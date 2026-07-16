import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LanguagesIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LanguagesIcon: DefineComponent<LanguagesIcon>;
  }
}

export default LanguagesIcon;
