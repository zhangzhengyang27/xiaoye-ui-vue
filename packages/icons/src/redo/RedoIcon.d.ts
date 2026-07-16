import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class RedoIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        RedoIcon: DefineComponent<RedoIcon>;
    }
}

export default RedoIcon;
