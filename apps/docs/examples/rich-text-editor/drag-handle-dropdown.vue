<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      v-model="content"
      placeholder="鼠标 hover 段落，点击左侧手柄会展开操作菜单..."
    >
      <template #default="{ editor, handlers }">
        <xy-rich-text-editor-drag-handle
          v-if="editor"
          :editor="editor"
          @hover="onNodeChange"
          @node-change="onNodeChange"
        >
          <template #default>
            <div ref="wrapperRef" class="drag-handle-wrapper">
              <button
                type="button"
                class="drag-handle-button"
                aria-label="更多操作"
                title="更多操作"
                @click.stop="toggleDropdown"
              >
                ⋮⋮
              </button>
              <ul v-if="dropdownVisible" class="drag-handle-menu">
                <li
                  :class="{ disabled: !canExecute(handlers, editor, 'duplicate') }"
                  @click.stop="runAction(handlers, editor, 'duplicate')"
                >
                  复制
                </li>
                <li
                  :class="{ disabled: !canExecute(handlers, editor, 'delete') }"
                  @click.stop="runAction(handlers, editor, 'delete')"
                >
                  删除
                </li>
                <li class="separator"></li>
                <li
                  :class="{ disabled: !canExecute(handlers, editor, 'moveUp') }"
                  @click.stop="runAction(handlers, editor, 'moveUp')"
                >
                  上移
                </li>
                <li
                  :class="{ disabled: !canExecute(handlers, editor, 'moveDown') }"
                  @click.stop="runAction(handlers, editor, 'moveDown')"
                >
                  下移
                </li>
              </ul>
            </div>
          </template>
        </xy-rich-text-editor-drag-handle>
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">提示：鼠标 hover 到任意段落后，点击左侧的 ⋮⋮ 按钮可展开操作菜单。</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const content = ref(
  '<h2>Drag Handle Dropdown 示例</h2><p>hover 段落后，点击左侧的 ⋮⋮ 按钮可以展开操作菜单。</p><p>支持复制、删除、上移、下移当前块。</p>',
);

const currentNode = ref<{ node: any; pos: number } | null>(null);
const dropdownVisible = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

const onNodeChange = ({ node, pos }: { node: any; pos: number }) => {
  currentNode.value = { node, pos };
};

const canExecute = (handlers: any, editor: any, action: string): boolean => {
  if (!currentNode.value) return false;
  const handler = handlers?.[action];
  if (!handler) return false;
  try {
    return handler.canExecute(editor, { pos: currentNode.value.pos });
  } catch {
    return false;
  }
};

const runAction = (handlers: any, editor: any, action: string) => {
  if (!currentNode.value) {
    dropdownVisible.value = false;
    return;
  }
  const handler = handlers?.[action];
  if (handler && canExecute(handlers, editor, action)) {
    const chain = handler.execute(editor, { pos: currentNode.value.pos });
    if (chain && typeof chain.run === 'function') {
      chain.run();
    }
  }
  dropdownVisible.value = false;
};

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const onDocumentClick = (e: MouseEvent) => {
  if (!wrapperRef.value) return;
  if (!wrapperRef.value.contains(e.target as Node)) {
    dropdownVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.drag-handle-wrapper {
  position: relative;
  display: inline-flex;
}
.drag-handle-button {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: grab;
  color: #999;
  font-size: 14px;
  letter-spacing: -2px;
  border-radius: 4px;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.drag-handle-button:hover {
  background: #f0f0f0;
  color: #333;
}
.drag-handle-button:active {
  cursor: grabbing;
}
.drag-handle-menu {
  position: absolute;
  left: 100%;
  top: 0;
  margin: 0 0 0 4px;
  padding: 4px 0;
  list-style: none;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  min-width: 96px;
  z-index: 1050;
  font-size: 13px;
  color: #333;
  user-select: none;
}
.drag-handle-menu li {
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.drag-handle-menu li:hover:not(.disabled):not(.separator) {
  background: #f5f5f5;
}
.drag-handle-menu li.disabled {
  color: #bbb;
  cursor: not-allowed;
}
.drag-handle-menu li.separator {
  height: 1px;
  padding: 0;
  margin: 4px 8px;
  background: #f0f0f0;
  cursor: default;
}
.demo-tip {
  font-size: 12px;
  color: #999;
}
</style>
