<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, reactive } from 'vue'
import { ISubmittableResult } from '@polkadot/types/types'
import { TxType, Attrs } from '@/@types'
import { useAccount } from '@/hooks'
import { web3FromSource } from '@polkadot/extension-dapp'
import { notification } from 'ant-design-vue'
import { setStoreState } from '@/store/utils'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import { keyring } from '@polkadot/ui-keyring'

export default defineComponent({
  name: 'TxButton',
  props: {
    txType: {
      type: String as PropType<TxType> | undefined,
      required: true
    },
    attrs: {
      type: Object as PropType<Attrs> | undefined,
      required: true
    }
  },
  emits: {
    complete: null
  },
  setup(props, { emit }) {
    const { api } = useSubstrateContext()
    const apiRef = computed(() => api)
    const { currentAccountInfo } = useAccount()

    const state = reactive({
      unsub: null
    })

    const getFromAcct = async () => {
      const {
        address,
        meta: { source, isInjected }
      } = currentAccountInfo.value as any
      let fromAcct

      if (isInjected) {
        // 'polkadot-js' ? 'extension'
        const injected = await web3FromSource(source == 'extension' ? 'polkadot-js' : source)
        fromAcct = address
        apiRef.value.setSigner(injected.signer)
      } else {
        fromAcct = keyring.getPair(address)
      }

      return fromAcct
    }

    const openNotification = (type, message, description) => {
      notification[type]({
        message: message,
        description: description
      })
    }

    const txResHandler = (result: ISubmittableResult): void => {
      const status = result.status
      setStoreState('general', 'isLoading', false)
      if (status.isInBlock) {
        openNotification('success', 'Completed', `Completed. Block hash: ${status.asInBlock.toString()}`)
      } else if (status.isFinalized) {
        openNotification('success', 'Finalized', `Finalized. Block hash: ${status.asFinalized.toString()}`)
      } else {
        console.log(`Current transaction status: ${status.type}`)
      }
      emit('complete')
    }

    const txErrHandler = err => {
      openNotification('error', 'Failed', `Transaction Failed: ${err.toString()}`)
    }

    const signedTx = async () => {
      const { palletRpc, callable, params } = props.attrs as Attrs
      const fromAcct = await getFromAcct()
      const txExecute = params ? apiRef?.value?.tx[palletRpc][callable](...params) : apiRef?.value?.tx[palletRpc][callable]()
      const unsub = await txExecute.signAndSend(fromAcct, txResHandler).catch(txErrHandler)
      state.unsub = unsub
    }

    const unsignedTx = async () => {
      const { palletRpc, callable, params } = props.attrs as Attrs
      const txExecute = params ? apiRef?.value?.tx[palletRpc][callable](...params) : apiRef?.value?.tx[palletRpc][callable]()

      const unsub = await txExecute.send(txResHandler).catch(txErrHandler)
      state.unsub = unsub
    }

    const rpc = async () => {
      const { palletRpc, callable, params } = props.attrs as Attrs
      const unsub = await apiRef?.value?.rpc[palletRpc][callable](...params, txResHandler)
      state.unsub = unsub
    }

    const sudoTx = async () => {
      const { palletRpc, callable, params } = props.attrs as Attrs
      const fromAcct = await getFromAcct()
      const txExecute = params ? apiRef?.value?.tx.sudo.sudo(apiRef?.value?.tx[palletRpc][callable](...params)) : apiRef?.value?.tx.sudo.sudo(apiRef?.value?.tx[palletRpc][callable]())

      const unsub = txExecute.signAndSend(fromAcct, txResHandler).catch(txErrHandler)
      state.unsub = unsub
    }

    const uncheckedSudoTx = async () => {
      const { palletRpc, callable, params } = props.attrs as Attrs
      const fromAcct = await getFromAcct()
      const txExecute = apiRef?.value?.tx.sudo.sudoUncheckedWeight(apiRef?.value?.tx[palletRpc][callable](...params), 0)

      const unsub = txExecute.signAndSend(fromAcct, txResHandler).catch(txErrHandler)

      state.unsub = unsub
    }

    const transaction = async () => {
      if (props.attrs === null) {
        return
      }

      setStoreState('general', 'isLoading', true)

      if (typeof state.unsub === 'function') {
        state.unsub()
        state.unsub = null
      }

      switch (props.txType) {
        case 'SIGNED-TX':
          signedTx()
          break

        case 'RPC':
          rpc()
          break

        case 'UNSIGNED-TX':
          unsignedTx()
          break

        case 'SUDO-TX':
          sudoTx()
          break

        case 'UNCHECKED-SUDO-TX':
          uncheckedSudoTx()
          break

        default:
          break
      }
    }

    return {
      transaction
    }
  }
})
</script>
