import { computed, ref, reactive, watch, watchEffect, Ref, toRefs } from 'vue'
// import { setStoreState } from '@/store/utils';
import { useStore } from 'vuex'
import { StateType, AccountExtension, AccountInfo } from '@/@types'
import { ApiPromise } from '@polkadot/api'
import { isValidAddressPolkadotAddress } from '@/utils/common'
import { keyring } from '@polkadot/ui-keyring'

export const useUserInfo = address => {
  const store = useStore<StateType>()
  const keyringState = computed(() => store.state.general.keyringState)

  const nameFromAddress = address => {
    return address.slice(0, 4) + '...' + address.slice(-4)
  }

  const state: AccountInfo = reactive<AccountInfo>({
    address: address,
    meta: {
      name: nameFromAddress(address),
      mould: ''
    }
  })

  watch(
    () => keyringState.value,
    status => {
      if (status == 'READY') {
        const meta = keyring.getAddress(address, null)?.meta
        state.meta.name = meta?.name || nameFromAddress(address)
        if (meta?.isTesting) {
          state.meta.mould = 'Dev'
        } else if (meta?.source == 'polkadot-js') {
          state.meta.mould = 'extension'
        } else if (meta?.source) {
          state.meta.mould = meta.source as string
        }
      }
    },
    { immediate: true }
  )

  return toRefs(state)
}

export const useAccount = (userRef?: Ref<string>) => {
  const store = useStore<StateType>()

  const allAccounts = computed(() => store.state.general.allAccounts)
  const allAccountsInfo = computed(() => store.state.general.allAccountsInfo)
  const currentAccount = computed(() => store.state.general.currentAccount)

  const currentAccountInfo = ref({})
  const userAccountInfo = ref({})

  watch(
    () => [allAccountsInfo.value, currentAccount.value, userRef?.value],
    ([allInfo, address, user]) => {
      currentAccountInfo.value = allInfo[address]
      if (user) {
        userAccountInfo.value = allInfo[user]
      }
    },
    { immediate: true }
  )

  return {
    allAccounts,
    currentAccount,
    allAccountsInfo,
    currentAccountInfo,
    userAccountInfo
  }
}

export const useAccountData = (apiRef: Ref<ApiPromise>, address: string) => {
  const state: AccountExtension = reactive<AccountExtension>({
    trustList: [],
    reputation: [],
    token: {}
  })

  watchEffect(() => {
    if (address && isValidAddressPolkadotAddress(address as string)) {
      const api = apiRef?.value

      if (address && api) {
        api.isReady.then(async () => {
          const results = await Promise.all([api.query.system.account(address), api.query.zdToken.accounts(address), api.query.zdReputation.reputationScores(address), api.query.zdTrust.trustedList(address)])

          const [accountInfo, socialAccount, reputation, tustList] = results as any[]

          state.token = {
            ...accountInfo.data,
            ...socialAccount
          }

          state.reputation = reputation
          state.trustList = tustList.map(e => e.toString())
        })
      }
    }
  })

  return toRefs(state)
}
