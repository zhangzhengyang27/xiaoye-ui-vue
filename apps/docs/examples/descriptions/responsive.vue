<template>
  <xy-descriptions
    title="Responsive Descriptions"
    bordered
    :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
  >
    <xy-descriptions-item label="Product">Cloud Database</xy-descriptions-item>
    <xy-descriptions-item label="Billing">Prepaid</xy-descriptions-item>
    <xy-descriptions-item label="Time">18:00:00</xy-descriptions-item>
    <xy-descriptions-item label="Amount">$80.00</xy-descriptions-item>
    <xy-descriptions-item label="Discount">$20.00</xy-descriptions-item>
    <xy-descriptions-item label="Official">$60.00</xy-descriptions-item>
    <xy-descriptions-item label="Config Info">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
      Storage space: 10 GB
      <br />
      Replication factor: 3
      <br />
      Region: East China 1
    </xy-descriptions-item>
  </xy-descriptions>
</template>
