<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <div class="demo-row">
      <xy-button @click="reload">重置为初始值</xy-button>
      <span class="demo-tip">FormList 通过 `initialValue` 初始化字段列表，重置 key 即可重建。</span>
    </div>
    <xy-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <xy-form-list :key="reloadKey" name="contacts" :initial-value="initialContacts">
        <template #default="{ fields, add, remove }">
          <xy-form-item
            v-for="(field, index) in fields"
            :key="field.key"
            :label="`联系人 ${index + 1}`"
          >
            <xy-space>
              <xy-input
                v-model:value="formState.contacts[index].name"
                placeholder="姓名"
                style="width: 120px"
              />
              <xy-input
                v-model:value="formState.contacts[index].phone"
                placeholder="电话"
                style="width: 160px"
              />
              <xy-button v-if="fields.length > 1" danger type="link" @click="remove(index)">
                删除
              </xy-button>
            </xy-space>
          </xy-form-item>

          <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
            <xy-button type="dashed" @click="add({ name: '', phone: '' })">
              <PlusOutlined />
              添加联系人
            </xy-button>
          </xy-form-item>
        </template>
      </xy-form-list>
    </xy-form>
  </xy-space>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { PlusOutlined } from '@xiaoye-ui/icons';

interface Contact {
  name: string;
  phone: string;
}

const initialContacts: Contact[] = [
  { name: '张三', phone: '13800138000' },
  { name: '李四', phone: '13900139000' },
  { name: '王五', phone: '13700137000' },
];

const reloadKey = ref(0);
const formState = reactive<{ contacts: Contact[] }>({
  contacts: initialContacts.map(c => ({ ...c })),
});

const reload = () => {
  reloadKey.value += 1;
  formState.contacts = initialContacts.map(c => ({ ...c }));
};
</script>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
}
</style>
