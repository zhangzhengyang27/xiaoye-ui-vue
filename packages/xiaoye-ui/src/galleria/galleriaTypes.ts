import type { ExtractPropTypes, ButtonHTMLAttributes, HTMLAttributes } from 'vue';
import { anyType, arrayType, booleanType, stringType } from '../_util/type';

export type GalleriaPositionType = 'top' | 'bottom' | 'left' | 'right';

export interface GalleriaResponsiveOptions {
  /**
   * Breakpoint for responsive mode. Exp; @media screen and (max-width: ${breakpoint}) {...}
   */
  breakpoint: string;
  /**
   * The number of visible items on breakpoint.
   */
  numVisible: number;
}

export const galleriaProps = () => ({
  prefixCls: String,
  /**
   * An array of objects to display.
   */
  value: arrayType<any[] | null>(null),
  /**
   * Index of the first item.
   * @defaultValue 0
   */
  activeIndex: { type: Number, default: 0 },
  /**
   * Whether to display the component on fullscreen.
   * @defaultValue false
   */
  fullScreen: booleanType(false),
  /**
   * Specifies the visibility of the mask on fullscreen mode.
   * @defaultValue false
   */
  visible: booleanType(false),
  /**
   * Number of items per page.
   * @defaultValue 3
   */
  numVisible: { type: Number, default: 3 },
  /**
   * An array of options for responsive design.
   */
  responsiveOptions: arrayType<GalleriaResponsiveOptions[] | null>(null),
  /**
   * Whether to display navigation buttons in item section.
   * @defaultValue false
   */
  showItemNavigators: booleanType(false),
  /**
   * Whether to display navigation buttons in thumbnail container.
   * @defaultValue true
   */
  showThumbnailNavigators: booleanType(true),
  /**
   * Whether to display navigation buttons on item hover.
   * @defaultValue false
   */
  showItemNavigatorsOnHover: booleanType(false),
  /**
   * When enabled, item is changed on indicator hover.
   * @defaultValue false
   */
  changeItemOnIndicatorHover: booleanType(false),
  /**
   * Defines if scrolling would be infinite.
   * @defaultValue false
   */
  circular: booleanType(false),
  /**
   * Items are displayed with a slideshow in autoPlay mode.
   * @defaultValue false
   */
  autoPlay: booleanType(false),
  /**
   * Time in milliseconds to scroll items.
   * @defaultValue 4000
   */
  transitionInterval: { type: Number, default: 4000 },
  /**
   * Whether to display thumbnail container.
   * @defaultValue true
   */
  showThumbnails: booleanType(true),
  /**
   * Position of thumbnails.
   * @defaultValue bottom
   */
  thumbnailsPosition: stringType<GalleriaPositionType>('bottom'),
  /**
   * Height of the viewport in vertical thumbnail.
   * @defaultValue 300px
   */
  verticalThumbnailViewPortHeight: stringType<string>('300px'),
  /**
   * Whether to display indicator container.
   * @defaultValue false
   */
  showIndicators: booleanType(false),
  /**
   * When enabled, indicator container is displayed on item container.
   * @defaultValue false
   */
  showIndicatorsOnItem: booleanType(false),
  /**
   * Position of indicators.
   * @defaultValue bottom
   */
  indicatorsPosition: stringType<GalleriaPositionType>('bottom'),
  /**
   * Base zIndex value to use in layering.
   * @defaultValue 0
   */
  baseZIndex: { type: Number, default: 0 },
  /**
   * Style class of the mask on fullscreen mode.
   */
  maskClass: stringType<string | null>(null),
  /**
   * Inline style of the component on fullscreen mode.
   */
  containerStyle: anyType<any>(null),
  /**
   * Style class of the component on fullscreen mode.
   */
  containerClass: anyType<any>(null),
  /**
   * Used to pass all properties of the HTMLDivElement to the container element on fullscreen mode.
   */
  containerProps: anyType<HTMLAttributes | null>(null),
  /**
   * Used to pass all properties of the HTMLButtonElement to the previous navigation button.
   */
  prevButtonProps: anyType<ButtonHTMLAttributes | null>({}),
  /**
   * Used to pass all properties of the HTMLButtonElement to the next navigation button.
   */
  nextButtonProps: anyType<ButtonHTMLAttributes | null>({}),
  /**
   * Defines a string value that labels an interactive element.
   */
  ariaLabel: stringType<string | undefined>(undefined),
  /**
   * Defines a string value that description for the role of the component.
   */
  ariaRoledescription: stringType<string | undefined>(undefined),
});

export type GalleriaProps = Partial<ExtractPropTypes<ReturnType<typeof galleriaProps>>>;

export default galleriaProps;
