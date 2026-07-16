import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PinterestIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PinterestIcon: DefineComponent<PinterestIcon>;
    }
}

export default PinterestIcon;
