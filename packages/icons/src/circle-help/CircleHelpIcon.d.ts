import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CircleHelpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CircleHelpIcon: DefineComponent<CircleHelpIcon>;
    }
}

export default CircleHelpIcon;
