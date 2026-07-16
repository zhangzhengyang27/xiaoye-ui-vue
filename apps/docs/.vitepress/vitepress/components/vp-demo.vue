<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRef } from 'vue'
import { useClipboard, useLocalStorage, useToggle } from '@vueuse/core'
import { useSourceCode } from '../composables/source-code'
import demoBlockLocale from '../../i18n/component/demo-block.json'
import SourceCode from './demo/vp-source-code.vue'
import { CodeIcon, GithubIcon, CopyIcon, ChevronUpIcon } from '@xiaoye-ui/icons'

const props = defineProps<{
  sources: [string, string]
  path: string
  rawSources: [string, string]
  description: string
}>()

const vm = getCurrentInstance()!

const sourceLangs = ['TS', 'JS'] satisfies ['TS', 'JS']

const sourceCodeRef = ref<HTMLButtonElement>()
const tsOrjs = useLocalStorage<(typeof sourceLangs)[number]>(
  'xyJsOrTs',
  sourceLangs[0],
  { initOnMounted: true }
)

// 直接使用中文文案，避免依赖 i18n 多语言
const locale = computed(() => demoBlockLocale['zh-CN'])
const decodedDescription = computed(() => decodeURIComponent(props.description))
const sourceVisibilityLabel = computed(() =>
  sourceVisible.value
    ? locale.value['hide-source']
    : locale.value['view-source']
)
const rawSource = computed(
  () => props.rawSources[tsOrjs.value === 'TS' ? 0 : 1]
)
const decodedRawSource = computed(() => decodeURIComponent(rawSource.value))
const source = computed(() => props.sources[tsOrjs.value === 'TS' ? 0 : 1])

const { copy, isSupported } = useClipboard({
  source: decodedRawSource,
  read: false,
})
const [sourceVisible, toggleSourceVisible] = useToggle()
const demoSourceUrl = useSourceCode(toRef(props, 'path'))

const copyCode = async () => {
  const { $message } = vm.appContext.config.globalProperties
  if (!isSupported.value) {
    $message?.error(locale.value['copy-error'])
    return
  }
  try {
    await copy()
    $message?.success(locale.value['copy-success'])
  } catch (e: any) {
    $message?.error(locale.value['copy-error'])
  }
}

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (['Enter', 'NumpadEnter', 'Space'].includes(e.code)) {
    e.preventDefault()
    toggleSourceVisible(false)
    sourceCodeRef.value?.focus()
  }
}
</script>

<template>
  <div
    v-if="decodedDescription"
    class="description"
    v-html="decodedDescription"
  />

  <div class="example">
    <div class="example-showcase">
      <slot name="source" />
    </div>

    <div class="op-btns">
      <a-segmented
        v-model:value="tsOrjs"
        :options="sourceLangs"
        size="small"
        class="lang-switcher"
      />

      <a-tooltip :title="locale['edit-on-github']" placement="top">
        <a
          :href="demoSourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="op-btn"
          :aria-label="locale['edit-on-github']"
        >
          <GithubIcon />
        </a>
      </a-tooltip>

      <a-tooltip :title="locale['copy-code']" placement="top">
        <span
          :aria-label="locale['copy-code']"
          class="op-btn"
          tabindex="0"
          role="button"
          @click="copyCode"
          @keydown.prevent.enter="copyCode"
          @keydown.prevent.space="copyCode"
        >
          <CopyIcon />
        </span>
      </a-tooltip>

      <a-tooltip :title="sourceVisibilityLabel" placement="top">
        <button
          ref="sourceCodeRef"
          class="reset-btn op-btn"
          :aria-label="sourceVisibilityLabel"
          @click="toggleSourceVisible()"
        >
          <CodeIcon />
        </button>
      </a-tooltip>
    </div>

    <Transition name="fade-height">
      <SourceCode v-show="sourceVisible" :visible="sourceVisible" :source="source" />
    </Transition>

    <Transition name="fade">
      <div
        v-show="sourceVisible"
        class="example-float-control"
        tabindex="0"
        role="button"
        @click="toggleSourceVisible(false)"
        @keydown="onSourceVisibleKeydown"
      >
        <ChevronUpIcon />
        <span>{{ locale['hide-source'] }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.description {
  margin: 1rem 0;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: var(--text-color);
}

.example {
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
  margin: 1rem 0;

  .example-showcase {
    padding: 1rem 1.25rem;
    background-color: var(--bg-color);
    border-radius: var(--el-border-radius-base);
    overflow: auto;

    > *:last-child {
      margin-bottom: 0 !important;
    }
  }

  .op-btns {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 2rem;
    background-color: var(--bg-color);
    border-top: 1px solid var(--border-color);

    .lang-switcher {
      margin-right: 0.5rem;
    }

    .op-btn {
      margin: 0 0.25rem;
      padding: 0.25rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: color 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: var(--el-border-radius-small);
      background-color: transparent;
      border: none;

      svg {
        width: 1rem;
        height: 1rem;
      }

      a {
        color: var(--text-color-lighter);
        transition: color 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: var(--text-color);
        }
      }

      &:hover {
        color: var(--text-color);
        background-color: var(--el-fill-color-lighter);
      }
    }
  }

  .example-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 40px;
    box-sizing: border-box;
    background-color: var(--bg-color);
    margin-top: -1px;
    color: var(--text-color-lighter);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    font-size: 13px;

    svg {
      width: 1rem;
      height: 1rem;
    }

    span {
      margin-left: 6px;
    }

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-lighter);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-height-enter-active,
.fade-height-leave-active {
  transition: all 0.3s ease;
  max-height: 800px;
  opacity: 1;
  overflow: hidden;
}

.fade-height-enter-from,
.fade-height-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
