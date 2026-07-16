import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SmileFillIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SmileFillIcon: DefineComponent<SmileFillIcon>;
    }
}

export default SmileFillIcon;
