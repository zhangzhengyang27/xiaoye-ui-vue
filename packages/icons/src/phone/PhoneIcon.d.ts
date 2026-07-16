import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PhoneIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PhoneIcon: DefineComponent<PhoneIcon>;
    }
}

export default PhoneIcon;
