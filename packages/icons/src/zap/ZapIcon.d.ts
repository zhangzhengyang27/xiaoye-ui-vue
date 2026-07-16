import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ZapIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ZapIcon: DefineComponent<ZapIcon>;
    }
}

export default ZapIcon;
