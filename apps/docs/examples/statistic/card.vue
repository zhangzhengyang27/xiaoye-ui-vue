<template>
  <div style="background: #ececec; padding: 30px">
    <xy-row :gutter="16">
      <xy-col :span="12">
        <xy-card>
          <xy-statistic
            title="Feedback"
            :value="11.28"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#3f8600' }"
            style="margin-right: 50px"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </xy-statistic>
        </xy-card>
      </xy-col>
      <xy-col :span="12">
        <xy-card>
          <xy-statistic
            title="Idle"
            :value="9.3"
            :precision="2"
            suffix="%"
            class="demo-class"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <arrow-down-outlined />
            </template>
          </xy-statistic>
        </xy-card>
      </xy-col>
    </xy-row>
  </div>
</template>
<script lang="ts" setup>
import { ArrowUpOutlined, ArrowDownOutlined } from '@xiaoye-ui/icons';
</script>
