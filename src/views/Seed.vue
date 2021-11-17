<template>
  <div class="seed">
    <a-result v-if="!seedList || seedList.length == 0" status="404" title="No Seed found" sub-title="Lost connection or not selected."> </a-result>
    <a-row v-else :gutter="[16, 16]">
      <a-col v-for="(seed, i) in seedList" :key="i" :span="24" :lg="12">
        <user-card :address="seed" />
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useSubstrateContext } from '@/hooks/context/SubstrateContext'
import { useSeed } from '../hooks'
import UserCard from '@/components/common/UserCard.vue'

export default defineComponent({
  components: {
    UserCard
  },
  setup() {
    const { api } = useSubstrateContext()
    const apiRef = computed(() => api)
    const seedList = useSeed(apiRef)
    console.log(seedList)

    return {
      seedList
    }
  }
})
</script>

<style lang="less">
.seed {
  height: 100%;
  padding: 10px;
}
</style>
