import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ArrowUpNarrowWideIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ArrowUpNarrowWideIcon: DefineComponent<ArrowUpNarrowWideIcon>;
    }
}

export default ArrowUpNarrowWideIcon;
