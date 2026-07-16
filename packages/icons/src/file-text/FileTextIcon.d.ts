import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FileTextIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    FileTextIcon: DefineComponent<FileTextIcon>;
  }
}

export default FileTextIcon;
