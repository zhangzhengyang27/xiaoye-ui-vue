import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class RefreshCwIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        RefreshCwIcon: DefineComponent<RefreshCwIcon>;
    }
}

export default RefreshCwIcon;
