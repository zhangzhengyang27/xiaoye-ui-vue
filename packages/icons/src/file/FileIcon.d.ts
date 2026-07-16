import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FileIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FileIcon: DefineComponent<FileIcon>;
    }
}

export default FileIcon;
