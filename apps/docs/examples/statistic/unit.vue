<template>
  <xy-row :gutter="16">
    <xy-col :span="12">
      <xy-statistic title="Feedback" :value="1128" style="margin-right: 50px">
        <template #suffix>
          <like-outlined />
        </template>
      </xy-statistic>
    </xy-col>
    <xy-col :span="12">
      <xy-statistic title="Unmerged" :value="93" class="demo-class">
        <template #suffix>
          <span>/ 100</span>
        </template>
      </xy-statistic>
    </xy-col>
  </xy-row>
</template>
<script lang="ts" setup>
import { LikeOutlined } from '@xiaoye-ui/icons';
</script>
