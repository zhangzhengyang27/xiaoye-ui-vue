import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ThumbsDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ThumbsDownIcon: DefineComponent<ThumbsDownIcon>;
    }
}

export default ThumbsDownIcon;
