<template>
  <xy-button type="primary" @click="showDrawer">
    <template #icon><PlusOutlined /></template>
    New account
  </xy-button>
  <xy-drawer
    title="Create a new account"
    :width="720"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <xy-form :model="form" :rules="rules" layout="vertical">
      <xy-row :gutter="16">
        <xy-col :span="12">
          <xy-form-item label="Name" name="name">
            <xy-input v-model:value="form.name" placeholder="Please enter user name" />
          </xy-form-item>
        </xy-col>
        <xy-col :span="12">
          <xy-form-item label="Url" name="url">
            <xy-input
              v-model:value="form.url"
              style="width: 100%"
              addon-before="http://"
              addon-after=".com"
              placeholder="please enter url"
            />
          </xy-form-item>
        </xy-col>
      </xy-row>
      <xy-row :gutter="16">
        <xy-col :span="12">
          <xy-form-item label="Owner" name="owner">
            <xy-select v-model:value="form.owner" placeholder="Please a-s an owner">
              <xy-select-option value="xiao">Xiaoxiao Fu</xy-select-option>
              <xy-select-option value="mao">Maomao Zhou</xy-select-option>
            </xy-select>
          </xy-form-item>
        </xy-col>
        <xy-col :span="12">
          <xy-form-item label="Type" name="type">
            <xy-select v-model:value="form.type" placeholder="Please choose the type">
              <xy-select-option value="private">Private</xy-select-option>
              <xy-select-option value="public">Public</xy-select-option>
            </xy-select>
          </xy-form-item>
        </xy-col>
      </xy-row>
      <xy-row :gutter="16">
        <xy-col :span="12">
          <xy-form-item label="Approver" name="approver">
            <xy-select v-model:value="form.approver" placeholder="Please choose the approver">
              <xy-select-option value="jack">Jack Ma</xy-select-option>
              <xy-select-option value="tom">Tom Liu</xy-select-option>
            </xy-select>
          </xy-form-item>
        </xy-col>
        <xy-col :span="12">
          <xy-form-item label="DateTime" name="dateTime">
            <xy-date-picker
              v-model:value="form.dateTime"
              style="width: 100%"
              :get-popup-container="trigger => trigger.parentElement"
            />
          </xy-form-item>
        </xy-col>
      </xy-row>
      <xy-row :gutter="16">
        <xy-col :span="24">
          <xy-form-item label="Description" name="description">
            <xy-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="please enter url description"
            />
          </xy-form-item>
        </xy-col>
      </xy-row>
    </xy-form>
    <template #extra>
      <xy-space>
        <xy-button @click="onClose">Cancel</xy-button>
        <xy-button type="primary" @click="onClose">Submit</xy-button>
      </xy-space>
    </template>
  </xy-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { PlusOutlined } from '@xiaoye-ui/icons';
import type { Rule } from 'xiaoye-ui/form';
const form = reactive({
  name: '',
  url: '',
  owner: '',
  type: '',
  approver: '',
  dateTime: null,
  description: '',
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please enter user name' }],
  url: [{ required: true, message: 'please enter url' }],
  owner: [{ required: true, message: 'Please select an owner' }],
  type: [{ required: true, message: 'Please choose the type' }],
  approver: [{ required: true, message: 'Please choose the approver' }],
  dateTime: [{ required: true, message: 'Please choose the dateTime', type: 'object' }],
  description: [{ required: true, message: 'Please enter url description' }],
};

const open = ref<boolean>(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
</script>
