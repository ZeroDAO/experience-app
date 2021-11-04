import { ref, Ref, watch } from 'vue'

export function useTrusting(apiRef: any, addressRef: Ref<string>) {
  const TrustingList = ref([])

  const updateAccount = (address: string) => {
    if (address) {
      const api = apiRef?.value
      if (address && api) {
        api.isReady.then(async () => {
          const result = await api.query.zdTrust.trustedList(address)
          TrustingList.value = result.map(e => e.toString())
        })
      }
    }
  }

  watch(
    () => [apiRef.value, addressRef.value],
    ([, address]) => {
      updateAccount(address)
    },
    { immediate: true }
  )
  return TrustingList
}
