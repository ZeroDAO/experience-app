<template>
  <a-card class="head">
    <template #cover>
      <img alt="example" src="../../../public/bg.jpg" />
    </template>
    <div class="info">
      <a-badge>
        <Beachball class="avatar" :size="120" :address="address" />
      </a-badge>
      <div class="trust-btm">
        <TrustButton :targer="address" />
      </div>
    </div>
    <div class="identity">
      <div class="left">
        <p>{{ meta.name }}</p>
        <p><a-typography-paragraph copyable ellipsis :content="address"></a-typography-paragraph></p>
        <!-- <div class="tags">
          <div class="tag border-primary primary-light-bg">
            <img src="../../../public/icon/polkadot.png" />
            <span class="primary">验证人</span>
          </div>
        </div> -->
      </div>
      <div class="right">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">在subscan上查看</a-menu-item>
              <a-menu-item key="2">查看 NFT 作品</a-menu-item>
            </a-menu>
          </template>
          <a-button shape="round">
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <a-divider />
    <div class="user-statistic">
      <div class="user-follow">
        <!-- <a-statistic :value="1128">
          <template #suffix>
            <span class="text-second">fans</span>
          </template>
        </a-statistic> -->
        <a-statistic :value="trusCount">
          <template #suffix>
            <span class="text-second">trusting</span>
          </template>
        </a-statistic>
      </div>
      <a-statistic class="reputation" :value="reputation[0] ? reputation[0].score : 0">
        <template #prefix>
          <span class="text-second">Reputation</span>
        </template>
      </a-statistic>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, toRefs, Ref, computed } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import TrustButton from './TrustButton.vue'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import { useReputation, useUserInfo } from '@/hooks'
import Beachball from '../id/Beachball.vue'
import { useAccount } from '@/hooks'

export default defineComponent({
  name: 'HeadCard',
  components: {
    DownOutlined,
    TrustButton,
    Beachball
  },
  props: {
    trusCount: {
      type: Number,
      required: true,
      default: 0
    },
    address: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { api } = useSubstrateContext()
    const apiRef = computed(() => api)

    const addressRef = computed(() => props.address)

    const { userAccountInfo } = useAccount(addressRef as Ref<string>)
    const reputation = useReputation(apiRef, addressRef as Ref<string>)

    const { meta } = useUserInfo(props.address as string)

    return {
      reputation,
      meta,
      userAccountInfo,
      ...toRefs(props)
    }
  }
})
</script>

<style lang="less">
.trust-btm {
  min-height: 36px;
}
.head {
  .identity {
    display: flex;
    justify-content: space-between;
    text-align: left;
    margin-top: 30px;
    .left {
      max-width: 80%;
      p:first-child {
        font-size: 26px;
        margin: 15px auto 0 auto;
      }
      p:nth-child(2) {
        margin: 0;
        color: #c3bebe;
      }
    }
    .right {
      display: flex;
      align-items: flex-end;
    }
  }
}
</style>
