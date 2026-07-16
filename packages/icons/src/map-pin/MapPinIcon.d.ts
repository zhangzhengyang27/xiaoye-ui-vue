import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MapPinIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        MapPinIcon: DefineComponent<MapPinIcon>;
    }
}

export default MapPinIcon;
