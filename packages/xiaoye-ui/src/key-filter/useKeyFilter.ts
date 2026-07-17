import { watch, onBeforeUnmount, type Ref, type ComputedRef, unref } from 'vue';
import { getPresetRegex } from './presets';
import type { KeyFilterPattern, KeyFilterPreset } from './keyFilterTypes';

// SSR 安全：仅浏览器端可访问 document/window
const isClient = typeof window !== 'undefined' && !!window.document;

// 修复源代码 bug：源代码用 $_pkeyfilterPattern / $_keyfilterKeydownEvent 两种不一致前缀
// 统一用 $_xyKeyfilter 前缀
const PATTERN_KEY = '$_xyKeyfilterPattern';
const MODIFIER_KEY = '$_xyKeyfilterModifier';
const VALIDATE_ONLY_KEY = '$_xyKeyfilterValidateOnly';
const COMPOSING_KEY = '$_xyKeyfilterComposing';

type KeyFilterTarget = HTMLElement & Record<string, any>;

export interface UseKeyFilterOptions {
  target: Ref<HTMLElement | null | undefined> | ComputedRef<HTMLElement | null | undefined>;
  preset?: Ref<KeyFilterPreset | undefined> | ComputedRef<KeyFilterPreset | undefined>;
  // pattern 允许 string（预设名）或 RegExp
  pattern?:
    Ref<KeyFilterPattern | string | undefined> | ComputedRef<KeyFilterPattern | string | undefined>;
  validateOnly?: Ref<boolean | undefined> | ComputedRef<boolean | undefined>;
}

// 修复源代码 bug：源代码 getRegex 对 $_pkeyfilterPattern 为 string 时直接返回字符串，
// 导致后续 regex.test 抛错。这里对 string pattern 从 DEFAULT_PATTERNS 中查找预设。
function getRegex(target: KeyFilterTarget): RegExp | null {
  const pattern = target[PATTERN_KEY];
  if (pattern) {
    if (typeof pattern === 'string') {
      return getPresetRegex(pattern);
    }
    return pattern as RegExp;
  }
  const modifier = target[MODIFIER_KEY];
  if (modifier) {
    return getPresetRegex(modifier);
  }
  return null;
}

function onCompositionStart(target: KeyFilterTarget) {
  target[COMPOSING_KEY] = true;
}

function onCompositionEnd(event: CompositionEvent, target: KeyFilterTarget) {
  target[COMPOSING_KEY] = false;
  const compositionText = event.data || '';
  if (!compositionText) return;

  const regex = getRegex(target);
  if (regex) {
    let filtered = '';
    for (const char of compositionText) {
      if (regex.test(char)) {
        filtered += char;
      }
    }
    if (filtered !== compositionText) {
      const currentValue = target.value;
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertCompositionText',
        data: filtered,
      });
      target.value = currentValue.slice(0, -compositionText.length) + filtered;
      target.dispatchEvent(inputEvent);
    }
  }
}

function onChange(target: KeyFilterTarget) {
  const regex = getRegex(target);
  if (regex) {
    let filtered = '';
    for (const char of target.value) {
      if (regex.test(char)) {
        filtered += char;
      }
    }
    if (filtered !== target.value) {
      target.value = filtered;
      target.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertText',
          data: filtered,
        }),
      );
    }
  }
}

function onInput(target: KeyFilterTarget) {
  if (target[COMPOSING_KEY]) return;
  const regex = getRegex(target);
  if (regex && !regex.test(target.value)) {
    // 移除非法字符（如 ~ "）
    target.value = target.value.slice(0, -1);
  }
}

function onKeypress(event: KeyboardEvent, target: KeyFilterTarget) {
  if (event.ctrlKey || event.altKey || event.metaKey || event.key === 'Tab') {
    return;
  }
  const regex = getRegex(target);
  // 修复源代码 bug：源代码 `if (regex === '') return;` 永远为 false（regex 是 RegExp 或 null）
  if (!regex) return;

  let testKey = `${event.key}`;
  if (target[VALIDATE_ONLY_KEY]) {
    testKey = `${target.value.substring(0, target.selectionStart)}${event.key}${target.value.substring(target.selectionEnd)}`;
  }
  if (!regex.test(testKey)) {
    // 在 @update:modelValue 触发前阻止
    event.preventDefault();
  }
}

function onPaste(event: ClipboardEvent, target: KeyFilterTarget) {
  const regex = getRegex(target);
  // 修复源代码 bug：源代码 `if (regex === '') return;` 永远为 false
  if (!regex) return;

  // 修复源代码 bug：clipboardData 在某些浏览器/环境下可能为 null
  const clipboard = event.clipboardData?.getData('text') || '';
  if (!clipboard) return;

  if (target[VALIDATE_ONLY_KEY]) {
    const newValue = `${target.value.substring(0, target.selectionStart)}${clipboard}${target.value.substring(target.selectionEnd)}`;
    if (!regex.test(newValue)) {
      event.preventDefault();
    }
  } else {
    for (let i = 0; i < clipboard.length; i++) {
      if (!regex.test(clipboard[i])) {
        event.preventDefault();
        return;
      }
    }
  }
}

export function useKeyFilter(options: UseKeyFilterOptions) {
  if (!isClient) return;

  let boundTarget: KeyFilterTarget | null = null;
  // 保存监听器引用以便解绑
  let listeners: Array<[string, EventListener]> = [];

  const bindEvents = (target: KeyFilterTarget) => {
    const keypressHandler = (e: KeyboardEvent) => onKeypress(e, target);
    const pasteHandler = (e: ClipboardEvent) => onPaste(e, target);
    const inputHandler = () => onInput(target);
    const compositionStartHandler = () => onCompositionStart(target);
    const compositionEndHandler = (e: CompositionEvent) => onCompositionEnd(e, target);
    const changeHandler = () => onChange(target);

    target.addEventListener('keypress', keypressHandler as EventListener);
    target.addEventListener('paste', pasteHandler as EventListener);
    target.addEventListener('input', inputHandler);
    target.addEventListener('compositionstart', compositionStartHandler as EventListener);
    target.addEventListener('compositionend', compositionEndHandler as EventListener);
    target.addEventListener('change', changeHandler);

    listeners = [
      ['keypress', keypressHandler as EventListener],
      ['paste', pasteHandler as EventListener],
      ['input', inputHandler],
      ['compositionstart', compositionStartHandler as EventListener],
      ['compositionend', compositionEndHandler as EventListener],
      ['change', changeHandler],
    ];

    target.setAttribute('data-xy-keyfilter', 'true');
    target.setAttribute('autocomplete', 'off');
  };

  const unbindEvents = (target: KeyFilterTarget) => {
    listeners.forEach(([event, handler]) => {
      target.removeEventListener(event, handler);
    });
    listeners = [];
  };

  const updateProps = (target: KeyFilterTarget) => {
    const preset = unref(options.preset);
    const pattern = unref(options.pattern);
    const validateOnly = unref(options.validateOnly);

    target[MODIFIER_KEY] = preset;
    target[PATTERN_KEY] = pattern;
    target[VALIDATE_ONLY_KEY] = !!validateOnly;
  };

  // target 变化时重新绑定
  watch(
    () => options.target.value,
    (target, prevTarget) => {
      if (prevTarget && prevTarget !== target) {
        unbindEvents(prevTarget as KeyFilterTarget);
        boundTarget = null;
      }
      if (target) {
        boundTarget = target as KeyFilterTarget;
        bindEvents(boundTarget);
        updateProps(boundTarget);
      }
    },
    { immediate: true, flush: 'post' },
  );

  // props 变化时更新
  watch(
    [() => unref(options.preset), () => unref(options.pattern), () => unref(options.validateOnly)],
    () => {
      if (boundTarget) {
        updateProps(boundTarget);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    if (boundTarget) {
      unbindEvents(boundTarget);
      boundTarget = null;
    }
  });
}
