import { computed, ref, reactive, watch, watchEffect, Ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { StateType, AllUserInfo, AccountExtension, AccountInfo } from '@/@types'
import { ApiPromise } from '@polkadot/api'
import { isValidAddressPolkadotAddress } from '@/utils/common'
import { keyring } from '@polkadot/ui-keyring'

const nameFromAddress = address => {
  return address ? address.slice(0, 4) + '...' + address.slice(-4) : ''
}

function userInfoHandler({ address, meta }): AccountInfo {
  return {
    address: address,
    meta: {
      name: meta?.name || nameFromAddress(address),
      mould: meta?.isTesting ? 'Dev' : meta?.source == 'polkadot-js' ? 'extension' : (meta?.source as string) || ''
    }
  }
}

export const useUserInfo = address => {
  const store = useStore<StateType>()
  const keyringState = computed(() => store.state.general.keyringState)

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
        state.meta = userInfoHandler({ address, meta }).meta
      }
    },
    { immediate: true }
  )

  return toRefs(state)
}

// A better approach should be adopted
export const useUserInfoRef = addressRef => {
  const store = useStore<StateType>()
  const keyringState = computed(() => store.state.general.keyringState)

  const state: AccountInfo = reactive<AccountInfo>({
    address: addressRef?.vlaue,
    meta: {
      name: nameFromAddress(addressRef?.vlaue),
      mould: ''
    }
  })

  watch(
    () => [keyringState.value, addressRef.value],
    ([status, address]) => {
      if (status == 'READY' && address) {
        const meta = keyring.getAddress(address, null)?.meta
        state.meta = userInfoHandler({ address, meta }).meta
      }
    },
    { immediate: true }
  )
  return toRefs(state)
}

export const useAllUsersInfo = () => {
  const store = useStore<StateType>()
  const keyringState = computed(() => store.state.general.keyringState)

  const allUserInfo = ref<Array<AccountInfo>>([])

  watch(
    () => keyringState.value,
    status => {
      if (status == 'READY') {
        const AccountInfoArr = keyring.getAccounts().map((e): AccountInfo => userInfoHandler(e))
        allUserInfo.value = AccountInfoArr
      }
    },
    { immediate: true }
  )

  return allUserInfo
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
