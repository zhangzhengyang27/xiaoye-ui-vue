import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CircleMinusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CircleMinusIcon: DefineComponent<CircleMinusIcon>;
    }
}

export default CircleMinusIcon;
