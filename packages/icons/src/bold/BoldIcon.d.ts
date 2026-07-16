import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BoldIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BoldIcon: DefineComponent<BoldIcon>;
    }
}

export default BoldIcon;
