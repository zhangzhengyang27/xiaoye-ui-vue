import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Volume2Icon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    Volume2Icon: DefineComponent<Volume2Icon>;
  }
}

export default Volume2Icon;
