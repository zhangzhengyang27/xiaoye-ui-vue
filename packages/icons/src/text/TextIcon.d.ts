import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TextIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TextIcon: DefineComponent<TextIcon>;
    }
}

export default TextIcon;
