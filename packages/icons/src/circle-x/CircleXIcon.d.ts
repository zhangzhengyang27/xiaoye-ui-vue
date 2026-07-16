import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CircleXIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CircleXIcon: DefineComponent<CircleXIcon>;
    }
}

export default CircleXIcon;
