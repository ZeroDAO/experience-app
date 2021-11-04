import { RegistryTypes } from '@polkadot/types/types'
import * as typeDefs from '../@types/types'

interface ChainProvider {
  networkAlias: string
  displayName: string
  info?: string
  endpoint: string
  fallback?: string
  prefix?: number
  typeDef: RegistryTypes
  key: endpointKey
  subscan: string
}

export enum endpointKey {
  LOCAL = 3,
  CUSTOM = 4
}

export const providerEndpoints: ChainProvider[] = [
  // {
  //   networkAlias: 'ZeroDAO-node',
  //   displayName: 'ZeroDAO Network (Testnet)',
  // },
  {
    networkAlias: 'local-node',
    displayName: 'Local Network',
    endpoint: 'ws://127.0.0.1:9944',
    prefix: 0xff42,
    typeDef: typeDefs.exnetDefinitions,
    key: endpointKey.LOCAL,
    subscan: ''
  },
  {
    networkAlias: 'custom-node',
    displayName: 'Custom Network',
    endpoint: 'ws://127.0.0.1:9944',
    typeDef: typeDefs.exnetDefinitions,
    key: endpointKey.CUSTOM,
    subscan: ''
  }
]
