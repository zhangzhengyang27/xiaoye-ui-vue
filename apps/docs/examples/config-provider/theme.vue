<template>
  <xy-config-provider
    :theme="{ token: { colorPrimary: data.colorPrimary, borderRadius: `${data.borderRadius}px` } }"
  >
    <xy-form :model="data" name="theme" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <xy-form-item name="colorPrimary" label="Primary Color">
        <input
          type="color"
          :value="data.colorPrimary"
          @input="e => (data.colorPrimary = e.target.value)"
        />
      </xy-form-item>
      <xy-form-item name="borderRadius" label="Border Radius">
        <xy-input v-model:value="data.borderRadius" />
      </xy-form-item>
      <xy-form-item name="submit" :wrapper-col="{ offset: 4, span: 20 }">
        <xy-button type="primary">submit</xy-button>
      </xy-form-item>
    </xy-form>
  </xy-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { theme } from 'xiaoye-ui';

const defaultData = {
  borderRadius: 6,
  colorPrimary: '#1677ff',
};
const data = ref(defaultData);
const { token } = theme.useToken();
</script>

<style scoped>
input[type='color'] {
  border: 1px solid v-bind('token.colorBorder');
  background-color: v-bind('token.colorBgBase');
}
</style>
