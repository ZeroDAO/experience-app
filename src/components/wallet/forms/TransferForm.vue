<template>
  <a-form class="transfer-form" ref="formRef" name="transfer" :model="formState" :rules="rules" v-bind="layout" @finish="handleFinish" @finishFailed="handleFinishFailed">
    <a-form-item has-feedback label="To" name="to">
      <a-input v-model:value="formState.to" />
    </a-form-item>
    <a-form-item has-feedback label="Amount" name="amount">
      <a-input-number v-model:value="formState.amount" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button shape="round" size="large" ghost key="back" @click="handleCancel">Cancel</a-button>
      <a-button shape="round" size="large" type="primary" html-type="submit">Confirm</a-button>
      <TransactionAction ref="txRef" :txType="txType" html-type="submit" :attrs="attrsRef" @complete="handleComplete" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
//
import { defineComponent, toRefs, ref, reactive, PropType, computed } from 'vue'
import type { UnwrapRef } from 'vue'
import TransactionAction from '../../common/TransactionAction.vue'
import { Attrs, TxType } from '@/@types'
import { RuleObject } from 'ant-design-vue/es/form/interface'
import { isValidAddressPolkadotAddress, reduceDenomToBalance } from '@/utils/common'
import { useStore } from 'vuex'

interface FormState {
  to: string
  amount: number | undefined
}

export default defineComponent({
  name: 'TransferForm',
  components: {
    TransactionAction
  },
  emits: {
    close: null
  },
  props: {
    txType: {
      type: String as PropType<TxType> | undefined,
      required: true
    },
    accountData: {
      type: Object,
      required: true
    },
    isSocail: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const formRef = ref()
    const txRef = ref(null)

    const store = useStore()
    const chainInfo = computed(() => store.state.general.chainInfo)

    const formState: UnwrapRef<FormState> = reactive({
      to: '',
      amount: 0
    })

    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }

    const checkAmount = async (_rule: RuleObject, value: number) => {
      if (value <= 0) {
        return Promise.reject('Amount must be greater than 0')
      } else {
        return Promise.resolve()
      }
    }

    const checkAddress = async (_rule: RuleObject, value: string) => {
      if (!isValidAddressPolkadotAddress(value)) {
        return Promise.reject('Address not in format')
      } else {
        return Promise.resolve()
      }
    }

    const rules = {
      to: [{ required: true, validator: checkAddress, trigger: 'change' }],
      amount: [{ required: true, validator: checkAmount, trigger: 'change' }]
    }

    const attrsRef = ref<Attrs>({
      palletRpc: props.isSocail ? 'zdToken' : 'balances',
      callable: props.isSocail ? 'transferSocial' : 'transfer',
      params: null
    })

    const handleFinish = (values: FormState) => {
      attrsRef.value.params = [values.to, reduceDenomToBalance(values.amount, chainInfo.value.decimal)]
      txRef.value.transaction()
    }

    const handleFinishFailed = errors => {
      console.log(errors)
    }

    const reset = () => {
      formRef.value.resetFields()
      emit('close')
    }

    const handleCancel = () => {
      reset()
      emit('close')
    }

    const handleComplete = () => {
      reset()
      emit('close')
    }

    return {
      rules,
      layout,
      formRef,
      handleFinish,
      handleFinishFailed,
      attrsRef,
      formState,
      handleComplete,
      handleCancel,
      txRef,
      ...toRefs(props)
    }
  }
})
</script>

<style lang="less">
.transfer-form {
  button {
    margin-right: 15px;
  }
}
</style>
