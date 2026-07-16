import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UserMinusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UserMinusIcon: DefineComponent<UserMinusIcon>;
    }
}

export default UserMinusIcon;
