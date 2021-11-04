import { Module } from 'vuex'
import { StateType } from '@/@types'

const state = {
  initialized: false,
  isLoading: false,
  currentAccountData: {
    trustList: [],
    reputation: [],
    token: {
      free: 0,
      reserved: 0,
      miscFrozen: 0,
      feeFrozen: 0,
      social: 0,
      pending: 0
    }
  },
  chainInfo: undefined,
  currentAccount: undefined,
  allAccountsInfo: {},
  keyring: undefined,
  keyringState: null,
  metaExtensions: {
    count: 0,
    extensions: []
  },
  extensionCount: 0,
  allAccounts: [],
  currentNetworkStatus: 'connecting',
  currentNetworkId: 0,
  currentAccountIdx: 0,
  currentCustomEndpoint: '',

  currentTheme:
    //this queries the media setting
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT'
}

type GeneralStateType = typeof state

const general: Module<GeneralStateType, StateType> = {
  namespaced: true,
  ...state
}

export { GeneralStateType, state }
export default general
