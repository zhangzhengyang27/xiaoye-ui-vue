import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class DownloadIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        DownloadIcon: DefineComponent<DownloadIcon>;
    }
}

export default DownloadIcon;
