import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MoveIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        MoveIcon: DefineComponent<MoveIcon>;
    }
}

export default MoveIcon;
