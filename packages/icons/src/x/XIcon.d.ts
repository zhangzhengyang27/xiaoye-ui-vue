import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class XIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        XIcon: DefineComponent<XIcon>;
    }
}

export default XIcon;
