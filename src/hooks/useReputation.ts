import { ref, Ref, watch } from 'vue'

export function useReputation(apiRef: any, userRef?: Ref<string>) {
  const reputation = ref([])

  const updateAccount = (address: string) => {
    if (address) {
      const api = apiRef?.value
      if (address && api) {
        api.isReady.then(async () => {
          const result = await api.query.zdReputation.reputationScores(address)
          reputation.value = result.map(e => e.toString())
        })
      }
    }
  }

  watch(
    () => [apiRef.value, userRef?.value],
    ([, address]) => {
      updateAccount(address)
    },
    { immediate: true }
  )
  return reputation
}
