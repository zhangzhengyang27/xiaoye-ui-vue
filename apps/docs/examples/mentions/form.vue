<template>
  <xy-form layout="horizontal">
    <xy-form-item
      label="Top coders"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      name="coders"
      v-bind="validateInfos.coders"
    >
      <xy-mentions v-model:value="modelRef.coders" rows="1" :options="options"></xy-mentions>
    </xy-form-item>
    <xy-form-item
      label="Bio"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      name="bio"
      v-bind="validateInfos.bio"
    >
      <xy-mentions
        v-model:value="modelRef.bio"
        rows="3"
        placeholder="You can use @ to ref user here"
        :options="options"
      ></xy-mentions>
    </xy-form-item>
    <xy-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <xy-button type="primary" @click="handleSubmit">Submit</xy-button>
      <xy-button style="margin-left: 8px" @click="resetFields">Reset</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { Mentions, Form } from 'xiaoye-ui';
import { reactive } from 'vue';

const useForm = Form.useForm;
const { getMentions } = Mentions;
const checkMention = async (_, value) => {
  const mentions = getMentions(value);
  if (mentions.length < 2) {
    return Promise.reject('More than one must be selected!');
  } else {
    return Promise.resolve();
  }
};
const modelRef = reactive({
  bio: '',
  coders: '',
});
const rulesRef = reactive({
  bio: [{ required: true, message: 'Must input bio' }],
  coders: [{ required: true, validator: checkMention }],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const handleSubmit = e => {
  e.preventDefault();
  validate()
    .then(() => {
      console.log('Submit!!!', modelRef);
    })
    .catch(errors => {
      console.log('Errors in the form!!!', errors);
    });
};
const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
</script>
