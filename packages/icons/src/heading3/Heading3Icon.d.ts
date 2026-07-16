import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Heading3Icon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        Heading3Icon: DefineComponent<Heading3Icon>;
    }
}

export default Heading3Icon;
