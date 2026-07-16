import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FolderOpenIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FolderOpenIcon: DefineComponent<FolderOpenIcon>;
    }
}

export default FolderOpenIcon;
