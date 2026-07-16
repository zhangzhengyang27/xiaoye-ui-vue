import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UploadIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    UploadIcon: DefineComponent<UploadIcon>;
  }
}

export default UploadIcon;
