<template>
  <a-card class="total-balance-card primary-bg" title="Total Balance">
    <Balance v-if="accountData" :balance="accountData?.getActualTotalBalance()" />
  </a-card>
</template>
<script lang="ts">
import { defineComponent, toRefs, PropType } from 'vue'
import Balance from '../common/Balance.vue'
import { AccountBalance } from '@/hooks'

export default defineComponent({
  name: 'TotalBalance',
  props: {
    accountData: {
      type: Object as PropType<AccountBalance> | undefined,
      required: true,
      default: undefined
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
