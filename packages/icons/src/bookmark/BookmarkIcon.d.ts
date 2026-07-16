import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BookmarkIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    BookmarkIcon: DefineComponent<BookmarkIcon>;
  }
}

export default BookmarkIcon;
