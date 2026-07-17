<template>
  <p :style="{ marginBottom: '20px' }">
    <xy-checkbox v-model:checked="checked" :disabled="disabled">
      {{ label }}
    </xy-checkbox>
  </p>
  <p>
    <xy-button type="primary" size="small" @click="toggleChecked">
      {{ !checked ? 'Check' : 'Uncheck' }}
    </xy-button>
    <xy-button :style="{ marginLeft: '10px' }" type="primary" size="small" @click="toggleDisable">
      {{ !disabled ? 'Disable' : 'Enable' }}
    </xy-button>
  </p>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

const checked = ref(false);
const disabled = ref(false);

const toggleChecked = () => {
  checked.value = !checked.value;
};

const toggleDisable = () => {
  disabled.value = !disabled.value;
};

const label = computed(() => {
  return `${checked.value ? 'Checked' : 'Unchecked'}-${disabled.value ? 'Disabled' : 'Enabled'}`;
});
</script>
