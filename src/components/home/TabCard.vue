<template>
  <a-card class="user-tabs">
    <a-tabs v-model:activeKey="activeKey">
      <!-- <a-tab-pane key="1">
        <template #tab>
          <span>
            <IconFont type="icon-dongtai" />
            动态
          </span>
        </template>
        <a-list class="feed-list" :loading="loading" item-layout="horizontal" :data-source="dataList">
          <template #loadMore>
            <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
              <a-spin v-if="loadingMore" />
              <a-button v-else @click="loadMore()">loading more</a-button>
            </div>
          </template>
          <template #renderItem="{ item }">
            <a-list-item key="item.title">
              <a-list-item-meta :description="item.time">
                <template #title>
                  <a :href="item.href">{{ item.title }}</a>
                </template>
                <template #avatar><a-avatar :src="item.avatar" /></template>
              </a-list-item-meta>
              <div class="content">
                {{ item.content }}
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane> -->
      <a-tab-pane key="2">
        <template #tab>
          <span>
            <IconFont type="icon-guanzhu" />
            Trusting
          </span>
        </template>
        <a-list class="follow-list" :loading="loading" item-layout="horizontal" :data-source="trustingList">
          <!-- <template #loadMore>
            <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
              <a-spin v-if="loadingMore" />
              <a-button v-else @click="loadMore()">loading more</a-button>
            </div>
          </template> -->
          <template #renderItem="{ item }">
            <TrustingItem :address="item" />
          </template>
        </a-list>
      </a-tab-pane>
      <!-- <a-tab-pane key="4">
        <template #tab>
          <span>
            <IconFont type="icon-shenfen" />
            资料
          </span>
        </template>
        <div>
          <a-card>
            <IconFont type="icon-twitter" />
            <IconFont type="icon-web" />
            <IconFont type="icon-emailFilled" />
          </a-card>
          <a-descriptions bordered>
            <a-descriptions-item label="pubKey" :span="3">0xf1fe9f7ba0feab9e47684d4006ed25ad6c441a1553cef62748545ea575392af5</a-descriptions-item>
            <a-descriptions-item label="Address" :span="3">16UJBPHVqQ3xYXnmhEpaQtvSRnrP9k1XeE7WxoyCxsrL9AvV</a-descriptions-item>
            <a-descriptions-item label="ID" :span="2">jskx</a-descriptions-item>
            <a-descriptions-item label="email" :span="2">jack@hypersphere.ventures</a-descriptions-item>
            <a-descriptions-item label="riot" :span="2">@jack:web3.foundation</a-descriptions-item>
            <a-descriptions-item label="legal" :span="2">$20.00</a-descriptions-item>
            <a-descriptions-item label="twitter" :span="2">@jackbplatts</a-descriptions-item>
            <a-descriptions-item label="web" :span="3">https://bootcss.com</a-descriptions-item>
          </a-descriptions>
        </div>
      </a-tab-pane> -->
      <!-- <a-tab-pane key="3">
        <template #tab>
          <span>
            <IconFont type="icon-app" />
            应用
          </span>
        </template>
        <a-row :gutter="10">
          <a-col :span="12">
            <a-card hoverable>
              <template #cover>
                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
              </template>
              <a-card-meta title="GitHub 动态" description="将 Github 动态推送给你的粉丝。"> </a-card-meta>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card hoverable>
              <template #cover>
                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
              </template>
              <a-card-meta title="GitHub 动态" description="将 Github 动态推送给你的粉丝。"> </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane> -->
    </a-tabs>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import TrustingItem from '@/components/home/TrustingItem.vue'

export default defineComponent({
  name: 'TabCard',
  props: {
    trustingList: {
      type: Array
    }
  },
  setup(props) {
    const loading = false
    return {
      activeKey: ref('2'),
      loading,
      ...toRefs(props)
    }
  },
  components: {
    TrustingItem
  },
  methods: {
    hello() {
      return 'nihao'
    }
  }
})
</script>
