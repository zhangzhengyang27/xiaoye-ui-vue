import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Repeat2Icon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    Repeat2Icon: DefineComponent<Repeat2Icon>;
  }
}

export default Repeat2Icon;
