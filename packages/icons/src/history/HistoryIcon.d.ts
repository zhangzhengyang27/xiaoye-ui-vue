import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class HistoryIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    HistoryIcon: DefineComponent<HistoryIcon>;
  }
}

export default HistoryIcon;
