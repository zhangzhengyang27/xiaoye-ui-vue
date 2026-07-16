import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SolutionIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SolutionIcon: DefineComponent<SolutionIcon>;
    }
}

export default SolutionIcon;
