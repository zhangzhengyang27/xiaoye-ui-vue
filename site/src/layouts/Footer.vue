<template>
  <footer id="footer">
    <div class="footer-wrap">
      <a-row>
        <a-col :md="6" :sm="24" :xs="24">
          <div class="footer-center">
            <h2>Xiaoye UI</h2>
            <div>
              <a href="https://github.com/xiaoye-ui/xiaoye-ui" target="_blank">
                <span>GitHub</span>
              </a>
            </div>
            <div>
              <a href="https://cn.vuejs.org/" target="_blank">Vue</a>
            </div>
            <div>
              <a href="https://vitejs.dev/" target="_blank">Vite</a>
            </div>
          </div>
        </a-col>
        <a-col :md="6" :sm="24" :xs="24">
          <div class="footer-center">
            <h2>{{ isCN ? '社区' : 'Community' }}</h2>
            <div>
              <a href="https://github.com/xiaoye-ui/xiaoye-ui/releases" target="_blank">
                <span>{{ isCN ? '更新记录' : 'Change Log' }}</span>
              </a>
            </div>
            <div>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/xiaoye-ui/xiaoye-ui/issues"
              >
                <span>{{ isCN ? '报告 Bug' : 'Bug Report' }}</span>
              </a>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </footer>
</template>
<script>
import dayjs from 'dayjs';
import { computed } from 'vue';
export default {
  props: {
    isCN: Boolean,
  },
  setup() {
    const showJeecg = computed(() => {
      return dayjs().isBefore(dayjs('2023-09-10'));
    });
    return {
      dayjs,
      showJeecg,
    };
  },
};
</script>
