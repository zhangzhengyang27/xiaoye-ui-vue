import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MonitorIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MonitorIcon: DefineComponent<MonitorIcon>;
  }
}

export default MonitorIcon;
