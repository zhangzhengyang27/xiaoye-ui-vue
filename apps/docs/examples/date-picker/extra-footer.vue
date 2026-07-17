<template>
  <xy-space direction="vertical">
    <xy-date-picker>
      <template #renderExtraFooter>extra footer</template>
    </xy-date-picker>
    <xy-date-picker show-time>
      <template #renderExtraFooter>extra footer</template>
    </xy-date-picker>
    <xy-range-picker>
      <template #renderExtraFooter>extra footer</template>
    </xy-range-picker>
    <xy-range-picker show-time>
      <template #renderExtraFooter>extra footer</template>
    </xy-range-picker>
    <xy-date-picker placeholder="Select month" picker="month">
      <template #renderExtraFooter>extra footer</template>
    </xy-date-picker>
  </xy-space>
</template>
