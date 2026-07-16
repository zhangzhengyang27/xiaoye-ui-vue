import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ImageIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ImageIcon: DefineComponent<ImageIcon>;
    }
}

export default ImageIcon;
