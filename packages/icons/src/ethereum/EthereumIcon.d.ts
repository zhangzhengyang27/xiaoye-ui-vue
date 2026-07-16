import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class EthereumIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        EthereumIcon: DefineComponent<EthereumIcon>;
    }
}

export default EthereumIcon;
