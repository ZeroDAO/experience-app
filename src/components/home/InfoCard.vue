<template>
  <!-- <a-card title="Basic Info" :bordered="false" class="basic-info">
    <div class="basic-info-content">
      <a><IconFont type="icon-twitter" />@jackbplatts</a>
      <IconFont type="icon-twitter" />
    </div>
    <a-divider />
    <div class="basic-info-content">
      <a><IconFont type="icon-twitter" />@jackbplatts</a>
      <IconFont type="icon-twitter" />
    </div>
    <a-divider />
    <div class="basic-info-content">
      <a><IconFont type="icon-twitter" />@jackbplatts</a>
      <IconFont type="icon-twitter" />
    </div>
  </a-card> -->
  <a-card class="info-card" title="Balance" :bordered="false" style="width: 100%">
    <div class="basic-info-content">
      <a><AccountBookOutlined /><span class="text-second">Total Balance</span></a>
      <a><Balance :balance="balanceRef"/></a>
    </div>
    <a-divider />
    <div class="basic-info-content">
      <a><UserSwitchOutlined /><span class="text-second">Social Balance</span></a>
      <a><Balance :balance="accountBalance?.social"/></a>
    </div>
    <a-divider />
    <div class="basic-info-content">
      <a><LockOutlined /><span class="text-second">Locked Balance</span></a>
      <a><Balance :balance="accountBalance?.miscFrozen"/></a>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, computed, Ref } from 'vue'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import { useAccountBalance } from '@/hooks'
import { AccountBookOutlined, LockOutlined, UserSwitchOutlined } from '@ant-design/icons-vue'
import Balance from '../common/Balance.vue'

export default defineComponent({
  name: 'InfoCard',
  components: {
    AccountBookOutlined,
    LockOutlined,
    UserSwitchOutlined,
    Balance
  },
  props: {
    address: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { api } = useSubstrateContext()
    const apiRef = computed(() => api)
    const addressRef = computed(() => props.address)
    const { balanceRef, accountBalance } = useAccountBalance(apiRef, addressRef as Ref<string>)
    return {
      accountBalance,
      balanceRef
    }
  }
})
</script>

<style lang="less">
.info-card {
  .basic-info-content {
    a:nth-child(2) {
      color: #ffffff;
    }
  }
}
</style>
