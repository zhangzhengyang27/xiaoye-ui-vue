import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TabletIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TabletIcon: DefineComponent<TabletIcon>;
    }
}

export default TabletIcon;
