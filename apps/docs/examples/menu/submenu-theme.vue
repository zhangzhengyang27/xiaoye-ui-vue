<template>
  <div>
    <xy-switch
      :checked="theme === 'dark'"
      checked-children="dark"
      un-checked-children="light"
      @Change="changeTheme"
    />
    <br />
    <br />
    <xy-menu
      :style="{ width: '256px' }"
      :open-keys="openKeys"
      :selected-keys="selectedKeys"
      mode="vertical"
      theme="dark"
      :items="items"
      @click="handleClick"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, VueElement, ComputedRef, h } from 'vue';
import { MailOutlined } from '@xiaoye-ui/icons';
import type { MenuProps } from 'xiaoye-ui';

const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);
const theme = ref<MenuProps['theme']>('light');

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: MenuProps['items'],
  theme?: 'light' | 'dark',
): MenuProps['items'][number] {
  return {
    key,
    icon,
    children,
    label,
    theme,
  };
}

const items: ComputedRef<MenuProps['items']> = computed(() => [
  getItem(
    'Navigation One',
    'sub1',
    () => h(MailOutlined),
    [getItem('Option 1', '1'), getItem('Option 2', '2'), getItem('Option 3', '3')],
    theme.value,
  ),
  getItem('Option 5', '5'),
  getItem('Option 6', '6'),
]);

function handleClick(info: any) {
  console.log('click', info);
}

function changeTheme(checked: boolean) {
  theme.value = checked ? 'dark' : 'light';
}
</script>
