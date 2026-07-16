import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class GithubIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        GithubIcon: DefineComponent<GithubIcon>;
    }
}

export default GithubIcon;
