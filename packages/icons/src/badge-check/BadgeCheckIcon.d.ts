import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BadgeCheckIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BadgeCheckIcon: DefineComponent<BadgeCheckIcon>;
    }
}

export default BadgeCheckIcon;
