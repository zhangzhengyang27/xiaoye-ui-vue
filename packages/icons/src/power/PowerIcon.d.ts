import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PowerIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PowerIcon: DefineComponent<PowerIcon>;
    }
}

export default PowerIcon;
