import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ShieldCheckIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ShieldCheckIcon: DefineComponent<ShieldCheckIcon>;
    }
}

export default ShieldCheckIcon;
