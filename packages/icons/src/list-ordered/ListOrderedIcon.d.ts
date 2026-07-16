import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ListOrderedIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ListOrderedIcon: DefineComponent<ListOrderedIcon>;
    }
}

export default ListOrderedIcon;
