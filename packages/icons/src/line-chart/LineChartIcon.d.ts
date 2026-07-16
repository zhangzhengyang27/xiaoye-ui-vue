import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LineChartIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LineChartIcon: DefineComponent<LineChartIcon>;
  }
}

export default LineChartIcon;
