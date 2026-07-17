<template>
  <xy-space>
    <xy-select v-model:value="value" style="width: 200px" @change="handleChange">
      <xy-select-opt-group>
        <template #label>
          <span>
            <user-outlined />
            Manager
          </span>
        </template>
        <xy-select-option value="jack">Jack</xy-select-option>
        <xy-select-option value="lucy">Lucy</xy-select-option>
      </xy-select-opt-group>
      <xy-select-opt-group label="Engineer">
        <xy-select-option value="Yiminghe">yiminghe</xy-select-option>
        <xy-select-option value="Yiminghe1">yiminghe1</xy-select-option>
      </xy-select-opt-group>
    </xy-select>
    <xy-select
      v-model:value="value"
      :options="options"
      style="width: 200px"
      @change="handleChange"
    ></xy-select>
  </xy-space>
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
