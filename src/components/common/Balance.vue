<template>
  <div id="balance">{{ formattedBalance ? `${formattedBalance}` : '-' }}</div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType, computed } from 'vue'
import BN from 'bn.js'
import { formatBalance } from '@polkadot/util'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Balance',
  props: {
    balance: { type: Object as PropType<BN> | undefined | null }
  },
  setup(props) {
    const formattedBalance = ref('')

    const store = useStore()
    const chainInfo = computed(() => store.state.general.chainInfo)

    watch(
      () => [props.balance, chainInfo.value.tokenSymbol],
      ([balance]) => {
        if (balance) {
          formattedBalance.value = formatBalance(props.balance as BN, {
            withSiFull: true
          })
        }
      },
      { immediate: true }
    )

    return { formattedBalance }
  }
})
</script>
