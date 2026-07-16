import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class VideoIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        VideoIcon: DefineComponent<VideoIcon>;
    }
}

export default VideoIcon;
