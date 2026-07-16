import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SmartphoneIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SmartphoneIcon: DefineComponent<SmartphoneIcon>;
    }
}

export default SmartphoneIcon;
