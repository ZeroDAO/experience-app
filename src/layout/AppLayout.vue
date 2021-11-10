<template>
  <div class="app-layout">
    <router-view v-if="fullScreenMode" />
    <a-layout>
      <a-layout-sider :collapsed="isSollapsed" width="300" breakpoint="lg" collapsed-width="0" @collapse="onCollapse">
        <img class="logo" src="../assets/logo-ui-w.svg" />
        <AccountSelector @close="onCollapse(false, 'clickBlank')" />
        <a-menu theme="dark" mode="inline" :selectedKeys="selectedKeys">
          <a-menu-item v-for="(menuItem, i) in menuData" :key="i.toString()" @click="onCollapse(true, 'clickBlank')">
            <IconFont :type="menuItem.icon" />
            <router-link :to="menuItem.path">{{ menuItem.text }}</router-link>
          </a-menu-item>
        </a-menu>
        <div class="sider-btm">
          <div>
            <a-button type="primary" shape="circle">
              <template #icon>
                <IconFont type="icon-twitter" />
              </template>
            </a-button>
            <a-button type="primary" shape="circle">
              <template #icon>
                <IconFont type="icon-medium" />
              </template>
            </a-button>
            <a-button type="primary" shape="circle">
              <template #icon>
                <IconFont type="icon-iconshareredditbeifen" />
              </template>
            </a-button>
            <a-button type="primary" shape="circle">
              <template #icon>
                <IconFont type="icon-github1" />
              </template>
            </a-button>
          </div>
          <ChangeLanguage />
        </div>
      </a-layout-sider>
      <a-layout>
        <app-header />
        <a-layout-content>
          <router-view />
          <div v-if="isBroken && !isSollapsed" class="content-mask" @click="onCollapse(true, 'clickBlank')"></div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts">
// import AppFooter from './Footer.vue'
import AppHeader from './Header.vue'
import { defineComponent, ref, watch, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AccountSelector from '@/components/AccountSelector.vue'
import { getStoreGetter } from '@/store/utils'
import { providerEndpoints, endpointKey } from '@/config/chainEndpoints'
import { connect } from '@/api'
import { provideSubstrateContext, useTrusting } from '@/hooks'
import { useStore } from 'vuex'
import { ApiPromise } from '@polkadot/api'
import { SubstrateInterface } from '@/@types'
import ChangeLanguage from '@/components/ChangeLanguage.vue'

const menuData = [
  {
    path: '/',
    text: 'Home',
    icon: 'icon-icon-test'
  },
  {
    path: '/wallet',
    text: 'Wallet',
    icon: 'icon-licai'
  },
  {
    path: '/seed',
    text: 'Seed',
    icon: 'icon-jiangli'
  },
  {
    path: '/tests',
    text: 'Tests',
    icon: 'icon-ceshi'
  }
]

export default defineComponent({
  components: {
    // AppFooter,
    AppHeader,
    AccountSelector,
    ChangeLanguage
  },
  setup() {
    const fullScreenMode = ref(true)
    const router = useRouter()
    const selectedKeys = ref<string[]>(['1'])
    const isSollapsed = ref(false)
    const isBroken = ref(false)

    watch(router.currentRoute, currentRoute => {
      const menuIndex = menuData.findIndex(Obj => Obj.path == currentRoute.path)
      selectedKeys.value = [menuIndex.toString()]
      fullScreenMode.value = Boolean(router.currentRoute.value.meta?.fullScreen)
    })

    const onCollapse = (collapsed: boolean, type: string) => {
      if (type == 'clickTrigger') {
        isSollapsed.value = collapsed
      } else if (type == 'clickBlank' && isBroken.value) {
        isSollapsed.value = true
      } else if (type == 'responsive') {
        isSollapsed.value = collapsed
        isBroken.value = collapsed
      }
    }

    const apiRef = ref<ApiPromise | undefined>(undefined)

    const store = useStore()
    const myAddressRef = computed(() => store.state.general.currentAccount)

    // let endpoint = providerEndpoints[networkId.value].endpoint
    const networkId = ref(0)

    let endpoint = providerEndpoints[networkId.value].endpoint
    if (networkId.value === endpointKey.CUSTOM) {
      const customEndpoint = computed(() => getStoreGetter('general', 'customEndpoint'))
      endpoint = customEndpoint.value
    }

    connect(endpoint, networkId.value).then(re => {
      apiRef.value = re.api
    })

    const myTrustingListRef = useTrusting(apiRef, myAddressRef)

    const substrateContent = reactive<SubstrateInterface>({
      api: apiRef.value as ApiPromise,
      myTrusting: myTrustingListRef.value,
      myAddress: myAddressRef.value
    })

    watch(
      () => [apiRef.value, myAddressRef.value, myTrustingListRef.value],
      ([api, myAddress, myTrustingList]) => {
        substrateContent.api = api
        substrateContent.myTrusting = myTrustingList
        substrateContent.myAddress = myAddress
      }
    )

    provideSubstrateContext(substrateContent as SubstrateInterface)

    return {
      fullScreenMode,
      onCollapse,
      selectedKeys,
      menuData,
      isSollapsed,
      isBroken
    }
  }
})
</script>

<style lang="less">
.logo {
  width: 220px;
  margin: 10px;
}
.app-layout {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.sider-btm {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
  padding: 5px;
  button {
    margin-right: 5px;
  }
}
.content-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #071f36;
  opacity: 0.8;
  filter: alpha(opacity=85);
  transition: opacity 0.3s linear, height 0s ease 0.3s;
}
.ant-layout {
  height: 100%;
}
.ant-layout-sider {
  height: 100%;
}
.ant-layout-sider-zero-width-trigger {
  top: 10px !important;
}
.ant-layout-sider-children {
  overflow: auto;
  height: 100vh;
  position: fixed;
  width: 300px;
  left: 0;
  background: #001529;
  .ant-menu {
    li {
      padding: 38px;
      .anticon {
        font-size: 26px;
        margin-right: 10px;
      }
      .ant-menu-title-content {
        display: flex !important;
        justify-content: flex-start;
        align-items: center;
      }
      a {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .ant-menu-item-selected {
      background-color: #03178f !important;
      border-right: 5px solid #0025ff !important;
    }
  }
}
.ant-layout-sider-collapsed {
  .ant-layout-sider-children {
    width: 0;
  }
}
.ant-layout-sider-below {
  position: absolute !important;
  z-index: 100;
}
.app-content {
  position: relative;
  padding: 0;
  margin: 0;
}
.router-view {
  margin: 0;
  padding: 0;
}
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
