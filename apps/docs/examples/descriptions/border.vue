<template>
  <xy-descriptions title="User Info" bordered>
    <xy-descriptions-item label="Product">Cloud Database</xy-descriptions-item>
    <xy-descriptions-item label="Billing Mode">Prepaid</xy-descriptions-item>
    <xy-descriptions-item label="Automatic Renewal">YES</xy-descriptions-item>
    <xy-descriptions-item label="Order time">2018-04-24 18:00:00</xy-descriptions-item>
    <xy-descriptions-item label="Usage Time" :span="2">2019-04-24 18:00:00</xy-descriptions-item>
    <xy-descriptions-item label="Status" :span="3">
      <xy-badge status="processing" text="Running" />
    </xy-descriptions-item>
    <xy-descriptions-item label="Negotiated Amount">$80.00</xy-descriptions-item>
    <xy-descriptions-item label="Discount">$20.00</xy-descriptions-item>
    <xy-descriptions-item label="Official Receipts">$60.00</xy-descriptions-item>
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
      <br />
    </xy-descriptions-item>
  </xy-descriptions>
</template>
