import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Loader2Icon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        Loader2Icon: DefineComponent<Loader2Icon>;
    }
}

export default Loader2Icon;
