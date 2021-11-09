<template>
  <div>
    <IdenticonCard :address="currentAccount" @click="showModal" />
    <a-modal v-model:visible="visible" title="Choose Account" @ok="handleOk" @cancel="cancel">
      <a-radio-group v-model:value="selAccount" buttonStyle="solid">
        <a-radio-button v-for="(account, i) in allUserInfo" :key="i" :value="account.address">
          <Identicon :name="account.meta.name" :address="account.address" :nameType="account.meta.mould" :size="50" />
        </a-radio-button>
      </a-radio-group>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import IdenticonCard from './id/IdenticonCard.vue'
import Identicon from './id/Identicon.vue'
import { useStore } from 'vuex'
import { StateType } from '@/@types'
import { setStoreState } from '@/store/utils'
import { useAllUsersInfo } from '@/hooks'

export default defineComponent({
  name: 'AccountSelector',
  components: { IdenticonCard, Identicon },
  emits: {
    close: null
  },
  setup(_, { emit }) {
    const visible = ref<boolean>(false)
    const store = useStore<StateType>()

    const allUserInfo = useAllUsersInfo()

    const currentAccount = computed(() => store.state.general.currentAccount)
    const selAccount = ref(currentAccount.value)

    const showModal = () => {
      visible.value = true
    }

    const handleOk = () => {
      setStoreState('general', 'currentAccount', selAccount.value)
      visible.value = false
      emit('close')
    }

    const cancel = () => {
      emit('close')
    }

    return {
      visible,
      showModal,
      handleOk,
      currentAccount,
      selAccount,
      cancel,
      allUserInfo
    }
  }
})
</script>

<style lang="less">
.ant-radio-group {
  width: 100% !important;
  .ant-radio-button-wrapper {
    width: 100%;
    display: block;
    margin: 10px auto;
  }
  .ant-radio-button-wrapper {
    height: auto !important;
    border-radius: 20px !important;
    border: none !important;
    padding: 0;
    &:before {
      width: 0 !important;
    }
  }
}
</style>
