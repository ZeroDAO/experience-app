<template>
  <a-card class="transferable">
    <div class="card-item">
      <div class="left"><span>Transferable</span><Balance :balance="accountData?.getUsableTransactionBalance()" /></div>
      <div class="card-bts">
        <a-button type="primary" shape="round" size="large" @click="showSocialModal" ghost>Social Transfer</a-button>
        <a-button type="primary" shape="round" size="large" @click="showTransferModal">Transfer</a-button>
      </div>
    </div>
    <a-divider />
    <div class="card-item">
      <div><span>Pending</span><Balance :balance="accountData?.pending" /></div>
      <div class="card-bts">
        <Claim :disabled="accountData?.pending <= 0" />
      </div>
    </div>
  </a-card>

  <a-spin :spinning="spinning" tip="Loading...">
    <a-modal v-model:visible="transferVisible" title="Transfer" :footer="null" :maskClosable="false">
      <TransferForm @close="onCloseModal" txType="SIGNED-TX" />
    </a-modal>

    <a-modal v-model:visible="socialVisible" title="Social Transfer" :footer="null" :maskClosable="false">
      <TransferForm @close="onCloseModal" txType="SIGNED-TX" :isSocail="true" />
    </a-modal>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, computed } from 'vue'
import { useStore } from 'vuex'
import Balance from '../common/Balance.vue'
import TransferForm from './forms/TransferForm.vue'
import Claim from './forms/Claim.vue'
import { StateType } from '@/@types'

export default defineComponent({
  name: 'TotalBalance',
  components: {
    Balance,
    TransferForm,
    Claim
  },
  props: {
    accountData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const transferVisible = ref<boolean>(false)
    const socialVisible = ref<boolean>(false)
    const store = useStore<StateType>()

    const showTransferModal = () => {
      transferVisible.value = true
    }

    const showSocialModal = () => {
      socialVisible.value = true
    }

    const spinning = computed(() => store.state.general.isLoading)

    return {
      transferVisible,
      socialVisible,
      showTransferModal,
      showSocialModal,
      spinning,
      ...toRefs(props)
    }
  },
  methods: {
    onCloseModal() {
      this.transferVisible = false
      this.socialVisible = false
    }
  }
})
</script>

<style lang="less">
.transferable {
  #balance {
    font-size: 26px;
  }
  .card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-bts {
    text-align: right;
    button {
      margin: 5px 0 5px 15px;
    }
  }
}
</style>
