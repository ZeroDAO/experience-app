<template>
  <a-layout-header>
    <a-row :gutter="[16, 16]">
      <a-col :span="6"><div class="logo"/></a-col>
      <a-col :span="12" class="search">
        <a-input-search v-model:value="value" size="large" placeholder="Name/Address/Index/" @search="onSearch" />
      </a-col>
      <a-col :span="6" class="right">
        <a-select v-model:value="value1" class="round" @focus="focus" ref="select" size="large" @change="handleChange">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
        <a-button type="primary" shape="round" size="large">
          登录
        </a-button>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script>
export default {}
</script>

<style lang="less">
a-layout-header {
  display: flex;
  padding: 15px;
  background: #ffffff;
  .ant-row {
    width: 100%;
  }
  .ant-input-search,
  .ant-input,
  .round,
  .ant-select-selection {
    border-radius: 80px !important;
    overflow: hidden;
    width: 100%;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    .ant-select {
      max-width: 120px;
      margin-right: 15px;
    }
  }
}
</style>
