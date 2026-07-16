import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Trash2Icon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    Trash2Icon: DefineComponent<Trash2Icon>;
  }
}

export default Trash2Icon;
