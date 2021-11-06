import { RegistryTypes } from '@polkadot/types/types'

const definitions: RegistryTypes = {
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  ChainId: {
    _enum: {
      RelayChain: null,
      Parachain: 'ParaId'
    }
  },
  SocialAccount: {
    pending: 'Compact<Balance>',
    social: 'Compact<Balance>'
  },
  ReputationScore: {
    score: 'u32',
    nonce: 'u32'
  },
  OperationStatus: {
    nonce: 'u32',
    last: 'BlockNumber',
    next: 'BlockNumber',
    period: 'BlockNumber',
    step: 'TIRStep'
  },
  Candidate: {
    score: 'u64',
    pathfinder: 'AccountId',
    hasChallenge: 'bool',
    addAt: 'BlockNumber'
  },
  PostResultHash: '[[u8; 2],u64,[u8; 8]]',
  Path: {
    nodes: 'Vec<AccountId>',
    total: 'u32'
  },
  Payroll: {
    count: 'u32',
    totalFee: 'Balance',
    updateAt: 'BlockNumber'
  },
  Record: {
    updateAt: 'BlockNumber',
    fee: 'Balance'
  },
  TrustTemp: {
    trust: 'OrderedSet<AccountId>',
    untrust: 'OrderedSet<AccountId>'
  },
  AppId: 'Bytes',
  OrderedSet: 'Vec<AccountId>',
  CurrencyIdOf: 'CurrencyId',
  CurrencyId: {
    _enum: ['ZOO', 'SOCI', 'DOT']
  },
  TIRStep: {
    _enum: ['SEED', 'REPUTATION']
  },
  TokenSymbol: {
    _enum: ['ZOO', 'SOCI', 'DOT']
  },
  AmountOf: 'Amount',
  Amount: 'i128'
}

export default definitions
