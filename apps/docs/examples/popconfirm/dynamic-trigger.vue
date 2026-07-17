<template>
  <div>
    <xy-popconfirm
      title="Are you sure delete this task?"
      :open="visible"
      ok-text="Yes"
      cancel-text="No"
      @openChange="handleVisibleChange"
      @confirm="confirm"
      @cancel="cancel"
    >
      <a href="#">Delete a task</a>
    </xy-popconfirm>
    <br />
    <br />
    Whether directly execute：
    <xy-checkbox v-model:checked="condition" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import message from 'xiaoye-ui/message';
const visible = ref<boolean>(false);
const condition = ref<boolean>(true);

const confirm = () => {
  visible.value = false;
  message.success('Next step.');
};

const cancel = () => {
  visible.value = false;
  message.error('Click on cancel.');
};

const handleVisibleChange = (bool: boolean) => {
  if (!bool) {
    visible.value = false;
    return;
  }
  // Determining condition before show the popconfirm.
  console.log(condition.value);
  if (condition.value) {
    confirm(); // next step
  } else {
    visible.value = true;
  }
};
</script>
