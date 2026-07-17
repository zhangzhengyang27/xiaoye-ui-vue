<template>
  <xy-space direction="vertical">
    <xy-date-picker @change="onChange">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </xy-date-picker>
    <xy-date-picker placeholder="Select month" picker="month" @change="onChange">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </xy-date-picker>
    <xy-range-picker @change="onRangeChange">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </xy-range-picker>
    <xy-date-picker placeholder="Select week" picker="week" @change="onChange">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </xy-date-picker>
    <xy-date-picker suffix-icon="ab" @change="onChange" />
    <xy-date-picker suffix-icon="ab" placeholder="Select month" picker="month" @change="onChange" />
    <xy-range-picker suffix-icon="ab" @change="onRangeChange" />
    <xy-date-picker suffix-icon="ab" placeholder="Select week" picker="week" @change="onChange" />
  </xy-space>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@xiaoye-ui/icons';
import { Dayjs } from 'dayjs';
const onChange = (date: Dayjs | string, dateString: string) => {
  console.log(date, dateString);
};

const onRangeChange = (date: [Dayjs, Dayjs], dateString: [string, string]) => {
  console.log(date, dateString);
};
</script>
