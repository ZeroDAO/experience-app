<template>
  <a-card class="user-card" :bordered="false">
    <div class="info">
      <Beachball class="avatar" :size="50" :address="address" />
      <div class="mid">
        <a :href="'./' + address">{{ userName }}</a>
        <a-typography-paragraph copyable ellipsis :content="address"></a-typography-paragraph>
      </div>
    </div>
    <TrustButton :targer="address" />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed } from 'vue'
import { useAccount } from '@/hooks'
import TrustButton from '../home/TrustButton.vue'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import Beachball from '../id/Beachball.vue'
import { getUserName } from '@/utils/common'

export default defineComponent({
  name: 'UserCard',
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

    // const userName = getUserName(props.address as string)
    const userName = computed(() => getUserName(props.address as string))

    return {
      userName,
      allAccountsInfo,
      ...toRefs(props)
    }
  }
})
</script>

<style lang="less">
.user-card {
  .ant-typography-single-line {
    white-space: break-spaces !important;
  }
  .ant-card {
    border-radius: 15px !important;
  }
  .ant-card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .info {
      display: flex;
      align-items: center;
      .mid {
        margin: auto 15px;
        a {
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
