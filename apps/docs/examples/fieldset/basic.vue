<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-fieldset legend="基本信息">
      <xy-descriptions :column="2" size="small">
        <xy-descriptions-item label="姓名">张三</xy-descriptions-item>
        <xy-descriptions-item label="年龄">28</xy-descriptions-item>
        <xy-descriptions-item label="邮箱">zhangsan@example.com</xy-descriptions-item>
        <xy-descriptions-item label="电话">138-0000-0000</xy-descriptions-item>
      </xy-descriptions>
    </xy-fieldset>

    <xy-fieldset legend="联系地址">
      <xy-form layout="vertical">
        <xy-form-item label="省份">
          <xy-input placeholder="请输入省份" />
        </xy-form-item>
        <xy-form-item label="详细地址">
          <xy-textarea placeholder="请输入详细地址" :rows="2" />
        </xy-form-item>
      </xy-form>
    </xy-fieldset>

    <xy-fieldset legend="无 legend 字段集">
      <p>不传 legend 时，legend 区域为空，fieldset 仍然渲染边框与分组语义。</p>
      <p>常用于纯视觉分组场景。</p>
    </xy-fieldset>
  </xy-space>
</template>
<script lang="ts" setup></script>
