import { formatBalance, isNumber, isTestChain } from '@polkadot/util'
import { TypeRegistry } from '@polkadot/types/create'
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults'

const registry = new TypeRegistry()

export const DEFAULT_DECIMALS = registry.createType('u32', 12)
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix)

async function retrieve(api) {
  const [systemChainType, chainProperties, systemChain, systemName, systemVersion, confirmationPeriod] = await Promise.all([api.rpc.system.chainType ? api.rpc.system.chainType() : Promise.resolve(registry.createType('ChainType', 'Live')), api.rpc.system.properties(), api.rpc.system.chain(), api.rpc.system.name(), api.rpc.system.version(), api.consts.zdRefreshReputation.confirmationPeriod.toNumber()])

  return {
    systemChainType,
    ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : DEFAULT_SS58.toNumber(),
    tokenDecimal: (api.registry.chainDecimals || [DEFAULT_DECIMALS.toNumber()])[0],
    tokenSymbolArr: chainProperties.tokenSymbol,
    systemChain: (systemChain || '<unknown>').toString(),
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
    confirmationPeriod
  }
}

export async function bestNumber(api) {
  const blocklNumber = await api.derive.chain.bestNumber
  return blocklNumber.toNumber()
}

export async function loadInfo(api) {
  const { systemChainType, ss58Format, systemChain, tokenSymbolArr, systemName, tokenDecimal, systemVersion, confirmationPeriod } = await retrieve(api)
  const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain)
  const tokenSymbol = tokenSymbolArr.unwrapOr([formatBalance.getDefaults().unit])[0].toString()

  formatBalance.setDefaults({
    decimals: tokenDecimal,
    unit: tokenSymbol
  })

  return {
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion,
    isDevelopment,
    ss58Format,
    tokenSymbol,
    tokenDecimal,
    confirmationPeriod
  }
}
