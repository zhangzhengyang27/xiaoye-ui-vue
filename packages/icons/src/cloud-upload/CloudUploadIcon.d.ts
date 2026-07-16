import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CloudUploadIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CloudUploadIcon: DefineComponent<CloudUploadIcon>;
  }
}

export default CloudUploadIcon;
