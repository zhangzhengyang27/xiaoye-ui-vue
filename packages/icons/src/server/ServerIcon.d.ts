import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ServerIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ServerIcon: DefineComponent<ServerIcon>;
    }
}

export default ServerIcon;
