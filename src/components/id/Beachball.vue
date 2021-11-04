<template>
  <div v-html="img"></div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { beachballIcon } from '@polkadot/ui-shared'

export default defineComponent({
  name: 'Beachball',
  props: {
    address: {
      type: String,
      default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
    },
    size: {
      type: Number,
      default: 50
    }
  },
  setup(props) {
    const img = computed(() => beachballIcon(props.address, { size: props.size }).outerHTML)
    return { img }
  }
})
</script>
