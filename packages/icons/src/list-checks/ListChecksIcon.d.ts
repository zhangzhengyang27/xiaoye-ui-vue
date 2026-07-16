import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ListChecksIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ListChecksIcon: DefineComponent<ListChecksIcon>;
  }
}

export default ListChecksIcon;
