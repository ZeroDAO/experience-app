import { ApiPromise, WsProvider } from '@polkadot/api'
import { keyring } from '@polkadot/ui-keyring'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { setStoreState } from '@/store/utils'
import { providerEndpoints } from '@/config/chainEndpoints'
import { InjectedExtension } from '@polkadot/extension-inject/types'
import { loadInfo } from '@/hooks'

let loadAccts = false
const loadAccounts = async (api: ApiPromise, isDevelopment: boolean) => {
  await cryptoWaitReady()

  const asyncLoadAccounts = async () => {
    const accountExs = await web3Accounts().then(accounts =>
      accounts.map(({ address, meta }) => ({
        address,
        meta: {
          ...meta,
          source: meta.source === 'polkadot-js' ? 'extension' : meta.source
        }
      }))
    )

    keyring.loadAll(
      {
        genesisHash: api.genesisHash,
        isDevelopment: isDevelopment,
        ss58Format: 42
      },
      accountExs
    )

    setStoreState('general', 'keyringState', 'READY')
  }

  if (loadAccts) return

  loadAccts = true
  asyncLoadAccounts()
}

export async function connect(endpoint: string, networkId: number) {
  const provider = new WsProvider(endpoint)

  // load the web3 extension
  let extensions: InjectedExtension[] = []

  const typeDefinitions = providerEndpoints[networkId].typeDef

  const api = new ApiPromise({
    provider,
    types: {
      ...typeDefinitions
    }
  })

  setStoreState('general', 'currentNetworkStatus', 'connecting')

  api.on('error', (error: Error) => console.error(error.message))
  api.on('ready', async () => {
    const injectedPromise = web3Enable('polkadot-js/apps')

    try {
      extensions = await injectedPromise
    } catch (e) {
      console.error(e)
    }

    const chainInfo = await loadInfo(api)
    setStoreState('general', 'chainInfo', chainInfo)

    try {
      await loadAccounts(api, chainInfo.isDevelopment)
      keyring.accounts.subject.subscribe(accounts => {
        if (accounts) {
          setStoreState('general', 'allAccounts', Object.keys(accounts))
          const accountExt: any = Object.values(accounts).reduce((aes, obj: any) => {
            aes[obj.json.address] = obj.json
            return aes
          }, {})
          setStoreState('general', 'allAccountsInfo', accountExt)
        }
      })
      setStoreState('general', 'currentNetworkStatus', 'connected')
    } catch (err) {
      console.error(err)
      setStoreState('general', 'currentNetworkStatus', 'offline')
    }
  })

  return {
    api,
    extensions,
    keyring
  }
}
