import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BanknoteIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BanknoteIcon: DefineComponent<BanknoteIcon>;
    }
}

export default BanknoteIcon;
