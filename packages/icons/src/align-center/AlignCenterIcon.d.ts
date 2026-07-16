import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AlignCenterIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AlignCenterIcon: DefineComponent<AlignCenterIcon>;
    }
}

export default AlignCenterIcon;
