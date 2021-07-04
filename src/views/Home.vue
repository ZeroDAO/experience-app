<template>
  <div class="page home">
    <a-row :gutter="10">
      <a-col class="gutter-row" :xs="24" :sm="18">
        <a-card class="head">
          <template #cover>
            <img alt="example" src="../../public/bg.jpg" />
          </template>
          <div class="info">
            <a-badge>
              <!--
              <template #count>
                <clock-circle-outlined style="color: #f5222d" />
              </template>
              -->
              <img src="../../public/avatar.jpg" />
            </a-badge>
            <div>
              <a-button type="primary" shape="round" size="large"> + Follow </a-button>
            </div>
          </div>
          <div class="identity">
            <div class="left">
              <p>SUBSCAN</p>
              <p>14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ</p>
              <div class="tags">
                <div class="tag border-primary primary-bg">
                  <img src="../../public/icon/polkadot.png" />
                  <span class="primary">验证人</span>
                </div>
                <div class="tag border-primary primary-bg">
                  <img src="../../public/icon/kusama.svg" />
                  <span class="primary">身份注册商</span>
                </div>
              </div>
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
              <a-statistic :value="1128">
                <template #suffix>
                  <span class="text-second">fans</span>
                </template>
              </a-statistic>
              <a-statistic :value="39">
                <template #suffix>
                  <span class="text-second">following</span>
                </template>
              </a-statistic>
            </div>
            <a-statistic class="reputation" :precision="2" :value="1128.22823">
              <template #prefix>
                <span class="text-second">Reputation</span>
              </template>
            </a-statistic>
          </div>
        </a-card>
        <a-card class="user-tabs">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1">
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
                    <a-button v-else @click="loadMore">loading more</a-button>
                  </div>
                </template>
                <template #renderItem="{ item }">
                  <a-list-item key="item.title">
                    <a-list-item-meta :description="item.time">
                      <template #title>
                        <a :href="item.href">{{ item.title }}</a>
                      </template>
                      <template #avatar><a-avatar :src="item.avatar"/></template>
                    </a-list-item-meta>
                    <div class="content">
                      {{ item.content }}
                    </div>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #tab>
                <span>
                  <IconFont type="icon-guanzhu" />
                  关注
                </span>
              </template>
              <a-list class="follow-list" :loading="loading" item-layout="horizontal" :data-source="dataList">
                <template #loadMore>
                  <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-spin v-if="loadingMore" />
                    <a-button v-else @click="loadMore">loading more</a-button>
                  </div>
                </template>
                <template #renderItem="{ item }">
                  <a-list-item key="item.title">
                    <a-list-item-meta :description="item.time">
                      <template #title>
                        <a :href="item.href">{{ item.title }}</a>
                      </template>
                      <template #avatar><a-avatar :src="item.avatar"/></template>
                    </a-list-item-meta>
                    <div class="follow">
                      <a-button type="primary" ghost shape="round" size="large"> + Follow </a-button>
                    </div>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="4">
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
            </a-tab-pane>
            <a-tab-pane key="3">
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
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :xs="0" :sm="6">
        <a-card title="Basic Info" :bordered="false" class="basic-info">
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
        </a-card>
        <a-card title="Card title" :bordered="false" style="width: 100%">
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DownOutlined, AppleOutlined, AndroidOutlined } from '@ant-design/icons-vue'

const dataList: Record<string, string>[] = []

for (let i = 0; i < 23; i++) {
  dataList.push({
    href: 'https://www.antdv.com/',
    title: `User ${i}`,
    avatar: 'https://5b0988e595225.cdn.sohucs.com/q_70,c_zoom,w_640/images/20191014/a30933ad9fef4a2c804c8826683a8720.jpeg',
    time: '2018-12-4 10:00',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
  })
}

export default defineComponent({
  setup() {
    const loading = false
    const loadingMore = false
    const loadMore = {}
    return {
      activeKey: ref('1'),
      loading,
      loadingMore,
      dataList,
      loadMore
    }
  },
  created() {
    console.log('routerList', this.$route)
    console.log(this)
  },
  components: {
    DownOutlined
  },
  methods: {
    hello() {
      console.log('hahha')
      return 'nihao'
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
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    .ant-badge {
      img {
        width: 130px;
        border-radius: 50%;
        border: 5px solid #ffffff;
        position: absolute;
        left: 0;
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
    color: @primary-color;
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
      color: @primary-color;
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

.identity {
  display: flex;
  justify-content: space-between;
  text-align: left;
  margin-top: 30px;
  .left {
    max-width: 80%;
    p:first-child {
      font-size: 22px;
      margin: 0;
    }
    p:nth-child(2) {
      margin: 0;
      color: #c3bebe;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .right {
    display: flex;
    align-items: flex-end;
  }
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
