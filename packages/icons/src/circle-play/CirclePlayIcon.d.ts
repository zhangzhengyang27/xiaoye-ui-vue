import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CirclePlayIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CirclePlayIcon: DefineComponent<CirclePlayIcon>;
    }
}

export default CirclePlayIcon;
