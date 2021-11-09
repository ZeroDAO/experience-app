<template>
  <a-layout-header>
    <a-row :gutter="[16, 16]">
      <a-col :span="6"><div class="logo"></div></a-col>
      <a-col :span="18" class="search">
        <a-input-search v-model:value="address" size="large" placeholder="Address" @search="goHome()" />
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const address = ref<string>('')
    return {
      address
    }
  },
  methods: {
    goHome() {
      this.$router.push(`/${this.address}`)
    }
  }
})
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
      img {
        width: 30px;
        margin-right: 10px;
        margin-left: -8px;
      }
    }
    .ant-select-selection-selected-value {
      overflow: unset;
    }
  }
}

.network-dropdown {
  img {
    width: 30px;
    margin-right: 10px;
  }
}
</style>
