import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class RedditIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    RedditIcon: DefineComponent<RedditIcon>;
  }
}

export default RedditIcon;
