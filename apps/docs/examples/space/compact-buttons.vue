<template>
  <div>
    <xy-space-compact block>
      <xy-tooltip title="Like">
        <xy-button>
          <LikeOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-tooltip title="Comment">
        <xy-button>
          <CommentOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-tooltip title="Star">
        <xy-button>
          <StarOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-tooltip title="Heart">
        <xy-button>
          <HeartOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-tooltip title="Share">
        <xy-button>
          <ShareAltOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-tooltip title="Download">
        <xy-button>
          <DownloadOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-dropdown placement="bottomRight" :trigger="['click']">
        <xy-button>
          <EllipsisOutlined />
        </xy-button>

        <template #overlay>
          <xy-menu>
            <xy-menu-item>
              <a href="javascript:;">1st menu item</a>
            </xy-menu-item>
            <xy-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </xy-menu-item>
            <xy-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </xy-menu-item>
          </xy-menu>
        </template>
      </xy-dropdown>
    </xy-space-compact>
    <br />
    <xy-space-compact block>
      <xy-button type="primary">Button 1</xy-button>
      <xy-button type="primary">Button 2</xy-button>
      <xy-button type="primary">Button 3</xy-button>
      <xy-button type="primary">Button 4</xy-button>
      <xy-tooltip title="Tooltip">
        <xy-button type="primary" disabled>
          <DownloadOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-tooltip title="Tooltip">
        <xy-button type="primary" disabled>
          <DownloadOutlined />
        </xy-button>
      </xy-tooltip>
    </xy-space-compact>
    <br />
    <xy-space-compact block>
      <xy-button>Button 1</xy-button>
      <xy-button>Button 2</xy-button>
      <xy-button>Button 3</xy-button>
      <xy-tooltip title="Tooltip">
        <xy-button disabled>
          <DownloadOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-tooltip title="Tooltip">
        <xy-button>
          <DownloadOutlined />
        </xy-button>
      </xy-tooltip>
      <xy-button type="primary">Button 4</xy-button>
      <xy-dropdown placement="bottomRight" :trigger="['click']">
        <xy-button type="primary">
          <EllipsisOutlined />
        </xy-button>

        <template #overlay>
          <xy-menu>
            <xy-menu-item>
              <a href="javascript:;">1st menu item</a>
            </xy-menu-item>
            <xy-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </xy-menu-item>
            <xy-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </xy-menu-item>
          </xy-menu>
        </template>
      </xy-dropdown>
    </xy-space-compact>
  </div>
</template>

<script lang="ts" setup>
import {
  DownloadOutlined,
  EllipsisOutlined,
  HeartOutlined,
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  ShareAltOutlined,
} from '@xiaoye-ui/icons';
</script>
