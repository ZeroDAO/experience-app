import { ref } from 'vue'

export function useSeed(apiRef: any) {
  const seedList = ref([])
  const updateAccount = async api => {
    if (api) {
      api.isReady.then(async () => {
        const result = await api.query.zdSeeds.seeds()
        seedList.value = result.map(e => e.toString())
      })
    }
  }
  updateAccount(apiRef?.value)
  return seedList
}
