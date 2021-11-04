<template>
  <a-card class="total-balance-card primary-bg" title="Total Balance">
    <Balance :balance="accountData?.getActualTotalBalance()" />
  </a-card>
</template>
<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import Balance from '../common/Balance.vue'

export default defineComponent({
  name: 'TotalBalance',
  props: {
    accountData: {
      type: Object
    }
  },
  components: {
    Balance
  },
  setup(props) {
    return {
      ...toRefs(props)
    }
  }
})
</script>

<style lang="less">
.total-balance-card {
  .ant-card-head {
    border-bottom: none;
  }
  .ant-card-head-title {
    color: #fff !important;
  }

  #balance {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
  }
}
</style>
