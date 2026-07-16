import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PrimeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PrimeIcon: DefineComponent<PrimeIcon>;
    }
}

export default PrimeIcon;
