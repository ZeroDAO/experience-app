<template>
  <div class="identicon primary-hover">
    <Beachball class="avatar" :size="size" :address="address" />
    <div class="right-box">
      <a
        >{{ name }}<span>{{ nameType }}</span></a
      >

      <span class="address">{{ address }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Beachball from './Beachball'

export default defineComponent({
  name: 'Identicon',
  components: {
    Beachball
  },
  props: {
    address: {
      type: String,
      default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
    },
    size: {
      type: Number,
      default: 20
    },
    name: {
      type: String,
      default: ''
    },
    nameType: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="less">
.identicon {
  margin: 10px !important;
  border-radius: 20px !important;
  display: flex;
  border-radius: 15px;
  border: 1px solid #d9d5d5;
  padding: 10px;
  .right-box {
    display: flex;
    flex-direction: column;
    a {
      font-size: 18px;
      font-weight: bold;
      span {
        margin-left: 10px;
        font-size: 10px;
        color: rgb(160, 158, 158);
      }
    }
  }
  .ant-card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #fff;
    padding: 10px;
  }
  .avatar {
    display: table;
    margin-right: 15px;
  }
  .address {
    width: 20em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .anticon-down {
    font-size: 13px;
    margin-right: 10px;
  }
}
</style>
