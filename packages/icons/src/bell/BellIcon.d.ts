import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BellIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BellIcon: DefineComponent<BellIcon>;
    }
}

export default BellIcon;
