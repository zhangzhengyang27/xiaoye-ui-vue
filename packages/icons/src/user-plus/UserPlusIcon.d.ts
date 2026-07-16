import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UserPlusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UserPlusIcon: DefineComponent<UserPlusIcon>;
    }
}

export default UserPlusIcon;
