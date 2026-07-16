<template>
  <a-space>
    <a-select v-model:value="value" style="width: 200px" @change="handleChange">
      <a-select-opt-group>
        <template #label>
          <span>
            <user-outlined />
            Manager
          </span>
        </template>
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select-opt-group>
      <a-select-opt-group label="Engineer">
        <a-select-option value="Yiminghe">yiminghe</a-select-option>
        <a-select-option value="Yiminghe1">yiminghe1</a-select-option>
      </a-select-opt-group>
    </a-select>
    <a-select
      v-model:value="value"
      :options="options"
      style="width: 200px"
      @change="handleChange"
    ></a-select>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined } from '@xiaoye-ui/icons';
import type { SelectProps } from 'xiaoye-ui';

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const options = ref<SelectProps['options']>([
  {
    label: 'Manager',
    options: [
      {
        value: 'jack',
        label: 'Jack',
      },
      {
        value: 'lucy',
        label: 'Lucy',
      },
    ],
  },
  {
    label: 'Engineer',
    options: [
      {
        value: 'yiminghe',
        label: 'Yiminghe',
      },
    ],
  },
]);

const value = ref(['lucy']);
</script>
