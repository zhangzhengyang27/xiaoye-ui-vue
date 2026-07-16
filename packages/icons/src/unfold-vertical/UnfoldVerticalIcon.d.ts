import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class UnfoldVerticalIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UnfoldVerticalIcon: DefineComponent<UnfoldVerticalIcon>;
    }
}

export default UnfoldVerticalIcon;
