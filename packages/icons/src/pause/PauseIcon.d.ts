import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PauseIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PauseIcon: DefineComponent<PauseIcon>;
    }
}

export default PauseIcon;
