<template>
  <a-button :disabled="isMine" :loading="loading" type="primary" :ghost="isTrusted" shape="round" size="large" @click="trustOrUn()">
    {{ isTrusted ? '- Untrust' : '+ Trust' }}
    <TransactionAction ref="txRef" txType="SIGNED-TX" html-type="submit" :attrs="attrsRef" @complete="handleComplete" />
  </a-button>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import TransactionAction from '../common/TransactionAction.vue'
import { Attrs } from '@/@types'
import { Modal } from 'ant-design-vue'
import { isValidAddressPolkadotAddress } from '@/utils/common'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'

export default defineComponent({
  name: 'TrustButton',
  components: {
    TransactionAction
  },
  props: {
    targer: {
      type: String
    }
  },
  setup(props) {
    const txRef = ref(null)
    const loading = ref(false)

    const context = useSubstrateContext()
    const myTrusting = computed(() => context.myTrusting)
    const isTrusted = computed(() => context.myTrusting.indexOf(props.targer as string) > -1)
    const isMine = computed(() => context.myAddress == props.targer)

    const attrsRef = ref<Attrs>({
      palletRpc: 'zdTrust',
      callable: isTrusted.value ? 'untrust' : 'trust',
      params: [props.targer]
    })

    const countDown = () => {
      Modal.error({
        title: 'Wrong address!',
        content: `This is not a valid address.`
      })
    }
    const trustOrUn = () => {
      loading.value = true
      attrsRef.value.callable = isTrusted.value ? 'untrust' : 'trust'
      attrsRef.value.params = [props.targer]

      if (!isValidAddressPolkadotAddress(props.targer as string)) {
        countDown()
      }

      txRef.value.transaction()
    }
    const handleComplete = () => {
      loading.value = false
    }
    return {
      attrsRef,
      trustOrUn,
      loading,
      txRef,
      handleComplete,
      context,
      isTrusted,
      isMine,
      myTrusting
    }
  }
})
</script>
