<template>
  <div class="tests">
    <a-row>
      <a-col :span="24" :lg="12">
        <a-card title="Steps" :bordered="false">
          <a-steps direction="vertical" :current="current" :status="msg.status">
            <a-step title="Read Users" description="Reading PreTest data." />
            <a-step title="Add Users" description="Add users to keyring." />
            <a-step title="Transfer" description="Transfer ZOO to users." />
            <a-step title="Waiting" description="Waiting for transfer all done." />
            <a-step title="Transfer Social" description="Transfer Social ZOO to users." />
            <a-step title="Waiting" description="Waiting for Transfer Social all done." />
            <a-step title="Update Relationships" description="Updated relationships to chain." />
            <a-step title="Waiting" description="Waiting for Transfer Social all done." />
            <a-step title="Now Round" description="Now Round Start." />
            <a-step title="Update seeds" description="Updated seeds to chain." />
            <a-step title="Waiting" description="Waiting for Transfer Social all done." />
            <a-step title="Harvest: Seeds" description="Pathfinder receives earnings." />
            <a-step title="Start: Refresh reputation" description="" />
            <a-step title="Update Reputations" description="Updated reputations to chain." />
            <a-step title="Waiting" description="Waiting for Transfer Social all done." />
            <a-step title="Harvest: Reputations" description="Waiting for Transfer Social all done." />
            <a-step title="Done" description="All done!." />
          </a-steps>
        </a-card>
      </a-col>
      <a-col :span="24" :lg="12">
        <a-card :bordered="false">
          <a-row>
            <a-col :span="12" class="circle">
              <a-progress type="circle" :percent="percentInfo.total == 0 ? 0 : ((percentInfo.finish + percentInfo.error) * 100) / percentInfo.total" />
            </a-col>
            <a-col :span="12" class="operation">
              <a>
                <span>Total</span>
                <span> {{ percentInfo.total }} </span>
              </a>
              <a-divider />
              <a>
                <span>Finish</span>
                <span> {{ percentInfo.finish }} </span>
              </a>
              <a-divider />
              <a>
                <span>Error</span>
                <span> {{ percentInfo.error }} </span>
              </a>
              <a-divider />
              <a-button type="primary" @click="start" size="large" shape="round"> Start </a-button>
            </a-col>
            <a-col :span="24" class="msg">
              <div v-if="deadlineRef != 0">
                <a-divider />
                <a-statistic-countdown title="Countdown" :value="deadlineRef" @finish="watingBlock" />
              </div>
              <a-divider />
              <a v-for="(m, i) in msg.msgs" :key="i">{{ m }}</a>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue'
import { useSubstrateContext, bestNumber } from '@/hooks'
import { keyring } from '@polkadot/ui-keyring'
import { reduceDenomToBalance } from '@/utils/common'
import { useStore } from 'vuex'

const preTestRoot = '@/testing-utils/data'

export default defineComponent({
  setup() {
    const { api } = useSubstrateContext()
    const apiRef = computed(() => api)
    const deadlineRef = ref(0)
    const state = reactive({
      nextStep: true
    })

    type statusType = 'wait' | 'process' | 'finish' | 'error'
    type msgType = {
      status: statusType
      msgs: string[]
    }
    type PercentType = {
      total: number
      finish: number
      error: number
    }

    const current = ref(-1)
    const msg = ref<msgType>({
      status: 'wait',
      msgs: []
    })
    const percentInfo = ref<PercentType>({
      total: 1,
      finish: 0,
      error: 0
    })

    let users = []
    let seeds = []
    let edges = []
    let alice = null

    const store = useStore()
    const chainInfo = computed(() => store.state.general.chainInfo)

    const chainConfig = async () => {
      const confirmationPeriod = chainInfo.value.confirmationPeriod
      const sysInfo = await api.query.zdReputation.systemInfo()
      const lastUpdateAt = (sysInfo as any).last
      return {
        confirmationPeriod,
        lastUpdateAt
      }
    }

    const getAlic = () => {
      if (!alice) {
        alice = keyring.keyring.createFromUri(
          `//Alice`,
          {
            name: 'alice',
            isTesting: true,
            id: 'Alice'
          },
          'sr25519'
        )
        return alice
      } else {
        return alice
      }
    }

    const userPair = userId => {
      return keyring.keyring.addFromUri(`//${userId}`, {}, 'sr25519')
    }

    let files = []

    const initStep = total => {
      percentInfo.value.total = total
      percentInfo.value.finish = 0
      percentInfo.value.error = 0
    }

    const moving = (isErr?: boolean) => {
      if (isErr) {
        msg.value.status = 'error'
        percentInfo.value.error += 1
      } else {
        percentInfo.value.finish += 1
      }
      if (percentInfo.value.error + percentInfo.value.finish >= percentInfo.value.total) {
        if (msg.value.status != 'error') {
          state.nextStep = true
        }
      }
    }

    // 暂停 - 将在该步骤完成后切换为手动
    // 强制结束 - 将立即结束，用于发生严重错误的情况

    const watingBlock = async () => {
      const startBlock = await bestNumber(api)
      const { lastUpdateAt, confirmationPeriod } = await chainConfig()
      if (lastUpdateAt + confirmationPeriod < startBlock) {
        state.nextStep = true
      } else {
        msg.value.msgs.push(`Current Block: ${startBlock}, Target Block: ${lastUpdateAt + confirmationPeriod}`)
        msg.value.msgs.push(`Wating...`)
        deadlineRef.value = Date.now() + (lastUpdateAt + confirmationPeriod - startBlock) * 6
      }
    }

    const txResHandler = ({ status }): void => {
      if (status.isInBlock) {
        moving()
        msg.value.msgs.push(`Completed. Block hash: ${status.asInBlock.toString()}`)
      }
    }

    const txErrHandler = err => {
      moving(true)
      msg.value.msgs.push(`Transaction Failed: ${err.toString()}`)
    }

    const signedTx = async (fromAcct, palletRpc, callable, params) => {
      const txExecute = params ? apiRef?.value?.tx[palletRpc][callable](...params) : apiRef?.value?.tx[palletRpc][callable]()
      const unsub = await txExecute.signAndSend(fromAcct, txResHandler).catch(txErrHandler)
      return (): void => {
        unsub && unsub()
      }
    }

    const readFiles = () => {
      initStep(3)
      files = require.context(preTestRoot, false, /.json$/).keys()
      ;['nodes.josn', 'seeds.json', 'edges.json'].forEach(file => {
        if (!(files.indexOf(file) > -1)) {
          msg.value = {
            status: 'error',
            msgs: [`Missing file ${file}`]
          }
        }
      })

      users = require(`${preTestRoot}/nodes.json`)
      msg.value.msgs.push(`Users count: ${users.length}`)
      moving()
      seeds = require(`${preTestRoot}/seeds.json`)
      msg.value.msgs.push(`Seeds count: ${seeds.length}`)
      moving()
      edges = require(`${preTestRoot}/edges.json`)
      msg.value.msgs.push(`Edges count: ${edges.length}`)
      moving()
    }

    // const getbalance = async address => {
    //   const balance: any = await api.query.system.account(address)
    //   console.log(balance.toHuman())
    // }

    const addUsers = () => {
      initStep(users.length)
      users.forEach((user, index) => {
        const pair = keyring.createFromUri(
          `//${user.id}`,
          {
            name: user.label,
            isTesting: true,
            id: user.id
          },
          'sr25519'
        )
        users[index].address = pair.address
        keyring.saveAccount(pair)
        moving()
      })
    }

    const transferToUsers = () => {
      initStep(users.length)
      users.forEach(user => {
        const amount = Math.ceil(Math.random() * 1000)
        signedTx(getAlic(), 'balances', 'transfer', [user.address, reduceDenomToBalance(amount, chainInfo.value.decimal)])
      })
    }

    const transferSocToUsers = () => {
      initStep(users.length)
      users.forEach(user => {
        const amount = Math.ceil(Math.random() * 1000)
        signedTx(getAlic(), 'zdToken', 'transferSocial', [user.address, reduceDenomToBalance(amount, chainInfo.value.decimal)])
      })
    }

    const trust = () => {
      initStep(edges.length)
      edges.forEach(edge => {
        const form = userPair(edge.source)
        const to = userPair(edge.target)
        signedTx(form, 'zdTrust', 'trust', [to.address])
      })
    }

    const newRound = () => {
      initStep(1)
      signedTx(getAlic(), 'zdRefreshSeeds', 'start', [])
    }

    const newSeeds = () => {
      initStep(seeds.length)
      seeds.forEach(seed => {
        const seedAddress = userPair(seed.id).address
        signedTx(getAlic(), 'zdRefreshSeeds', 'add', [seedAddress, parseInt(seed.value) * 100])
      })
    }

    const harvestSeeds = () => {
      initStep(seeds.length)
      seeds.forEach(seed => {
        const seedAddress = userPair(seed.id).address
        signedTx(getAlic(), 'zdRefreshSeeds', 'harvestSeed', [seedAddress])
      })
    }

    const refreshReputationStart = () => {
      initStep(1)
      signedTx(getAlic(), 'zdRefreshReputation', 'start', [])
    }

    const updateReputations = () => {
      initStep(users.length)
      users.forEach(user => {
        const userAddress = userPair(user.id).address
        signedTx(getAlic(), 'zdRefreshReputation', 'refresh', [[userAddress, parseInt(user.reputation)]])
      })
    }

    const harvestAllReputations = () => {
      initStep(users.length)
      users.forEach(() => {
        signedTx(getAlic(), 'zdRefreshReputation', 'harvestRefAll', [])
      })
    }

    const nextStep = () => {
      current.value += 1
      msg.value.status = 'process'
      msg.value.msgs = []
      deadlineRef.value = 0

      try {
        switch (current.value) {
          case 0:
            readFiles()
            break
          case 1:
            addUsers()
            break
          case 2:
            transferToUsers()
            break
          case 3:
            watingBlock()
            break
          case 4:
            transferSocToUsers()
            break
          case 5:
            watingBlock()
            break
          case 6:
            trust()
            break
          case 7:
            watingBlock()
            break
          case 8:
            newRound()
            break
          case 9:
            newSeeds()
            break
          case 10:
            watingBlock()
            break
          case 11:
            harvestSeeds()
            break
          case 12:
            refreshReputationStart()
            break
          case 13:
            updateReputations()
            break
          case 14:
            watingBlock()
            break
          case 15:
            harvestAllReputations()
            break
          case 16:
            // finish()
            break
          default:
            break
        }
      } catch (error) {
        msg.value.status = 'error'
        msg.value.msgs.push(`Error: ${error}`)
      }
    }

    const start = () => {
      if (state.nextStep) {
        state.nextStep = false
        nextStep()
      }
    }

    return {
      start,
      current,
      msg,
      percentInfo,
      deadlineRef,
      watingBlock
    }
  }
})
</script>

<style lang="less">
.tests {
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
    color: #fff;
  }
  .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
    color: #399cf1;
  }
  .ant-steps-item-title {
    font-weight: bold;
  }
  .ant-card {
    margin: 0 5px 10px 5px !important;
  }
  .circle {
    text-align: center;
    margin: auto;
  }
  .operation {
    a {
      width: 100%;
      display: flex;
      justify-content: space-between;
      color: #fff;
      span:nth-child(1) {
        font-weight: bold;
      }
    }
    button {
      float: right;
    }
  }
  .ant-statistic-content-value {
    color: #fff;
  }
  .ant-steps-item-wait .ant-steps-item-icon {
    border-color: #f3ebeb40;
  }
  .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
    color: #f3ebeb40;
  }
  .msg {
    a {
      color: #fff;
      display: block;
      margin: 10px auto;
    }
  }
}
</style>
