import { ref, Ref, watch } from 'vue'

export function useReputation(apiRef: any, userRef?: Ref<string>) {
  const reputation = ref([])
  const updateAccount = async (address: string, api) => {
    if (address && api) {
      api.isReady.then(async () => {
        const result = await api.query.zdReputation.reputationScores(address)
        reputation.value = result
      })
    }
  }
  watch(
    () => [apiRef.value, userRef?.value],
    ([api, address]) => {
      updateAccount(address, api)
    },
    { immediate: true }
  )
  return reputation
}
