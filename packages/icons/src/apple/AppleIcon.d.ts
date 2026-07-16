import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AppleIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AppleIcon: DefineComponent<AppleIcon>;
    }
}

export default AppleIcon;
