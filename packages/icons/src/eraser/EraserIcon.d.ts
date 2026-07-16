import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class EraserIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        EraserIcon: DefineComponent<EraserIcon>;
    }
}

export default EraserIcon;
