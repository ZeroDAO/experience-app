<template>
  <a-layout-header>
    <a-row :gutter="[16, 16]">
      <a-col :span="6"><div class="logo"></div></a-col>
      <a-col :span="12" class="search">
        <a-input-search v-model:value="value" size="large" placeholder="Name/Address/Index/" @search="onSearch" />
      </a-col>
      <a-col :span="6" class="right">
        <a-select v-model:value="network" class="round box-grey-background" dropdownClassName="network-dropdown" @focus="focus" ref="select" size="large" :dropdownMatchSelectWidth="false" @change="handleChange">
          <a-select-option value="polkadot">
            <div>
              <img :src="networks.polkadot.icon" />
              <span>polkadot</span>
            </div>
          </a-select-option>
          <a-select-option value="kusama">
            <div>
              <img :src="networks.kusama.icon" />
              <span>kusama</span>
            </div>
          </a-select-option>
        </a-select>
        <a-button type="primary" shape="round" size="large"> 登录 </a-button>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  data() {
    return {
      network: 'polkadot'
    }
  },
  setup() {
    const value = ref<string>('')
    const focus = () => {
      console.log('focus')
    }

    const onSearch = () => {
      console.log('onSearch')
    }

    const handleChange = (value: string) => {
      console.log(`selected ${value}`)
    }

    const networks = {
      polkadot: {
        icon: '../icon/polkadot.png'
      },
      kusama: {
        icon: '../icon/kusama.svg'
      }
    }

    return {
      value,
      networks,
      focus,
      handleChange,
      onSearch,
      value1: ref('lucy')
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
