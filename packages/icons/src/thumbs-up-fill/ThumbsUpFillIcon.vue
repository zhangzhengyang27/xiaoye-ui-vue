<template>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="pti()">
        <path
            d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
            fill="currentColor"
            transform="scale(0.5833)"
        />
    </svg>
</template>

<script setup lang="ts">
import { useBaseIcon, type BaseIconProps } from '@xiaoye-ui/core/composables';

defineOptions({ name: 'ThumbsUpFillIcon' });

const props = defineProps<BaseIconProps>();

const { pti } = useBaseIcon(props);
</script>
