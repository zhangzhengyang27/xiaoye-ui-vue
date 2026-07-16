import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SearchPlusIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SearchPlusIcon: DefineComponent<SearchPlusIcon>;
  }
}

export default SearchPlusIcon;
