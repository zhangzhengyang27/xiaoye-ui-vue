import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class NetworkIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        NetworkIcon: DefineComponent<NetworkIcon>;
    }
}

export default NetworkIcon;
