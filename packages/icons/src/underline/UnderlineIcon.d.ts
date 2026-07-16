import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UnderlineIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UnderlineIcon: DefineComponent<UnderlineIcon>;
    }
}

export default UnderlineIcon;
