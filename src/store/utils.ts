import store from '@/store'

// Define the module value under state
type ModuleNameType = 'app' | 'general'

/**
 * @description setStoreState - method is an operation of mutaitions
 * @type {T} T - The type of module you want to change
 * @param {string}  module - The module name of the state to be manipulated
 * @param {string}  key - The key value under the module of the state to be manipulated
 * @param {any} value - When there is a msg parameter, it is considered an assignment and triggers mutation, and msg is the data to be copied.
 *  // as if
 *   ``` const state = {
 *                 name: {
 *                   firstName:'jack',
 *                   lastName:'Ma'
 *                 }
 *               }
 *   ```
 *  To modify the firstName individually, use the setStoreState<AppStateType>('app','name',{firstName:'modifiedName',lastName:'Ma'})
 */

export function setStoreState<T>(module: ModuleNameType, key: keyof T, value: any) {
  store.commit({
    type: module + '/__set',
    key: key,
    val: value
  })
}

/**
 * @description the dispatch method
 * @type {T} T  The type of module to which you want to distribute actions
 * @example const result = await dispatchActions<UserActionsType>('console','refreshToken',1)
 */
export function dispatchAction<T>(module: ModuleNameType, key: keyof T, value?: any) {
  store.dispatch(`${module}/${key}`, value)
}

/**
 * @description the Getter method
 * @type {T} T  The type of module you want to get getters from
 * @example const result =  getStoreGetter<ConsoleGetterType>('console','list')
 */
export function getStoreGetter<T>(module: ModuleNameType, key: keyof T) {
  return store.getters[`${module}/${key}`]
}
