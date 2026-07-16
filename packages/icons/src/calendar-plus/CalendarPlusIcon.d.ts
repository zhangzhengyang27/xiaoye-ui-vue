import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CalendarPlusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CalendarPlusIcon: DefineComponent<CalendarPlusIcon>;
    }
}

export default CalendarPlusIcon;
