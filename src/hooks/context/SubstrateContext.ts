import { InjectionKey, provide, reactive, Ref } from 'vue'
import { createContext, useContext } from '.'
import { SubstrateInterface } from '@/@types'

export const defaultSubstrateContextContext = reactive({
  api: undefined,
  myAddress: undefined,
  myTrusting: []
})

const substrateContextInjectKey: InjectionKey<SubstrateInterface> = Symbol('substrate-context')

export const createSubstrateContext = () => createContext<SubstrateInterface>(substrateContextInjectKey, 'SubstrateContext.Provider')
export const provideSubstrateContext = (value: SubstrateInterface | Ref<SubstrateInterface>) => {
  provide(substrateContextInjectKey, value)
}

export const useSubstrateContext = () => useContext<Required<SubstrateInterface>>(substrateContextInjectKey, defaultSubstrateContextContext)

const Provider = createSubstrateContext()

export default {
  Provider
}
