<script setup lang="ts">
import '@docsearch/css'
import { getCurrentInstance, onMounted, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import docsearch from '@docsearch/js'
import { isClient } from '@vueuse/core'

const props = defineProps<{
  options: any
  multilang?: boolean
}>()

const vm = getCurrentInstance()
const route = useRoute()
const router = useRouter()

watch(() => props.options, (newOptions) => {
  update(newOptions)
})

onMounted(() => {
  initialize(props.options)
})

function isSpecialClick(event: MouseEvent) {
  return (
    event.button === 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  )
}

function getRelativePath(absoluteUrl: string) {
  const { pathname, hash } = new URL(absoluteUrl)

  return pathname + hash
}

function update(options: any) {
  if (vm && vm.vnode.el) {
    vm.vnode.el.innerHTML =
      '<div class="algolia-search-box" id="docsearch"></div>'
    initialize(options)
  }
}

function initialize(userOptions: any) {
  // 没有 Algolia 配置时不初始化搜索
  if (!userOptions || !userOptions.appId || !userOptions.apiKey) {
    return
  }
  docsearch(
    Object.assign({}, userOptions, {
      container: '#docsearch',
      indexName: 'xiaoye-ui',
      placeholder: '搜索文档',
      translations: {
        button: {
          buttonText: '搜索文档',
          buttonAriaLabel: '搜索文档',
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询',
            resetButtonAriaLabel: '清除查询',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消',
          },
          startScreen: {
            recentSearchesTitle: '最近搜索',
            noRecentSearchesText: '没有最近搜索',
            saveRecentSearchButtonTitle: '保存到最近搜索',
            removeRecentSearchButtonTitle: '从最近搜索中移除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中移除',
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '可能由于网络连接问题',
          },
          footer: {
            selectText: '选择',
            navigateText: '导航',
            closeText: '关闭',
            searchByText: '搜索提供',
          },
          noResultsScreen: {
            noResultsText: '没有找到相关结果',
            suggestedQueryText: '尝试搜索',
            reportMissingResultsText: '认为这个查询应该有结果？',
            reportMissingResultsLinkText: '告诉我们',
          },
        },
      },
      searchParameters: Object.assign({}, userOptions.searchParameters, {
        facetFilters: userOptions.searchParameters?.facetFilters || [],
      }),

      getMissingResultsUrl({ query }: { query: string }) {
        return `https://github.com/xiaoye-ui/xiaoye-ui/issues/new?title=${encodeURIComponent(
          `[Docs] Missing search result for \`${query}\``
        )}`
      },

      navigator: {
        navigate: ({ itemUrl }: { itemUrl: string }) => {
          if (!isClient) return

          const { pathname: hitPathname } = new URL(
            window.location.origin + itemUrl
          )

          if (route.path === hitPathname) {
            window.location.assign(window.location.origin + itemUrl)
          } else {
            router.go(withBase(itemUrl))
          }
        },
      },

      transformItems: (items: any[]) => {
        return items.map((item) => {
          return Object.assign({}, item, {
            url: getRelativePath(item.url),
          })
        })
      },

      hitComponent: ({ hit, children }: { hit: any; children: any }) => {
        const relativeHit = hit.url.startsWith('http')
          ? getRelativePath(hit.url as string)
          : withBase(hit.url)

        return {
          type: 'a',
          ref: undefined,
          constructor: undefined,
          key: undefined,
          props: {
            href: hit.url,
            onClick: (event: MouseEvent) => {
              if (isSpecialClick(event)) {
                return
              }

              if (route.path === relativeHit) {
                return
              }

              if (route.path !== relativeHit) {
                event.preventDefault()
              }

              router.go(relativeHit)
            },
            children,
          },
          __v: children.__v,
        }
      },
    })
  )
}
</script>

<template>
  <div id="docsearch" class="algolia-search-box" />
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.algolia-search-box {
  @include respond-to('md') {
    min-width: 176.3px;
  }
}

.DocSearch {
  --docsearch-primary-color: var(--brand-color);
  --docsearch-highlight-color: var(--brand-color);
  --docsearch-key-gradient: rgba(125, 125, 125, 0.1);
  --docsearch-footer-height: 44px;
  --docsearch-footer-background: var(--bg-color);
  --docsearch-footer-shadow:
    0 -1px 0 0 #e0e3e8, 0 -3px 6px 0 rgba(69, 98, 155, 0.12);
  --docsearch-searchbox-background: rgba(var(--bg-color-rgb), 0.8);
  --docsearch-searchbox-focus-background: var(--bg-color-mute);
  --docsearch-searchbox-shadow: inset 0 0 0 2px var(--brand-color);
  --docsearch-muted-color: var(--text-color-lighter);
  --docsearch-text-color: var(--text-color-light);
  --docsearch-modal-background: var(--bg-color-soft);
  --docsearch-modal-shadow: var(--box-shadow);

  transition: background-color 0.2s;
  background-color: transparent;

  &.DocSearch-Container {
    z-index: 20000;
  }

  &.DocSearch-Button {
    margin-right: 8px;
  }

  .DocSearch-Title {
    word-break: break-word;
  }

  @media (max-width: 749px) {
    &.DocSearch-Button {
      margin: 0 12px;
      padding: 0;
    }
  }

  .dark & {
    --docsearch-text-color: var(--text-color-light);
    --docsearch-key-shadow: none;
    --docsearch-modal-shadow: none;
    --docsearch-footer-shadow: none;
    --docsearch-hit-background: var(--bg-color-mute);
    --docsearch-hit-color: var(--text-color-lighter);
    --docsearch-hit-shadow: none;

    .DocSearch-Button {
      .DocSearch-Button-Key {
        box-shadow: unset;
      }
    }
  }

  @include respond-to('md') {
    background-color: var(--docsearch-searchbox-background);
  }
}
</style>
