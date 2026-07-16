import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Heading4Icon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        Heading4Icon: DefineComponent<Heading4Icon>;
    }
}

export default Heading4Icon;
