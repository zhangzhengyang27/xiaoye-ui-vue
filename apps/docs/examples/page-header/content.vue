<template>
  <div class="components-page-header-demo-content">
    <xy-page-header
      title="Title"
      class="site-page-header"
      sub-title="This is a subtitle"
      :avatar="{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }"
      :breadcrumb="{ routes }"
    >
      <template #tags>
        <xy-tag color="blue">Running</xy-tag>
      </template>
      <template #extra>
        <xy-button key="3">Operation</xy-button>
        <xy-button key="2">Operation</xy-button>
        <xy-button key="1" type="primary">Primary</xy-button>
        <xy-dropdown key="more">
          <xy-button :style="{ border: 'none', padding: 0 }">
            <EllipsisOutlined :style="{ fontSize: '20px', verticalAlign: 'top' }" />
          </xy-button>
          <template #overlay>
            <xy-menu>
              <xy-menu-item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                  1st menu item
                </a>
              </xy-menu-item>
              <xy-menu-item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                  2nd menu item
                </a>
              </xy-menu-item>
              <xy-menu-item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                  3rd menu item
                </a>
              </xy-menu-item>
            </xy-menu>
          </template>
        </xy-dropdown>
      </template>
      <xy-row class="content">
        <div style="flex: 1">
          <p>
            Xiaoye UI interprets the color system into two levels: a system-level color system and a
            product-level color system.
          </p>
          <p>
            Xiaoye UI&#x27;s design team preferred to design with the HSB color model, which makes
            it easier for designers to have a clear psychological expectation of color when
            adjusting colors, as well as facilitate communication in teams.
          </p>
          <div>
            <template v-for="item in iconLinks" :key="item.src">
              <a class="example-link">
                <img class="example-link-icon" :src="item.src" :alt="item.text" />
                {{ item.text }}
              </a>
            </template>
          </div>
        </div>
        <div class="image">
          <img
            src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"
            alt="content"
            style="width: 100%"
          />
        </div>
      </xy-row>
    </xy-page-header>
  </div>
</template>

<script lang="ts" setup>
import { EllipsisOutlined } from '@xiaoye-ui/icons';

const routes = [
  {
    path: 'index',
    breadcrumbName: 'First-level Menu',
  },
  {
    path: 'first',
    breadcrumbName: 'Second-level Menu',
  },
  {
    path: 'second',
    breadcrumbName: 'Third-level Menu',
  },
];

interface IconLink {
  src: string;
  text: string;
}
const iconLinks: IconLink[] = [
  {
    src: 'https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg',
    text: 'Quick Start',
  },
  {
    src: 'https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg',
    text: 'Product Info',
  },
  {
    src: 'https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg',
    text: 'Product Doc',
  },
];
</script>
<style scoped>
#components-page-header-demo-content .image {
  margin: 0 0 0 60px;
  display: flex;
  align-items: center;
}

#components-page-header-demo-content .xy-page-header-rtl .image {
  margin: 0 60px 0 0;
}

#components-page-header-demo-content .example-link {
  line-height: 24px;
  margin-right: 16px;
}
[data-theme='compact'] #components-page-header-demo-content .example-link {
  line-height: 20px;
}
#components-page-header-demo-content .example-link-icon {
  margin-right: 8px;
}

[data-theme='compact'] #components-page-header-demo-content .example-link-icon {
  width: 20px;
  height: 20px;
}

#components-page-header-demo-content .xy-page-header-rtl .example-link {
  float: right;
  margin-right: 0;
  margin-left: 16px;
}
#components-page-header-demo-content .xy-page-header-rtl .example-link-icon {
  margin-right: 0;
  margin-left: 8px;
}
#components-page-header-demo-content .content p {
  margin-bottom: 1em;
  color: rgba(0, 0, 0, 0.85);
  overflow-wrap: break-word;
}

@media (max-width: 768px) {
  #components-page-header-demo-content .image {
    flex: 100%;
    margin: 24px 0 0;
  }
}
</style>
