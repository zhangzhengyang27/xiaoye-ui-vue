import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PrinterIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    PrinterIcon: DefineComponent<PrinterIcon>;
  }
}

export default PrinterIcon;
