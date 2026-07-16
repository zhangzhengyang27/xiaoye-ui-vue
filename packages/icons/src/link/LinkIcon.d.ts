import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LinkIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LinkIcon: DefineComponent<LinkIcon>;
  }
}

export default LinkIcon;
