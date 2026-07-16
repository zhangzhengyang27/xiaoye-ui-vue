import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AlignRightIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AlignRightIcon: DefineComponent<AlignRightIcon>;
    }
}

export default AlignRightIcon;
