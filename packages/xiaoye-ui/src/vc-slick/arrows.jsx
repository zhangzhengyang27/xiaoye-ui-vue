import classnames from '../_util/classNames';
import { cloneElement } from '../_util/vnode';
import { canGoNext } from './utils/innerSliderUtils';

function noop() {}

function handler(options, handle, e) {
  if (e) {
    e.preventDefault();
  }
  handle(options, e);
}

const PrevArrow = (_, { attrs }) => {
  const { clickHandler, infinite, currentSlide, slideCount, slidesToShow } = attrs;
  const prevClasses = { 'slick-arrow': true, 'slick-prev': true };
  let prevHandler = function (e) {
    handler({ message: 'previous' }, clickHandler, e);
  };

  if (!infinite && (currentSlide === 0 || slideCount <= slidesToShow)) {
    prevClasses['slick-disabled'] = true;
    prevHandler = noop;
  }

  const prevArrowProps = {
    key: '0',
    'data-role': 'none',
    class: prevClasses,
    style: { display: 'block' },
    onClick: prevHandler,
    // a11y：箭头为纯图标按钮，需可读名称；边界态同步 aria-disabled
    'aria-label': '上一张',
    'aria-disabled': prevClasses['slick-disabled'] || undefined,
  };
  const customProps = {
    currentSlide,
    slideCount,
  };
  let prevArrow;

  if (attrs.prevArrow) {
    prevArrow = cloneElement(
      attrs.prevArrow({
        ...prevArrowProps,
        ...customProps,
      }),
      {
        key: '0',
        class: prevClasses,
        style: { display: 'block' },
        onClick: prevHandler,
      },
      false,
    );
  } else {
    prevArrow = (
      <button key="0" type="button" {...prevArrowProps}>
        {' '}
        Previous
      </button>
    );
  }
  return prevArrow;
};

PrevArrow.inheritAttrs = false;

const NextArrow = (_, { attrs }) => {
  const { clickHandler, currentSlide, slideCount } = attrs;

  const nextClasses = { 'slick-arrow': true, 'slick-next': true };
  let nextHandler = function (e) {
    handler({ message: 'next' }, clickHandler, e);
  };
  if (!canGoNext(attrs)) {
    nextClasses['slick-disabled'] = true;
    nextHandler = noop;
  }

  const nextArrowProps = {
    key: '1',
    'data-role': 'none',
    class: classnames(nextClasses),
    style: { display: 'block' },
    onClick: nextHandler,
    'aria-label': '下一张',
    'aria-disabled': nextClasses['slick-disabled'] || undefined,
  };
  const customProps = {
    currentSlide,
    slideCount,
  };
  let nextArrow;

  if (attrs.nextArrow) {
    nextArrow = cloneElement(
      attrs.nextArrow({
        ...nextArrowProps,
        ...customProps,
      }),
      {
        key: '1',
        class: classnames(nextClasses),
        style: { display: 'block' },
        onClick: nextHandler,
      },
      false,
    );
  } else {
    nextArrow = (
      <button key="1" type="button" {...nextArrowProps}>
        {' '}
        Next
      </button>
    );
  }

  return nextArrow;
};

NextArrow.inheritAttrs = false;

export { PrevArrow, NextArrow };
