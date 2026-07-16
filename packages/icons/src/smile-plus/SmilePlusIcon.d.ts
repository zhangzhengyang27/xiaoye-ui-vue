import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SmilePlusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SmilePlusIcon: DefineComponent<SmilePlusIcon>;
    }
}

export default SmilePlusIcon;
