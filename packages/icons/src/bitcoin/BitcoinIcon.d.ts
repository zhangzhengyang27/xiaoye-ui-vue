import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BitcoinIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BitcoinIcon: DefineComponent<BitcoinIcon>;
    }
}

export default BitcoinIcon;
