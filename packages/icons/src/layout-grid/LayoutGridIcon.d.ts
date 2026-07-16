import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LayoutGridIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        LayoutGridIcon: DefineComponent<LayoutGridIcon>;
    }
}

export default LayoutGridIcon;
