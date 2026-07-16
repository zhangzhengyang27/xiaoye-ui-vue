import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FoldVerticalIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FoldVerticalIcon: DefineComponent<FoldVerticalIcon>;
    }
}

export default FoldVerticalIcon;
