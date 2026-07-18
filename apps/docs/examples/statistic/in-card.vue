<template>
  <div class="in-card-wrapper">
    <xy-row :gutter="[16, 16]">
      <xy-col :xs="24" :sm="12" :md="6">
        <xy-card class="metric-card">
          <xy-statistic
            title="总销售额"
            :value="126560"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#1677ff' }"
          >
            <template #suffix>
              <xy-typography-text type="success" style="font-size: 14px">
                <arrow-up-outlined />
                12.5%
              </xy-typography-text>
            </template>
          </xy-statistic>
          <xy-divider style="margin: 12px 0" />
          <xy-typography-text type="secondary" style="font-size: 12px">
            同比上月增长
          </xy-typography-text>
        </xy-card>
      </xy-col>

      <xy-col :xs="24" :sm="12" :md="6">
        <xy-card class="metric-card">
          <xy-statistic
            title="访问量"
            :value="8846"
            suffix="PV"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <eye-outlined />
            </template>
          </xy-statistic>
          <xy-divider style="margin: 12px 0" />
          <xy-typography-text type="secondary" style="font-size: 12px">
            日均访问 8846 次
          </xy-typography-text>
        </xy-card>
      </xy-col>

      <xy-col :xs="24" :sm="12" :md="6">
        <xy-card class="metric-card">
          <xy-statistic title="支付订单" :value="6560" :value-style="{ color: '#722ed1' }">
            <template #prefix>
              <shopping-cart-icon />
            </template>
            <template #suffix>
              <xy-typography-text type="danger" style="font-size: 14px">
                <arrow-down-outlined />
                3.2%
              </xy-typography-text>
            </template>
          </xy-statistic>
          <xy-divider style="margin: 12px 0" />
          <xy-typography-text type="secondary" style="font-size: 12px">
            转化率 5.6%
          </xy-typography-text>
        </xy-card>
      </xy-col>

      <xy-col :xs="24" :sm="12" :md="6">
        <xy-card class="metric-card">
          <xy-statistic title="待处理工单" :value="23" :value-style="{ color: '#fa8c16' }">
            <template #prefix>
              <bell-outlined />
            </template>
          </xy-statistic>
          <xy-divider style="margin: 12px 0" />
          <xy-typography-text type="secondary" style="font-size: 12px">
            其中 5 条为紧急
          </xy-typography-text>
        </xy-card>
      </xy-col>
    </xy-row>

    <xy-row :gutter="[16, 16]" style="margin-top: 16px">
      <xy-col :span="24">
        <xy-card title="数据概览说明">
          <xy-typography-paragraph>
            在数据看板场景中，将多个
            <code>xy-statistic</code>
            嵌入
            <code>xy-card</code>
            ， 再通过
            <code>xy-row</code>
            +
            <code>xy-col</code>
            网格布局即可组成完整的概览面板。
          </xy-typography-paragraph>
          <xy-typography-paragraph type="secondary">
            通常使用 prefix/suffix 插槽承载图标或趋势变化，并用 valueStyle 区分上涨/下跌的视觉色彩。
          </xy-typography-paragraph>
        </xy-card>
      </xy-col>
    </xy-row>
  </div>
</template>

<script lang="ts" setup>
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  ShoppingCartIcon,
  BellOutlined,
} from '@xiaoye-ui/icons';
</script>

<style scoped>
.in-card-wrapper {
  width: 100%;
}
.metric-card {
  height: 100%;
}
</style>
