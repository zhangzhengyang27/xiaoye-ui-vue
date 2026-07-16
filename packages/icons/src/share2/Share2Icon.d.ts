import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class Share2Icon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        Share2Icon: DefineComponent<Share2Icon>;
    }
}

export default Share2Icon;
