<template>
  <div class="wallet">
    <a-row>
      <a-col :span="24" :lg="5"><TotalBalance :account-data="accountBalance"/></a-col>
      <a-col :span="24" :lg="12">
        <Transferable :account-data="accountBalance" />
      </a-col>
      <a-col :span="24" :lg="7"><BalanceDetails :account-data="accountBalance"/></a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import { useAccountBalance, useAccount } from '../hooks'
import TotalBalance from '@/components/wallet/TotalBalance.vue'
import BalanceDetails from '@/components/wallet/BalanceDetails.vue'
import Transferable from '@/components/wallet/Transferable.vue'

export default defineComponent({
  components: {
    TotalBalance,
    BalanceDetails,
    Transferable
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
}
</style>
