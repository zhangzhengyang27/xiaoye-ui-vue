import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ItalicIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ItalicIcon: DefineComponent<ItalicIcon>;
    }
}

export default ItalicIcon;
