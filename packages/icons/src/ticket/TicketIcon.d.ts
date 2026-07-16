import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TicketIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TicketIcon: DefineComponent<TicketIcon>;
    }
}

export default TicketIcon;
