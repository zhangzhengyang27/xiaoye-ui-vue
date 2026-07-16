declare module '#imports' {
    export function defineNuxtPlugin(plugin: (nuxtApp: { vueApp: any }) => void): any;
    export function useRuntimeConfig(): any;
}

declare module '@xiaoye-ui/core/config' {
    export interface XiaoyeUIConfiguration {
        [key: string]: any;
    }

    const XiaoyeUI: any;
    export default XiaoyeUI;
}

declare function defineNuxtConfig(config: any): any;
