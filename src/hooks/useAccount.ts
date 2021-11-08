import { computed, ref, reactive, watch, watchEffect, Ref, toRefs } from 'vue'
// import { setStoreState } from '@/store/utils';
import { useStore } from 'vuex'
import { StateType, AccountExtension } from '@/@types'
import { ApiPromise } from '@polkadot/api'
import { isValidAddressPolkadotAddress } from '@/utils/common'

// export const useUserName = (address) => {

// }

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
