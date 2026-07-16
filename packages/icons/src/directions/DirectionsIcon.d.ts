import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class DirectionsIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        DirectionsIcon: DefineComponent<DirectionsIcon>;
    }
}

export default DirectionsIcon;
