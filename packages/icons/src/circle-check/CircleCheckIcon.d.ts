import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CircleCheckIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CircleCheckIcon: DefineComponent<CircleCheckIcon>;
    }
}

export default CircleCheckIcon;
