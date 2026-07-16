import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SlackIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SlackIcon: DefineComponent<SlackIcon>;
  }
}

export default SlackIcon;
