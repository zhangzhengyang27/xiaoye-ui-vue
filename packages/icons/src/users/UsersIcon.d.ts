import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UsersIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UsersIcon: DefineComponent<UsersIcon>;
    }
}

export default UsersIcon;
