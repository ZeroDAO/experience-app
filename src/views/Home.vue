<template>
  <div class="page home">
    <a-result v-if="!userAddress" status="404" title="No User found" sub-title="No wallet login or wrong address."> </a-result>
    <a-row v-else :gutter="10">
      <a-col class="gutter-row" :span="24" :md="16">
        <HeadCard :address="userAddress" :trusCount="userTrustList.length" />
        <TabCard :trustingList="userTrustList" />
      </a-col>
      <a-col class="gutter-row" :span="0" :md="8">
        <InfoCard :address="userAddress" />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, Ref } from 'vue'
import HeadCard from '../components/home/HeadCard.vue'
import TabCard from '../components/home/TabCard.vue'
import InfoCard from '../components/home/InfoCard.vue'
import { isValidAddressPolkadotAddress } from '@/utils/common'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import { useTrusting } from '@/hooks/useTrusting'

export default defineComponent({
  components: {
    HeadCard,
    TabCard,
    InfoCard
  },
  props: {
    user: {
      type: String
    }
  },
  setup(props) {
    const loading = false

    const context = useSubstrateContext()

    const apiRef = computed(() => context.api)

    const userAddress = computed(() => (props.user ? (isValidAddressPolkadotAddress(props.user as string) ? props.user : null) : context.myAddress ? context.myAddress : null))
    const userTrustList = useTrusting(apiRef, userAddress as Ref<string>)

    return {
      loading,
      context,
      userTrustList,
      userAddress
    }
  }
})
</script>

<style lang="less">
@import '../styles/var.less';
.hello {
  color: red;
  font-size: 20px;
  &-test {
    color: #ff0000;
  }
}
.ant-card {
  text-align: left;
  margin-bottom: 15px !important;
}
.home {
  .head {
    border-radius: 20px 0 20px;
    overflow: hidden;
    .ant-card-cover {
      max-height: 300px;
      overflow: hidden;
      min-height: 120px;
      background: linear-gradient(45deg, #0025ff, #ff7f0b);
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    .ant-badge {
      .avatar {
        width: 130px;
        border-radius: 100%;
        border: 5px solid #3e66a7;
        background: #3e66a7;
        position: absolute;
        left: -5px;
        top: -60px;
      }
    }
  }
}
.feed-list {
  .ant-list-item {
    display: block !important;
  }
}
.follow-list {
  .ant-list-item-meta {
    align-items: center;
  }
}
.basic-info-content {
  display: flex;
  justify-content: space-between;
  a span {
    margin-right: 10px;
  }
}
.ant-list-item {
  .ant-avatar {
    width: 52px;
    height: 52px;
  }
  .ant-list-item-meta-title > a {
    color: #ffffff;
    transition: all 0.3s;
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    font-size: 18px;
    margin: 20px auto 20px 70px;
  }
}
.ant-statistic-content-prefix {
  font-size: 16px;
  line-height: 20px;
}
.user-statistic {
  display: flex;
  justify-content: space-between;
  .user-follow {
    display: flex;
    .ant-statistic {
      margin-right: 20px;
    }
    .ant-statistic-content-value-int {
      color: #ffffff;
    }
  }
}
.ant-statistic-content {
  line-height: 1.2em;
}
.reputation {
  text-align: right;
  .ant-statistic-content-value-int {
    font-size: 26px;
  }
}
.user-tabs {
  margin-top: 15px !important;
  text-align: left;
}

.tags {
  display: flex;
  margin-top: 5px;
}
.tag {
  margin-right: 5px;
  border-radius: 20px;
  overflow: hidden;
  img {
    width: 24px;
    border-radius: 24px;
    overflow: hidden;
  }
  span {
    font-size: 12px;
    padding: 3px 10px;
  }
}
</style>
