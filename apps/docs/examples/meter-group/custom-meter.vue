<template>
  <!-- 自定义指标模板：通过 #meter 插槽渲染单个指标 -->
  <xy-meter-group :values="values">
    <template #meter="{ value, class: meterClass }">
      <span
        :class="meterClass"
        :style="{
          backgroundColor: value.color,
          position: 'relative',
        }"
      >
        <span
          :style="{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '12px',
          }"
        >
          {{ value.value }}
        </span>
      </span>
    </template>
  </xy-meter-group>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const values = ref([
  { label: '第一季度', value: 25, color: '#1677ff' },
  { label: '第二季度', value: 35, color: '#52c41a' },
  { label: '第三季度', value: 20, color: '#faad14' },
  { label: '第四季度', value: 20, color: '#eb2f96' },
]);
</script>
