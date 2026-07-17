<template>
  <xy-space direction="vertical">
    <xy-space wrap>
      <xy-tooltip title="search">
        <xy-button type="primary" shape="circle" :icon="h(SearchOutlined)" />
      </xy-tooltip>
      <xy-button type="primary" shape="circle">A</xy-button>
      <xy-button type="primary" :icon="h(SearchOutlined)">Search</xy-button>
      <xy-tooltip title="search">
        <xy-button shape="circle" :icon="h(SearchOutlined)" />
      </xy-tooltip>
      <xy-button :icon="h(SearchOutlined)">Search</xy-button>
    </xy-space>
    <xy-space wrap>
      <xy-tooltip title="search">
        <xy-button shape="circle" :icon="h(SearchOutlined)" />
      </xy-tooltip>
      <xy-button :icon="h(SearchOutlined)">Search</xy-button>
      <xy-tooltip title="search">
        <xy-button type="dashed" shape="circle" :icon="h(SearchOutlined)" />
      </xy-tooltip>
      <xy-button type="dashed" :icon="h(SearchOutlined)">Search</xy-button>
      <xy-button :icon="h(SearchOutlined)" href="https://www.google.com" />
    </xy-space>
  </xy-space>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { SearchOutlined } from '@xiaoye-ui/icons';
</script>
