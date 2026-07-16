import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SlidersHorizontalIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SlidersHorizontalIcon: DefineComponent<SlidersHorizontalIcon>;
    }
}

export default SlidersHorizontalIcon;
