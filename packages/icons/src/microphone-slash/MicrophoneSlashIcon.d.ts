import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MicrophoneSlashIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        MicrophoneSlashIcon: DefineComponent<MicrophoneSlashIcon>;
    }
}

export default MicrophoneSlashIcon;
