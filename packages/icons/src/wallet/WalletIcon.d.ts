import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class WalletIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        WalletIcon: DefineComponent<WalletIcon>;
    }
}

export default WalletIcon;
