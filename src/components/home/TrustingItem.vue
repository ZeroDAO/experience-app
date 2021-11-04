<template>
  <a-list-item :key="address" class="trusting-item">
    <a-list-item-meta :description="address">
      <template #title>
        <a :href="'./' + address">{{ allAccountsInfo[address] ? allAccountsInfo[address].meta.name : ' ' }}</a>
      </template>
      <template #avatar>
        <Beachball class="avatar" :size="50" :address="address" />
      </template>
    </a-list-item-meta>
    <div class="follow">
      <TrustButton :targer="address" />
      <!-- <a-button :disabled="isMine" type="primary" :ghost="isTrusted" shape="round" size="large">{{ isTrusted ? '- UnTrust' : '+ Trust' }} </a-button> -->
    </div>
  </a-list-item>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { useAccount } from '@/hooks'
import TrustButton from './TrustButton.vue'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import Beachball from '../id/Beachball.vue'

export default defineComponent({
  name: 'TrustingItem',
  components: {
    TrustButton,
    Beachball
  },
  props: {
    address: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props) {
    const context = useSubstrateContext()
    const apiRef = ref(context.api)
    const { allAccountsInfo } = useAccount(apiRef as any)

    const userName = ' '
    const isTrusted = context.myTrusting.indexOf(props.address as string) > -1
    const isMine = props.address && context.myAddress == props.address

    return {
      userName,
      isMine,
      isTrusted,
      allAccountsInfo,
      ...toRefs(props)
    }
  }
})
</script>

<style lang="less">
.trusting-item {
  .ant-list-item-meta-description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
