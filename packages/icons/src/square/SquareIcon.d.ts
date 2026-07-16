import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SquareIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SquareIcon: DefineComponent<SquareIcon>;
    }
}

export default SquareIcon;
