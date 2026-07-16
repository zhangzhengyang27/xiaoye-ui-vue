export default function isClickable(element: Element): boolean {
  if (element) {
    const targetNode = element.nodeName;
    const parentNode = element.parentElement && element.parentElement.nodeName;

    return (
      targetNode === 'INPUT' ||
      targetNode === 'TEXTAREA' ||
      targetNode === 'BUTTON' ||
      targetNode === 'A' ||
      parentNode === 'INPUT' ||
      parentNode === 'TEXTAREA' ||
      parentNode === 'BUTTON' ||
      parentNode === 'A' ||
      !!element.closest('.xy-button, .xy-checkbox, .xy-radio')
    );
  }

  return false;
}
