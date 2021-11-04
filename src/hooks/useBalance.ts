import { Balance } from '@polkadot/types/interfaces'
import BN from 'bn.js'
import { ref, Ref, watch } from 'vue'

export class AccountBalance {
  constructor(free: Balance, reserved: Balance, miscFrozen: Balance, feeFrozen: Balance, social: Balance, pending: Balance) {
    this.free = free.toBn()
    this.reserved = reserved.toBn()
    this.miscFrozen = miscFrozen.toBn()
    this.feeFrozen = feeFrozen.toBn()
    this.social = social.toBn()
    this.pending = pending.toBn()
  }

  public getActualTotalBalance(): BN {
    return this.free.add(this.pending)
  }

  public getUsableTransactionBalance(): BN {
    return this.free.sub(this.miscFrozen)
  }

  public free: BN
  public reserved: BN
  public miscFrozen: BN
  public feeFrozen: BN
  public social: BN
  public pending: BN
}

function useBalance(apiRef: any, addressRef: Ref<string> | string) {
  const balanceRef = ref(null)
  const accountBalanceRef = ref<AccountBalance>()

  const updateAccount = (address: string) => {
    if (address) {
      const api = apiRef?.value

      if (address && api) {
        api.isReady.then(async () => {
          const results = await Promise.all([api.query.system.account(address), api.query.zdToken.accounts(address)])

          const accountInfo = results[0]
          const socialAccount = results[1]

          accountBalanceRef.value = new AccountBalance(accountInfo.data.free, accountInfo.data.reserved, accountInfo.data.miscFrozen, accountInfo.data.feeFrozen, socialAccount.social, socialAccount.pending)

          balanceRef.value = accountInfo.data.free.toBn()
        })
      }
    }
  }

  if (typeof addressRef === 'string') {
    watch(
      apiRef.value,
      () => {
        updateAccount(addressRef)
      },
      { immediate: true }
    )
  } else if (addressRef) {
    watch(
      () => [apiRef.value, addressRef.value],
      ([, address]) => {
        updateAccount(address)
      },
      { immediate: true }
    )
  }

  return {
    balanceRef,
    accountBalanceRef
  }
}

export function useAccountBalance(apiRef: any, addressRef: Ref<string> | string) {
  const accountBalance = ref<AccountBalance>()
  const { balanceRef, accountBalanceRef } = useBalance(apiRef, addressRef)

  watch(
    () => accountBalanceRef?.value,
    info => {
      if (info) {
        accountBalance.value = info
      }
    },
    { immediate: true }
  )
  return { balanceRef, accountBalance }
}
