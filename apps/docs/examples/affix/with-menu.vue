<!-- 与菜单组合：侧边导航菜单配合 affix 固定，常见文档站/管理后台布局，滚动时菜单始终可见 -->
<template>
  <div class="affix-with-menu-demo">
    <xy-affix :offset-top="0" @change="onAffixChange">
      <div class="menu-wrapper">
        <xy-menu
          v-model:selected-keys="selectedKeys"
          v-model:open-keys="openKeys"
          mode="inline"
          :items="items"
          style="width: 220px; border-right: 1px solid #f0f0f0"
        />
      </div>
    </xy-affix>
    <div class="content">
      <xy-alert
        :message="affixed ? '菜单已固定到顶部' : '菜单未固定'"
        :type="affixed ? 'success' : 'info'"
        show-icon
        style="margin-bottom: 12px"
      />
      <p class="tip">滚动页面时，左侧菜单会跟随固定，便于长文档导航。</p>
      <p v-for="n in 12" :key="n" class="paragraph">
        这是第 {{ n }} 段内容。当用户在长文档中滚动浏览时，固定的侧边菜单可以让导航始终可见，
        提升阅读体验。常见于文档站点、管理后台等布局。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import {
  AppstoreOutlined,
  SettingOutlined,
  FileTextOutlined,
  BellOutlined,
} from '@xiaoye-ui/icons';

const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);
const affixed = ref<boolean>(false);

const onAffixChange = (value: boolean) => {
  affixed.value = value;
};

const items = ref([
  {
    key: '1',
    icon: () => h(FileTextOutlined),
    label: '入门指南',
    title: '入门指南',
  },
  {
    key: 'sub1',
    icon: () => h(AppstoreOutlined),
    label: '组件总览',
    title: '组件总览',
    children: [
      { key: '2', label: '通用', title: '通用' },
      { key: '3', label: '布局', title: '布局' },
      { key: '4', label: '导航', title: '导航' },
    ],
  },
  {
    key: 'sub2',
    icon: () => h(BellOutlined),
    label: '更新日志',
    title: '更新日志',
    children: [
      { key: '5', label: 'v1.x', title: 'v1.x' },
      { key: '6', label: 'v2.x', title: 'v2.x' },
    ],
  },
  {
    key: '7',
    icon: () => h(SettingOutlined),
    label: '系统设置',
    title: '系统设置',
  },
]);
</script>

<style scoped>
.affix-with-menu-demo {
  display: flex;
  align-items: flex-start;
}

.affix-with-menu-demo .menu-wrapper {
  background: #fff;
}

.affix-with-menu-demo .content {
  flex: 1;
  padding: 0 16px;
  min-width: 0;
}

.affix-with-menu-demo .tip {
  margin: 0 0 12px;
  color: #1677ff;
  font-weight: 500;
}

.affix-with-menu-demo .paragraph {
  margin: 0 0 12px;
  color: #595959;
  line-height: 1.6;
}
</style>
