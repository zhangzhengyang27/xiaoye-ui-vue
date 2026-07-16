import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class StrikethroughIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        StrikethroughIcon: DefineComponent<StrikethroughIcon>;
    }
}

export default StrikethroughIcon;
