import { onUnmounted } from 'vue'
import { isClient } from '@vueuse/core'

const HIDDEN_CLASS = 'xy-popup-parent--hidden'

const getScrollBarWidth = (): number => {
  if (!isClient) return 0
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  outer.style.width = '100px'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  document.body.removeChild(outer)
  return scrollbarWidth
}

const getStyle = (el: HTMLElement, styleName: string): string => {
  if (!isClient || !el) return ''
  return getComputedStyle(el).getPropertyValue(styleName)
}

export const useLockScreen = () => {
  let scrollBarWidth = 0
  let withoutHiddenClass = false
  let bodyPaddingRight = '0'
  let computedBodyPaddingRight = 0

  onUnmounted(() => {
    cleanup()
  })

  const cleanup = () => {
    if (!isClient) return
    document.body.classList.remove(HIDDEN_CLASS)
    if (withoutHiddenClass) {
      document.body.style.paddingRight = bodyPaddingRight
    }
  }

  const lock = () => {
    if (!isClient) return
    withoutHiddenClass = !document.body.classList.contains(HIDDEN_CLASS)
    if (withoutHiddenClass) {
      bodyPaddingRight = document.body.style.paddingRight
      computedBodyPaddingRight = Number.parseInt(
        getStyle(document.body, 'padding-right'),
        10
      )
    }
    scrollBarWidth = getScrollBarWidth()
    const bodyHasOverflow =
      document.documentElement.clientHeight < document.body.scrollHeight
    const bodyOverflowY = getStyle(document.body, 'overflow-y')
    if (
      scrollBarWidth > 0 &&
      (bodyHasOverflow || bodyOverflowY === 'scroll') &&
      withoutHiddenClass
    ) {
      document.body.style.paddingRight = `${
        computedBodyPaddingRight + scrollBarWidth
      }px`
    }
    document.body.classList.add(HIDDEN_CLASS)
  }

  return {
    lock,
    cleanup,
  }
}
