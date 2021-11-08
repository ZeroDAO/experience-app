// async function retrieve(apiRef: any) {
//   const res = await apiRef?.value?.query.zdSeeds.seeds()
//   const seedList = res.map(e => e.toString());
//   return { seedList: seedList }
// }

// export async function useSeed(apiRef: any) {
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
