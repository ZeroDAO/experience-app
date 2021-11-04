<template>
  <a-button type="primary" shape="round" size="large" :disabled="disabled" :loading="loading" @click="send">
    Claim
    <TransactionAction ref="txRef" txType="SIGNED-TX" html-type="submit" :attrs="attrs" @complete="handleComplete" />
  </a-button>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from 'vue'
import TransactionAction from '../../common/TransactionAction.vue'
import { Attrs } from '@/@types'

export default defineComponent({
  name: 'Claim',
  components: {
    TransactionAction
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: null
  },
  setup(props) {
    const txRef = ref(null)
    const loading = ref(false)

    const attrs = ref<Attrs>({
      palletRpc: 'zdToken',
      callable: 'claim',
      params: null
    })

    const send = () => {
      loading.value = true
      txRef.value.transaction()
    }

    const handleComplete = () => {
      loading.value = false
    }

    return {
      send,
      attrs,
      txRef,
      handleComplete,
      loading,
      ...toRefs(props)
    }
  }
})
</script>
