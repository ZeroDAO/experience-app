<template>
  <a-card :bordered="false" :hoverable="true" class="id-card">
    <Beachball class="avatar" :size="50" :address="address" />
    <div class="address">{{ address }}</div>
    <DownOutlined />
  </a-card>
</template>

<script>
import { defineComponent } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import Beachball from './Beachball'

export default defineComponent({
  name: 'IdenticonCard',
  components: {
    DownOutlined,
    Beachball
  },
  props: {
    address: {
      type: String,
      default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
    }
  }
})
</script>

<style lang="less">
.id-card {
  background: #0025ff !important;
  margin: 10px !important;
  border-radius: 20px !important;
  .ant-card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #fff;
    padding: 10px;
  }
  .avatar {
    display: table;
    margin-right: 15px;
  }
  .address {
    width: 20em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover {
    background: #2640d1 !important;
  }
  .anticon-down {
    font-size: 13px;
    margin-right: 10px;
  }
}
</style>
