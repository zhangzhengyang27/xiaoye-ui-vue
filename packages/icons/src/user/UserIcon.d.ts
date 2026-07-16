import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UserIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    UserIcon: DefineComponent<UserIcon>;
  }
}

export default UserIcon;
