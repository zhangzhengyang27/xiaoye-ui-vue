<template>
  <xy-typography-paragraph v-model:content="editableStr" editable />
  <xy-typography-paragraph v-model:content="customIconStr" editable>
    <template #editableIcon><HighlightOutlined /></template>
    <template #editableTooltip>click to edit text</template>
  </xy-typography-paragraph>
  Trigger edit with:&nbsp;&nbsp;
  <xy-radio-group
    :value="stateToRadio()"
    @change="e => (chooseTrigger = radioToState(e.target.value))"
  >
    <xy-radio value="icon">icon</xy-radio>
    <xy-radio value="text">text</xy-radio>
    <xy-radio value="both">both</xy-radio>
  </xy-radio-group>
  <xy-typography-paragraph
    v-model:content="clickTriggerStr"
    :editable="{ triggerType: chooseTrigger }"
  >
    <template #editableTooltip>click to edit text</template>
  </xy-typography-paragraph>
  <xy-typography-paragraph v-model:content="customEnterIconStr" editable>
    <template #editableIcon><HighlightOutlined /></template>
    <template #editableTooltip>click to edit text</template>
    <template #editableEnterIcon="{ className }">
      <CheckOutlined :class="className" />
    </template>
  </xy-typography-paragraph>
  <xy-typography-paragraph v-model:content="noEnterIconStr" editable>
    <template #editableIcon><HighlightOutlined /></template>
    <template #editableTooltip>click to edit text</template>
    <template #editableEnterIcon>{{ null }}</template>
  </xy-typography-paragraph>
  <xy-typography-paragraph v-model:content="hideTooltipStr" :editable="{ tooltip: false }" />
  <xy-typography-paragraph
    v-model:content="lengthLimitedStr"
    :editable="{ maxlength: 50, autoSize: { maxRows: 5, minRows: 3 } }"
  />

  <xy-typography-paragraph copyable>This is a copyable text.</xy-typography-paragraph>
  <xy-typography-paragraph :copyable="{ text: 'Hello, Xiaoye UI!' }">
    Replace copy text.
  </xy-typography-paragraph>
  <xy-typography-paragraph copyable content="Custom Copy icon and replace tooltips text.">
    <template #copyableIcon="{ copied }">
      <SmileOutlined v-if="!copied" key="copy-icon" />
      <SmileFilled v-else key="copied-icon" />
    </template>
    <template #copyableTooltip="{ copied }">
      <span v-if="!copied" key="copy-tooltip">click here</span>
      <span v-else key="copied-tooltip">you clicked!!</span>
    </template>
  </xy-typography-paragraph>
  <xy-typography-paragraph :copyable="{ tooltip: false }">
    Hide Copy tooltips.
  </xy-typography-paragraph>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { HighlightOutlined, SmileOutlined, SmileFilled, CheckOutlined } from '@xiaoye-ui/icons';

const editableStr = ref('This is an editable text.');
watch(editableStr, () => {
  console.log('editableStr', editableStr.value);
});
const chooseTrigger = ref<('icon' | 'text')[]>(['icon']);

const radioToState = (input: string): ('icon' | 'text')[] => {
  switch (input) {
    case 'text':
      return ['text'];
    case 'both':
      return ['icon', 'text'];
    case 'icon':
    default:
      return ['icon'];
  }
};

const stateToRadio = () => {
  if (chooseTrigger.value.indexOf('text') !== -1) {
    return chooseTrigger.value.indexOf('icon') !== -1 ? 'both' : 'text';
  }
  return 'icon';
};
const customIconStr = ref('Custom Edit icon and replace tooltip text.');
const hideTooltipStr = ref('Hide Edit tooltip.');
const lengthLimitedStr = ref('This is an editable text with limited length.');
const clickTriggerStr = ref('Text or icon as trigger - click to start editing.');
const customEnterIconStr = ref('Editable text with a custom enter icon in edit field.');
const noEnterIconStr = ref('Editable text with no enter icon in edit field.');
</script>
