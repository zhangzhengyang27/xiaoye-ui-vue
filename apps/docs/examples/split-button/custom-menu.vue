<template>
  <div class="demo-split-button-wrap">
    <xy-split-button label="自定义菜单" type="primary" @click="handleButtonClick">
      <template #overlay>
        <xy-menu @click="handleMenuClick">
          <xy-menu-item key="1">
            <UserOutlined />
            <span>用户管理</span>
          </xy-menu-item>
          <xy-menu-item key="2">
            <SettingOutlined />
            <span>系统设置</span>
          </xy-menu-item>
          <xy-menu-divider />
          <xy-menu-item key="3" disabled>
            <LockOutlined />
            <span>权限配置（禁用）</span>
          </xy-menu-item>
          <xy-menu-item key="4" danger>
            <DeleteOutlined />
            <span>删除账户</span>
          </xy-menu-item>
        </xy-menu>
      </template>
    </xy-split-button>

    <xy-split-button label="多级菜单" type="default">
      <template #overlay>
        <xy-menu @click="handleMenuClick">
          <xy-sub-menu key="sub1" title="文件操作">
            <xy-menu-item key="1">新建文件</xy-menu-item>
            <xy-menu-item key="2">打开文件</xy-menu-item>
            <xy-menu-item key="3">保存文件</xy-menu-item>
          </xy-sub-menu>
          <xy-sub-menu key="sub2" title="导出">
            <xy-menu-item key="4">导出 PDF</xy-menu-item>
            <xy-menu-item key="5">导出 Word</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      </template>
    </xy-split-button>
  </div>
</template>
<script lang="ts" setup>
import { UserOutlined, SettingOutlined, LockOutlined, DeleteOutlined } from '@xiaoye-ui/icons';
import type { MenuProps } from 'xiaoye-ui';

const handleButtonClick = () => {
  // 主按钮点击
};

const handleMenuClick: MenuProps['onClick'] = () => {
  // 菜单项点击
};
</script>
<style lang="less" scoped>
.demo-split-button-wrap .xy-split-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
