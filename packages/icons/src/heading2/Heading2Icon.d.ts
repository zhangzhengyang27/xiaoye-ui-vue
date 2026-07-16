import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Heading2Icon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        Heading2Icon: DefineComponent<Heading2Icon>;
    }
}

export default Heading2Icon;
