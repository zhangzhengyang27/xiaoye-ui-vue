import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UnlockIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UnlockIcon: DefineComponent<UnlockIcon>;
    }
}

export default UnlockIcon;
