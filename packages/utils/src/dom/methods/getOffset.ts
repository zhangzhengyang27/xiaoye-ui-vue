import getScrollLeft from './getScrollLeft';

export default function getOffset(element?: Element | null): {
  top: number;
  left: number;
} {
  if (element) {
    const rect = element.getBoundingClientRect();

    return {
      top:
        rect.top +
        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
      left:
        rect.left +
        (window.pageXOffset ||
          getScrollLeft(document.documentElement) ||
          getScrollLeft(document.body) ||
          0),
    };
  }

  return {
    top: 0,
    left: 0,
  };
}
