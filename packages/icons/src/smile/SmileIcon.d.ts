import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SmileIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SmileIcon: DefineComponent<SmileIcon>;
    }
}

export default SmileIcon;
