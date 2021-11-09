<template>
  <a-list-item :key="address" class="trusting-item">
    <user-card :address="address" />
  </a-list-item>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { useAccount } from '@/hooks'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import UserCard from '../common/UserCard.vue'

export default defineComponent({
  name: 'TrustingItem',
  components: {
    UserCard
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

    return {
      userName,
      allAccountsInfo,
      ...toRefs(props)
    }
  }
})
</script>

<style lang="less">
.trusting-item {
  padding: 0 !important;
  .ant-list-item {
    padding: 0 !important;
  }
  .ant-card {
    width: 100% !important;
    margin-bottom: 0 !important;
    .ant-card-body {
      padding: 0 !important;
    }
  }
}
</style>
