import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FileEditIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FileEditIcon: DefineComponent<FileEditIcon>;
    }
}

export default FileEditIcon;
