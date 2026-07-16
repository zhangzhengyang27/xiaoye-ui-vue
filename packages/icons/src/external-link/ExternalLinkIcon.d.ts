import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ExternalLinkIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ExternalLinkIcon: DefineComponent<ExternalLinkIcon>;
  }
}

export default ExternalLinkIcon;
