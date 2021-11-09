<template>
  <a-card class="user-card" hoverable :bordered="false" @click="goHome()">
    <Beachball class="avatar" :size="50" :address="address" />
    <div class="content">
      <a class="name">
        {{ meta.name }}<span class="suffix">{{ meta.mould }}</span>
      </a>
      <a-typography-paragraph :ellipsis="true" :content="address" />
    </div>
    <TrustButton :targer="address" />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { useUserInfo } from '@/hooks'
import TrustButton from '../home/TrustButton.vue'
import Beachball from '../id/Beachball.vue'

export default defineComponent({
  name: 'UserCard',
  components: {
    TrustButton,
    Beachball
  },
  props: {
    address: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props) {
    const { meta } = useUserInfo(props.address as string)

    return {
      meta,
      ...toRefs(props)
    }
  },
  methods: {
    goHome() {
      this.$router.push(`/${this.address}`)
    }
  }
})
</script>

<style lang="less">
.user-card {
  div.ant-typography,
  .ant-typography p {
    margin-bottom: 0 !important;
    font-size: 12px !important;
  }
  .ant-card-body {
    display: flex;
    align-items: center;
    width: 100%;
    button {
      float: right;
      margin-right: 0;
      margin-left: auto;
    }
    .content {
      display: grid;
      margin-left: 15px;
      .name {
        color: #fff;
        font-size: 18px;
      }
    }
  }
}
</style>
