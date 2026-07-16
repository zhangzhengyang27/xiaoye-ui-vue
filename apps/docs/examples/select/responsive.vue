<template>
  <a-space direction="vertical" style="width: 100%">
    <a-space>
      <a-button type="primary" @click="maxTagCount++">maxTagCount++</a-button>
      <a-button type="primary" @click="maxTagCount--">maxTagCount--</a-button>
    </a-space>

    <h2>maxTagCount: {{ maxTagCount }}</h2>
    <a-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="Select Item..."
      :max-tag-count="maxTagCount"
      :options="options"
    >
      <template #maxTagPlaceholder="omittedValues">
        <span style="color: red">+ {{ omittedValues.length }} ...</span>
      </template>
    </a-select>
    <h2>maxTagCount: responsive</h2>
    <a-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="Select Item..."
      max-tag-count="responsive"
      :options="options"
    ></a-select>
    <a-space>
      <a-button type="primary" @click="maxTagTextLength++">maxTagTextLength++</a-button>
      <a-button type="primary" @click="maxTagTextLength--">maxTagTextLength--</a-button>
    </a-space>
    <h2>maxTagTextLength: {{ maxTagTextLength }}</h2>
    <a-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="Select Item..."
      :max-tag-text-length="maxTagTextLength"
      :options="options"
    ></a-select>
  </a-space>
</template>
<script lang="ts" setup>
import type { SelectProps } from 'xiaoye-ui';
import { ref } from 'vue';
const options = ref<SelectProps['options']>([]);

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i;
  options.value.push({
    label: `Long Label: ${value}`,
    value,
  });
}
const maxTagCount = ref(2);
const maxTagTextLength = ref(10);
const value = ref(['a10', 'c12', 'h17', 'j19', 'k20']);
</script>
