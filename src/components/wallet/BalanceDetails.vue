<template>
  <a-card class="balance-details">
    <div class="card-item primary-light-bg">
      <span class="left">Social</span>
      <Balance :balance="accountData?.social" />
    </div>
    <div class="card-item primary-light-bg">
      <span class="left">Locked</span>
      <Balance :balance="accountData?.miscFrozen" />
    </div>
  </a-card>
</template>
<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import Balance from '../common/Balance.vue'

export default defineComponent({
  name: 'BalanceDetails',
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
.balance-details {
  .card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px auto;
    border-radius: 15px;
    line-height: 30px;
    padding: 15px;
  }
  #balance {
    font-size: 26px;
  }
}
</style>
