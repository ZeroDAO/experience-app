<template>
  <div class="wallet">
    <a-row>
      <a-col :span="24" :lg="5">
        <a-card class="total-balance-card primary-bg" title="Total Balance">
          <Balance v-if="accountBalance" :balance="accountBalance.getActualTotalBalance()" />
        </a-card>
      </a-col>
      <a-col :span="24" :lg="12">
        <Transferable :accountData="accountBalance" />
      </a-col>
      <a-col :span="24" :lg="7"><BalanceDetails :account-data="accountBalance"/></a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import { useAccountBalance, useAccount } from '../hooks'
import BalanceDetails from '@/components/wallet/BalanceDetails.vue'
import Transferable from '@/components/wallet/Transferable.vue'
import Balance from '@/components/common/Balance.vue'

export default defineComponent({
  components: {
    BalanceDetails,
    Transferable,
    Balance
  },
  setup() {
    const { api } = useSubstrateContext()
    const apiRef = computed(() => api)
    const { currentAccount } = useAccount()
    const { balanceRef, accountBalance } = useAccountBalance(apiRef, currentAccount)

    return {
      balanceRef,
      accountBalance,
      currentAccount
    }
  }
})
</script>

<style lang="less">
.wallet {
  height: 100%;
  padding: 10px;
  .ant-card {
    height: auto;
    margin: 15px 5px;
    border-radius: 20px;
  }
  .total-balance-card {
    .ant-card-head {
      border-bottom: none;
    }
    #balance {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 30px;
    }
  }
}
</style>
