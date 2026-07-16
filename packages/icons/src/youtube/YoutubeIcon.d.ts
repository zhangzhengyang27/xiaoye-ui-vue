import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class YoutubeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        YoutubeIcon: DefineComponent<YoutubeIcon>;
    }
}

export default YoutubeIcon;
