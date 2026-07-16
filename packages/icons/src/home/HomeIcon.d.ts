import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class HomeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        HomeIcon: DefineComponent<HomeIcon>;
    }
}

export default HomeIcon;
