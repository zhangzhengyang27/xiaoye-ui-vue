import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AlignJustifyIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AlignJustifyIcon: DefineComponent<AlignJustifyIcon>;
    }
}

export default AlignJustifyIcon;
