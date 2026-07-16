import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SpotifyIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SpotifyIcon: DefineComponent<SpotifyIcon>;
  }
}

export default SpotifyIcon;
