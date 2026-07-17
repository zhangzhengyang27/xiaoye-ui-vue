<template>
  <xy-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <xy-form-list name="skills">
      <template #default="{ fields, add, remove, move }">
        <xy-form-item
          v-for="(field, index) in fields"
          :key="field.key"
          :label="`技能 ${index + 1}`"
        >
          <xy-space>
            <xy-input
              v-model:value="formState.skills[index].name"
              placeholder="技能名称"
              style="width: 160px"
            />
            <xy-input-number
              v-model:value="formState.skills[index].level"
              placeholder="熟练度"
              :min="0"
              :max="100"
              style="width: 120px"
            />
            <xy-button-group>
              <xy-button
                size="small"
                :disabled="index === 0"
                title="上移"
                @click="move(index, index - 1)"
              >
                <ArrowUpOutlined />
              </xy-button>
              <xy-button
                size="small"
                :disabled="index === fields.length - 1"
                title="下移"
                @click="move(index, index + 1)"
              >
                <ArrowDownOutlined />
              </xy-button>
              <xy-button
                size="small"
                danger
                :disabled="fields.length <= 1"
                title="删除"
                @click="remove(index)"
              >
                <DeleteOutlined />
              </xy-button>
            </xy-button-group>
          </xy-space>
        </xy-form-item>

        <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <xy-space>
            <xy-button type="dashed" @click="add({ name: '', level: 0 }, 0)">
              <PlusOutlined />
              在首部添加
            </xy-button>
            <xy-button type="dashed" @click="add({ name: '', level: 0 })">
              <PlusOutlined />
              在末尾添加
            </xy-button>
          </xy-space>
        </xy-form-item>
      </template>
    </xy-form-list>

    <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
      <pre class="demo-output">{{ JSON.stringify(formState.skills, null, 2) }}</pre>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@xiaoye-ui/icons';

const formState = reactive<{
  skills: { name: string; level: number }[];
}>({
  skills: [
    { name: 'Vue', level: 90 },
    { name: 'TypeScript', level: 85 },
  ],
});
</script>

<style scoped>
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
