import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Redo2Icon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    Redo2Icon: DefineComponent<Redo2Icon>;
  }
}

export default Redo2Icon;
