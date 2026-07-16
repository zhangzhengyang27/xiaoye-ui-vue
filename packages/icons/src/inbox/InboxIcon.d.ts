import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class InboxIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        InboxIcon: DefineComponent<InboxIcon>;
    }
}

export default InboxIcon;
