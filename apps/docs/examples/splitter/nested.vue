<template>
  <xy-splitter layout="horizontal" style="height: 320px">
    <xy-splitter-panel :size="25">
      <div class="panel-content panel-side">
        <h4>侧边导航</h4>
        <ul class="nav-list">
          <li class="active">概览</li>
          <li>订单管理</li>
          <li>用户中心</li>
          <li>系统设置</li>
        </ul>
      </div>
    </xy-splitter-panel>
    <xy-splitter-panel :size="50">
      <xy-splitter layout="vertical" style="height: 100%">
        <xy-splitter-panel :size="60">
          <div class="panel-content panel-main">
            <h4>主内容区</h4>
            <p>水平 Splitter 内嵌一个垂直 Splitter，实现「侧栏 + 主体 + 底栏」的常见布局。</p>
            <p>内外分隔条都可独立拖动。</p>
          </div>
        </xy-splitter-panel>
        <xy-splitter-panel :size="40">
          <div class="panel-content panel-log">
            <h4>日志输出</h4>
            <pre>
[INFO] 服务启动完成
[INFO] 监听端口 8080
[INFO] 接收到新请求</pre>
          </div>
        </xy-splitter-panel>
      </xy-splitter>
    </xy-splitter-panel>
    <xy-splitter-panel :size="25">
      <div class="panel-content panel-inspector">
        <h4>属性面板</h4>
        <p>选中元素：order-1024</p>
        <p>状态：已支付</p>
        <p>金额：￥199.00</p>
      </div>
    </xy-splitter-panel>
  </xy-splitter>
</template>
<script lang="ts" setup></script>
<style scoped>
.panel-content {
  height: 100%;
  padding: 16px;
  overflow: auto;
}
.panel-content h4 {
  margin: 0 0 12px;
}
.panel-content p {
  margin: 4px 0;
}
.panel-side {
  background: #f0f5ff;
  color: #1d39c4;
}
.panel-main {
  background: #f6ffed;
  color: #389e0d;
}
.panel-log {
  background: #1f1f1f;
  color: #d3ad7c;
  font-family: monospace;
}
.panel-log pre {
  margin: 0;
  white-space: pre-wrap;
}
.panel-inspector {
  background: #fff7e6;
  color: #ad6800;
}
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-list li {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 4px;
}
.nav-list li:hover {
  background: rgba(22, 119, 255, 0.1);
}
.nav-list li.active {
  background: #1677ff;
  color: #fff;
}
</style>
