import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class DiscordIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        DiscordIcon: DefineComponent<DiscordIcon>;
    }
}

export default DiscordIcon;
