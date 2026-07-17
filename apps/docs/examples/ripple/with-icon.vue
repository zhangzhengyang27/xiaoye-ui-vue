<template>
  <xy-space direction="vertical" :size="16">
    <xy-space wrap align="center">
      <xy-ripple class="icon-btn">
        <button class="demo-icon-btn">
          <SearchOutlined />
        </button>
      </xy-ripple>
      <xy-ripple class="icon-btn">
        <button class="demo-icon-btn">
          <StarOutlined />
        </button>
      </xy-ripple>
      <xy-ripple class="icon-btn">
        <button class="demo-icon-btn">
          <HeartOutlined />
        </button>
      </xy-ripple>
      <xy-ripple class="icon-btn">
        <button class="demo-icon-btn">
          <BellOutlined />
        </button>
      </xy-ripple>
    </xy-space>

    <xy-ripple class="card-wrap">
      <div class="demo-card">
        <div class="card-title">
          <SettingOutlined />
          <span>可点击的卡片</span>
        </div>
        <p>点击卡片任意位置都会触发涟漪效果，适用于可点击的卡片或菜单项。</p>
      </div>
    </xy-ripple>
  </xy-space>
</template>
<script lang="ts" setup>
import {
  SearchOutlined,
  StarOutlined,
  HeartOutlined,
  BellOutlined,
  SettingOutlined,
} from '@xiaoye-ui/icons';
</script>
<style scoped>
.icon-btn {
  display: inline-block;
}
.demo-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  color: #595959;
}
.demo-icon-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}
.card-wrap {
  display: block;
  width: 320px;
}
.demo-card {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 8px;
}
.demo-card p {
  color: #888;
  margin: 0;
}
</style>
