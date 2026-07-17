<template>
  <div class="components-page-header-demo-responsive" style="border: 1px solid rgb(235, 237, 240)">
    <xy-page-header title="Title" sub-title="This is a subtitle" @back="() => $router.go(-1)">
      <template #extra>
        <xy-button key="3">Operation</xy-button>
        <xy-button key="2">Operation</xy-button>
        <xy-button key="1" type="primary">Primary</xy-button>
      </template>
      <template #footer>
        <xy-tabs>
          <xy-tab-pane key="1" tab="Details" />
          <xy-tab-pane key="2" tab="Rule" />
        </xy-tabs>
      </template>
      <div class="content">
        <div class="main">
          <xy-descriptions size="small" :column="2">
            <xy-descriptions-item label="Created">Lili Qu</xy-descriptions-item>
            <xy-descriptions-item label="Association">
              <a>421421</a>
            </xy-descriptions-item>
            <xy-descriptions-item label="Creation Time">2017-01-10</xy-descriptions-item>
            <xy-descriptions-item label="Effective Time">2017-10-10</xy-descriptions-item>
            <xy-descriptions-item label="Remarks">
              Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
            </xy-descriptions-item>
          </xy-descriptions>
        </div>
        <div class="extra">
          <div
            :style="{
              display: 'flex',
              width: 'max-content',
              justifyContent: 'flex-end',
            }"
          >
            <xy-statistic
              title="Status"
              value="Pending"
              :style="{
                marginRight: '32px',
              }"
            />
            <xy-statistic title="Price" prefix="$" :value="568.08" />
          </div>
        </div>
      </div>
    </xy-page-header>
  </div>
</template>
<style scoped>
.components-page-header-demo-responsive {
  padding-bottom: 20px;
}
.components-page-header-demo-responsive tr:last-child td {
  padding-bottom: 0;
}
#components-page-header-demo-responsive .content {
  display: flex;
}
#components-page-header-demo-responsive .xy-statistic-content {
  font-size: 20px;
  line-height: 28px;
}
@media (max-width: 576px) {
  #components-page-header-demo-responsive .content {
    display: block;
  }

  #components-page-header-demo-responsive .main {
    width: 100%;
    margin-bottom: 12px;
  }

  #components-page-header-demo-responsive .extra {
    width: 100%;
    margin-left: 0;
    text-align: left;
  }
}
</style>
