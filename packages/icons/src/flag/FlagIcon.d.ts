import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FlagIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FlagIcon: DefineComponent<FlagIcon>;
    }
}

export default FlagIcon;
