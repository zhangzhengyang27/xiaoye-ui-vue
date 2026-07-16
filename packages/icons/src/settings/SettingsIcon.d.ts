import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SettingsIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SettingsIcon: DefineComponent<SettingsIcon>;
  }
}

export default SettingsIcon;
