import type { App, Plugin } from 'vue';
import Skeleton from './Skeleton';
import SkeletonButton from './Button';
import SkeletonInput from './Input';
import SkeletonImage from './Image';
import SkeletonAvatar from './Avatar';
import SkeletonTitle from './Title';
import { registerComponent } from '../_util/registerComponent';
export type { SkeletonButtonProps } from './Button';
export type { SkeletonInputProps } from './Input';
export type { SkeletonImageProps } from './Image';
export type { SkeletonAvatarProps } from './Avatar';
export type { SkeletonTitleProps } from './Title';

export type { SkeletonProps } from './Skeleton';
export { skeletonProps } from './Skeleton';

Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Title = SkeletonTitle;

/* istanbul ignore next */
Skeleton.install = function (app: App) {
  registerComponent(app, Skeleton);
  registerComponent(app, SkeletonButton);
  registerComponent(app, SkeletonAvatar);
  registerComponent(app, SkeletonInput);
  registerComponent(app, SkeletonImage);
  registerComponent(app, SkeletonTitle);
  return app;
};
export { SkeletonButton, SkeletonAvatar, SkeletonInput, SkeletonImage, SkeletonTitle };
export default Skeleton as typeof Skeleton &
  Plugin & {
    readonly Button: typeof SkeletonButton;
    readonly Avatar: typeof SkeletonAvatar;
    readonly Input: typeof SkeletonInput;
    readonly Image: typeof SkeletonImage;
  };
