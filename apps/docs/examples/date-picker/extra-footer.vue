<template>
  <a-space direction="vertical">
    <a-date-picker>
      <template #renderExtraFooter>extra footer</template>
    </a-date-picker>
    <a-date-picker show-time>
      <template #renderExtraFooter>extra footer</template>
    </a-date-picker>
    <a-range-picker>
      <template #renderExtraFooter>extra footer</template>
    </a-range-picker>
    <a-range-picker show-time>
      <template #renderExtraFooter>extra footer</template>
    </a-range-picker>
    <a-date-picker placeholder="Select month" picker="month">
      <template #renderExtraFooter>extra footer</template>
    </a-date-picker>
  </a-space>
</template>
