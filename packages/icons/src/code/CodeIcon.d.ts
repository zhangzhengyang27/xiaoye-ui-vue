import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CodeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CodeIcon: DefineComponent<CodeIcon>;
    }
}

export default CodeIcon;
