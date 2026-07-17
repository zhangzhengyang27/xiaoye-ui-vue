<template>
  <xy-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <xy-form-list name="addresses">
      <template #default="{ fields, add, remove }">
        <xy-form-item
          v-for="(field, index) in fields"
          :key="field.key"
          :label="`地址 ${index + 1}`"
        >
          <div class="demo-address-card">
            <div class="demo-address-row">
              <xy-form-item
                :name="['addresses', index, 'province']"
                :rules="[{ required: true, message: '请选择省份' }]"
                :wrapper-col="{ span: 24 }"
                style="margin-bottom: 8px"
              >
                <xy-select
                  v-model:value="formState.addresses[index].province"
                  placeholder="省份"
                  :options="provinces"
                  style="width: 100%"
                />
              </xy-form-item>
              <xy-form-item
                :name="['addresses', index, 'city']"
                :rules="[{ required: true, message: '请输入城市' }]"
                :wrapper-col="{ span: 24 }"
                style="margin-bottom: 8px"
              >
                <xy-input v-model:value="formState.addresses[index].city" placeholder="城市" />
              </xy-form-item>
              <xy-form-item
                :name="['addresses', index, 'detail']"
                :rules="[{ required: true, message: '请输入详细地址' }]"
                :wrapper-col="{ span: 24 }"
                style="margin-bottom: 0"
              >
                <xy-textarea
                  v-model:value="formState.addresses[index].detail"
                  placeholder="详细地址"
                  :rows="2"
                />
              </xy-form-item>
            </div>
            <div v-if="fields.length > 1" class="demo-address-actions">
              <xy-button danger size="small" type="link" @click="remove(index)">
                删除此地址
              </xy-button>
            </div>
          </div>
        </xy-form-item>

        <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <xy-button type="dashed" @click="add({ province: '', city: '', detail: '' })">
            <PlusOutlined />
            添加地址
          </xy-button>
        </xy-form-item>
      </template>
    </xy-form-list>

    <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
      <pre class="demo-output">{{ JSON.stringify(formState.addresses, null, 2) }}</pre>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { PlusOutlined } from '@xiaoye-ui/icons';

interface Address {
  province: string;
  city: string;
  detail: string;
}

const provinces = [
  { label: '北京市', value: 'beijing' },
  { label: '上海市', value: 'shanghai' },
  { label: '广东省', value: 'guangdong' },
  { label: '浙江省', value: 'zhejiang' },
];

const formState = reactive<{ addresses: Address[] }>({
  addresses: [
    {
      province: 'beijing',
      city: '北京市',
      detail: '朝阳区某某街道 1 号',
    },
  ],
});
</script>

<style scoped>
.demo-address-card {
  width: 100%;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
}
.demo-address-row {
  display: flex;
  flex-direction: column;
}
.demo-address-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
.demo-output {
  margin: 0;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  font-size: 12px;
  color: #555;
  font-family: 'SFMono-Regular', Consolas, monospace;
  max-height: 200px;
  overflow: auto;
}
</style>
