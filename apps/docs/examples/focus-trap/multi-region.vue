<!-- 多区域焦点陷阱：通过 disabled 切换不同区域的焦点陷阱，同一时刻只有一个区域生效 -->
<template>
  <div>
    <p class="demo-tip">
      点击下方任意区域的「激活此区域」按钮后，Tab 键将只在当前区域内循环。
      激活另一区域会自动让出焦点陷阱。
    </p>

    <div class="demo-grid">
      <!-- 区域 A -->
      <div class="region-card" :class="{ 'region-active': activeKey === 'A' }">
        <div class="region-header">
          <span class="region-title">区域 A</span>
          <xy-button
            size="small"
            :type="activeKey === 'A' ? 'primary' : 'default'"
            @click="activeKey = 'A'"
          >
            激活此区域
          </xy-button>
        </div>
        <xy-focus-trap :disabled="activeKey !== 'A'">
          <div class="region-body">
            <xy-input placeholder="A 区输入框" />
            <xy-space class="region-actions">
              <xy-button>A1</xy-button>
              <xy-button>A2</xy-button>
            </xy-space>
          </div>
        </xy-focus-trap>
      </div>

      <!-- 区域 B -->
      <div class="region-card" :class="{ 'region-active': activeKey === 'B' }">
        <div class="region-header">
          <span class="region-title">区域 B</span>
          <xy-button
            size="small"
            :type="activeKey === 'B' ? 'primary' : 'default'"
            @click="activeKey = 'B'"
          >
            激活此区域
          </xy-button>
        </div>
        <xy-focus-trap :disabled="activeKey !== 'B'">
          <div class="region-body">
            <xy-input placeholder="B 区输入框" />
            <xy-space class="region-actions">
              <xy-button>B1</xy-button>
              <xy-button>B2</xy-button>
            </xy-space>
          </div>
        </xy-focus-trap>
      </div>
    </div>

    <xy-space class="footer-actions">
      <xy-button @click="activeKey = ''">全部关闭</xy-button>
      <span class="state-text">
        当前生效区域：
        <strong>{{ activeKey || '无' }}</strong>
      </span>
    </xy-space>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const activeKey = ref<'A' | 'B' | ''>('A');
</script>

<style scoped>
.demo-tip {
  margin: 0 0 16px;
  font-size: 13px;
  color: #555;
  line-height: 1.6;
}
.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.region-card {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.region-card.region-active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.15);
}
.region-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.region-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.region-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.region-actions {
  justify-content: flex-end;
}
.footer-actions {
  margin-top: 16px;
}
.state-text {
  font-size: 13px;
  color: #666;
}
.state-text strong {
  color: #1890ff;
}
</style>
