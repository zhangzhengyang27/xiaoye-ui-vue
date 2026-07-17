<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="select one country"
      option-label-prop="children"
    >
      <xy-select-option value="china" label="China">
        <span role="img" aria-label="China">🇨🇳</span>
        &nbsp;&nbsp;China (中国)
      </xy-select-option>
      <xy-select-option value="usa" label="USA">
        <span role="img" aria-label="USA">🇺🇸</span>
        &nbsp;&nbsp;USA (美国)
      </xy-select-option>
      <xy-select-option value="japan" label="Japan">
        <span role="img" aria-label="Japan">🇯🇵</span>
        &nbsp;&nbsp;Japan (日本)
      </xy-select-option>
      <xy-select-option value="korea" label="Korea">
        <span role="img" aria-label="Korea">🇰🇷</span>
        &nbsp;&nbsp;Korea (韩国)
      </xy-select-option>
    </xy-select>

    <xy-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="select one country"
      option-label-prop="label"
      :options="options"
    >
      <template #option="{ value: val, label, icon }">
        <span role="img" :aria-label="val">{{ icon }}</span>
        &nbsp;&nbsp;{{ label }}
      </template>
    </xy-select>
    <span>Note: v-slot:option support from v2.2.5</span>
  </xy-space>
  <br />
  <br />
  <xy-space direction="vertical" style="width: 100%">
    <xy-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="select one country"
      :options="options"
    >
      <template #option="{ value: val, label, icon }">
        <span role="img" :aria-label="val">{{ icon }}</span>
        &nbsp;&nbsp;{{ label }}
      </template>
      <template #tagRender="{ value: val, label, closable, onClose, option }">
        <xy-tag :closable="closable" style="margin-right: 3px" @close="onClose">
          {{ label }}&nbsp;&nbsp;
          <span role="img" :aria-label="val">{{ option.icon }}</span>
        </xy-tag>
      </template>
    </xy-select>
    <span>Note: v-slot:tagRender support from v3.0</span>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

const value = ref(['china']);

const options = ref([
  {
    value: 'china',
    label: 'China (中国)',
    icon: '🇨🇳',
  },
  {
    value: 'usa',
    label: 'USA (美国)',
    icon: '🇺🇸',
  },
  {
    value: 'japan',
    label: 'Japan (日本)',
    icon: '🇯🇵',
  },
  {
    value: 'korea',
    label: 'Korea (韩国)',
    icon: '🇨🇰',
  },
]);
watch(value, val => {
  console.log(`selected:`, val);
});
</script>
