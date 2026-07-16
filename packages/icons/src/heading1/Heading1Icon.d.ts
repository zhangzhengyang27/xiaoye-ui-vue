import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Heading1Icon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        Heading1Icon: DefineComponent<Heading1Icon>;
    }
}

export default Heading1Icon;
