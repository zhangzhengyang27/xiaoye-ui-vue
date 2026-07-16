import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CloudDownloadIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CloudDownloadIcon: DefineComponent<CloudDownloadIcon>;
    }
}

export default CloudDownloadIcon;
