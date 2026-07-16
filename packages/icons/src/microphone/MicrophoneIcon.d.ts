import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MicrophoneIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        MicrophoneIcon: DefineComponent<MicrophoneIcon>;
    }
}

export default MicrophoneIcon;
