<template>
  <xy-space>
    <xy-skeleton-button :active="active" :size="size" :shape="buttonShape" :block="block" />
    <xy-skeleton-avatar :active="active" :size="size" :shape="avatarShape" />
    <xy-skeleton-input style="width: 200px" :active="active" :size="size" />
  </xy-space>
  <br />
  <br />
  <xy-skeleton-button :active="active" :size="size" :shape="buttonShape" :block="block" />
  <br />
  <br />
  <xy-skeleton-image />
  <xy-divider />
  <xy-form layout="inline" style="margin: 16px 0">
    <xy-form-item label="Active">
      <xy-switch v-model:checked="active" />
    </xy-form-item>
    <xy-form-item label="Button Block">
      <xy-switch v-model:checked="block" />
    </xy-form-item>
    <xy-form-item label="Size">
      <xy-radio-group v-model:value="size">
        <xy-radio-button value="default">Default</xy-radio-button>
        <xy-radio-button value="large">Large</xy-radio-button>
        <xy-radio-button value="small">Small</xy-radio-button>
      </xy-radio-group>
    </xy-form-item>
    <xy-form-item label="Button Shape">
      <xy-radio-group v-model:value="buttonShape">
        <xy-radio-button value="default">Default</xy-radio-button>
        <xy-radio-button value="round">Round</xy-radio-button>
        <xy-radio-button value="circle">Circle</xy-radio-button>
      </xy-radio-group>
    </xy-form-item>
    <xy-form-item label="Avatar Shape">
      <xy-radio-group v-model:value="avatarShape">
        <xy-radio-button value="square">Square</xy-radio-button>
        <xy-radio-button value="circle">Circle</xy-radio-button>
      </xy-radio-group>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { SkeletonButtonProps, SkeletonAvatarProps } from 'xiaoye-ui';
const active = ref(false);
const block = ref(false);
const size = ref<SkeletonButtonProps['size']>('default');
const buttonShape = ref<SkeletonButtonProps['shape']>('default');
const avatarShape = ref<SkeletonAvatarProps['shape']>('circle');
</script>
