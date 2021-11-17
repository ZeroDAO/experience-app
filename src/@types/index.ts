import { AppStateType } from '@/store/modules/app/state'
import { GeneralStateType } from '@/store/modules/general/state'
import { Keyring } from '@polkadot/keyring'
import { ApiPromise } from '@polkadot/api'

import { InjectedExtension, InjectedMetadataKnown, MetadataDef } from '@polkadot/extension-inject/types'

// Type of module for vuex state
type ModuleType = {
  app: AppStateType
  general: GeneralStateType
}

// For all StateType
export type StateType = ModuleType

// network
export enum network {
  'polkadot',
  'kusama'
}

interface ExtensionKnown {
  extension: InjectedExtension
  known: InjectedMetadataKnown[]
  update: (def: MetadataDef) => Promise<boolean>
}

interface ExtensionInfo extends ExtensionKnown {
  current: InjectedMetadataKnown | null
}

export interface Extensions {
  count: number
  extensions: ExtensionInfo[]
}

interface ExtensionProperties {
  extensionVersion: string
  tokenDecimals: number
  tokenSymbol: string
  ss58Format?: number
}

interface SavedProperties {
  [name: string]: ExtensionProperties
}

export interface AccountInfo {
  address: string
  meta: {
    name: string
    source?: string
    mould: string
  }
}

export type AllUserInfo = Array<AccountInfo>

export interface AccountExtension {
  trustList: string[]
  reputation: number[]
  token: any
}

// TODO Support for all types
export type TxType = 'QUERY' | 'RPC' | 'SIGNED-TX' | 'UNSIGNED-TX' | 'UNCHECKED-SUDO-TX' | 'SUDO-TX' | 'CONSTANT'

export interface Attrs {
  palletRpc: string
  callable: string
  params?: any[]
}

export type AlertBox = {
  showAlertMsg: boolean
  alertMsg: string
  alertType: string
}

export type EcdsaAccount = {
  ethereum: string
  ss58: string
}

export type ConnectionType = 'connected' | 'connecting' | 'offline'

export type KeyringState = 'LOADING' | 'READY' | 'ERROR'

export type Theme = 'LIGHT' | 'DARK'

export interface SubstrateInterface {
  api?: ApiPromise | undefined
  myAddress?: string
  myTrusting: string[]
}

export interface GeneralStateInterface {
  initialized: boolean
  isLoading: boolean
  alertBox: AlertBox
  keyring: Keyring
  keyringState: KeyringState
  currentAccount: string
  currentAccountData: AccountExtension
  allAccountsInfo: any
  chainInfo: any
  extensionCount: number
  allAccounts: string[]
  allAccountNames: string[]
  allAccountTypes: string[]
  currentNetworkStatus: ConnectionType
  currentNetworkId: number
  currentAccountIdx: number
  currentCustomEndpoint: string
  currentTheme: Theme
}

// ant-design-button color
export type ButtonColorType = 'primary' | 'danger' | 'dashed' | 'ghost' | 'default' | 'link'

// icon
export type IconType = 'icon' | 'iconfont'

// Modal
export type ModalOpenMode = 'edit' | 'add' | 'other'
