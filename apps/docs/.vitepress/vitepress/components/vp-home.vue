<script setup lang="ts">
import { useData } from 'vitepress';

const { frontmatter } = useData();
const hero = frontmatter.value.hero || {};
const actions = hero.actions || [];
</script>

<template>
  <div class="vp-home">
    <div class="vp-home-hero">
      <h1 v-if="hero.name" class="name">{{ hero.name }}</h1>
      <p v-if="hero.text" class="text">{{ hero.text }}</p>
      <p v-if="hero.tagline" class="tagline">{{ hero.tagline }}</p>
      <div v-if="actions.length" class="actions">
        <a
          v-for="(action, index) in actions"
          :key="index"
          :href="action.link"
          :class="['action', action.theme === 'brand' ? 'brand' : 'alt']"
        >
          {{ action.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-home {
  padding: 96px 24px 64px;
}

.vp-home-hero {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

.name {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 16px;
  color: var(--xy-color-primary, #1890ff);
}

.text {
  font-size: 40px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 16px;
  color: var(--xy-color-text, #1f2329);
}

.tagline {
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 32px;
  color: var(--xy-color-text-secondary, #606266);
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;
}

.brand {
  background-color: var(--xy-color-primary, #1890ff);
  color: #fff;
}

.brand:hover {
  background-color: var(--xy-color-primary-hover, #40a9ff);
}

.alt {
  border: 1px solid var(--xy-color-border, #d9d9d9);
  color: var(--xy-color-text, #1f2329);
}

.alt:hover {
  border-color: var(--xy-color-primary, #1890ff);
  color: var(--xy-color-primary, #1890ff);
}
</style>
