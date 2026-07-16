import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BarChart3Icon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    BarChart3Icon: DefineComponent<BarChart3Icon>;
  }
}

export default BarChart3Icon;
