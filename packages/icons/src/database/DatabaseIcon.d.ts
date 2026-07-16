import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class DatabaseIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        DatabaseIcon: DefineComponent<DatabaseIcon>;
    }
}

export default DatabaseIcon;
