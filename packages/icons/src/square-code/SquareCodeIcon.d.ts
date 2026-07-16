import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SquareCodeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SquareCodeIcon: DefineComponent<SquareCodeIcon>;
    }
}

export default SquareCodeIcon;
