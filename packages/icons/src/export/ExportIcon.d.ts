import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ExportIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ExportIcon: DefineComponent<ExportIcon>;
  }
}

export default ExportIcon;
