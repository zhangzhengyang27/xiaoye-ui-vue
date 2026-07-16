<template>
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="$attrs">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 8 4-4 4 4" />
        <path d="M7 4v16" />
        <path d="M11 12h4" />
        <path d="M11 16h7" />
        <path d="M11 20h10" />
        </g>
    </svg>
</template>

<script setup lang="ts">
defineProps({
    size: {
        type: [Number, String],
        default: 14
    }
});
</script>
