import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SquareSlashIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SquareSlashIcon: DefineComponent<SquareSlashIcon>;
    }
}

export default SquareSlashIcon;
