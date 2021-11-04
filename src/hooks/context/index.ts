// https://github.com/vueComponent/pro-layout/blob/next/src/hooks/context/index.ts

import { defineComponent, InjectionKey, provide, inject, readonly, SetupContext, VNode, PropType, DefineComponent } from 'vue'

export type ContextType<T> = any

export type CreateContext<T> = DefineComponent<{}, () => VNode | VNode[] | undefined, any>

export const createContext = <T>(contextInjectKey: InjectionKey<ContextType<T>> = Symbol(), injectCompName = 'Context.Provider'): CreateContext<T> => {
  const ContextProvider = defineComponent({
    name: injectCompName,
    props: {
      value: {
        type: Object as PropType<ContextType<T>>,
        required: true
      }
    },
    setup(props: { value: ContextType<T> }, { slots }: SetupContext) {
      provide(contextInjectKey, readonly(props.value))
      return () => slots.default?.()
    }
  })

  return ContextProvider as any
}

export const useContext = <T>(contextInjectKey: string | InjectionKey<ContextType<T>> = Symbol(), defaultValue?: ContextType<T>): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

// :: examples ::
//
// interface MyContextProps {
//   param1: string;
//   param2: boolean;
//   someData?: string[];
// }
//
// const [ state, ContextProvider ] = createContext<MyContextProps>({
//   param1: 'abc',
//   param2: false,
//   someData: ['a', 'b', 'c', 'd']
// });
//
// const value = useContext<MyContextProps>();
//
// console.log('value', toRaw(value));
// console.log('param1', value.param1); // 'abc'
// console.log('param2', value.param2); // false
// console.log('someData', value.someData); // ['a', 'b', 'c', 'd']
