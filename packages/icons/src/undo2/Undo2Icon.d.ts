import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Undo2Icon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    Undo2Icon: DefineComponent<Undo2Icon>;
  }
}

export default Undo2Icon;
