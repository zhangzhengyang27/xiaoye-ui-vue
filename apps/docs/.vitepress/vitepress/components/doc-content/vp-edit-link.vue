<script setup lang="ts">
import { ExternalLinkIcon } from '@xiaoye-ui/icons'
import { useEditLink } from '../../composables/edit-link'

const { url, text } = useEditLink()
</script>

<template>
  <div class="edit-link">
    <a
      v-if="url"
      class="link text-sm"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ text }}
      <ExternalLinkIcon
        style="width: 16px; height: 16px; vertical-align: text-top; line-height: 24px"
      />
    </a>
  </div>
</template>

<style scoped>
.link {
  display: inline-block;
  font-weight: 500;
}

.link:hover {
  text-decoration: none;
  color: var(--brand-color);
}
</style>
