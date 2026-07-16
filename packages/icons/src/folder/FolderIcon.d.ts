import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FolderIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FolderIcon: DefineComponent<FolderIcon>;
    }
}

export default FolderIcon;
