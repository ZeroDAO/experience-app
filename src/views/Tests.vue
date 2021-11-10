<template>
  <div class="tests">
    <a-row>
      <a-col :span="24" :lg="10">
        <a-card title="Steps" :bordered="false">
          <a-steps direction="vertical" :current="current" :status="jobInfo.status">
            <a-step v-for="(job, i) in jobs" :key="i" :title="job.title" :description="job.description" />
          </a-steps>
        </a-card>
      </a-col>
      <a-col :span="24" :lg="14">
        <a-card v-if="jobInfo.status != 'finish'" :title="current >= 0 ? jobs[current].title : ''" :bordered="false">
          <template #extra>
            <a-button class="stop-btn" danger @click="onStop()" shape="round" :disabled="isStop"> Stop </a-button>
          </template>
          <a-row>
            <a-col :span="12" class="circle">
              <a-progress type="circle" :percent="parseInt(percentInfo.total == 0 ? 0 : ((percentInfo.finish + percentInfo.error) * 100) / percentInfo.total)" />
            </a-col>
            <a-col :span="12" class="operation">
              <a>
                <span>Total Tx</span>
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
              <a>
                <span>Total data</span>
                <span> {{ totalData }} </span>
              </a>
              <a-divider />
              <a-button type="primary" @click="start(isStop)" size="large" shape="round" :disabled="jobInfo.status != 'wait' && !isStop"> Start </a-button>
              <a-button v-if="jobInfo.status == 'error'" danger type="primary" @click="start(true)" size="large" shape="round"> Continue </a-button>
            </a-col>
            <a-col :span="24" class="msg">
              <div v-if="deadlineRef != 0">
                <a-divider />
                <a-statistic-countdown title="Countdown" :value="deadlineRef" @finish="waitingBlock" />
              </div>
              <a-divider />
              <a-alert v-if="current >= 0 && jobs[current].note" :message="jobs[current].note" type="info" show-icon />
              <a v-for="(m, i) in jobInfo.msgs" :key="i">{{ m }}</a>
            </a-col>
          </a-row>
        </a-card>
        <a-card v-else :bordered="false">
          <a-result title="Great, we have done all the operations!">
            <template #icon>
              <smile-twoTone />
            </template>
            <!-- <template #extra>
            <a-button type="primary">Next</a-button>
          </template> -->
          </a-result>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, reactive } from 'vue'
import { useSubstrateContext, bestNumber } from '@/hooks'
import { keyring } from '@polkadot/ui-keyring'
import { reduceDenomToBalance } from '@/utils/common'
import { useStore } from 'vuex'
import { SmileTwoTone } from '@ant-design/icons-vue'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types'
import { KeyringPair } from '@polkadot/keyring/types'

const jobs = [
  {
    title: 'Read Users',
    description: 'Reading PreTest data.',
    note: 'If the data is large, it will consume a lot of resources.'
  },
  {
    title: 'Add Users',
    description: 'Add users to keyring.',
    note: ''
  },
  {
    title: 'Transfer',
    description: 'Transfer ZOO to users.',
    note: 'If the data is large, it will consume a lot of resources.'
  },
  {
    title: 'Transfer Social',
    description: 'Transfer Social ZOO to users.',
    note: 'If the data is large, it will consume a lot of resources.'
  },
  {
    title: 'Update Relationships',
    description: 'Updated relationships to chain.',
    note: 'If the data is large, it will consume a lot of resources.'
  },
  {
    title: 'New Round',
    description: 'New Round Started.',
    note: ''
  },
  {
    title: 'Update seeds',
    description: 'Updated seeds to chain.',
    note: ''
  },
  {
    title: 'Wait',
    description: 'Waiting for seed confirmation.',
    note: 'This period is a reserved challenge period and the test network is generally set to a smaller number of value'
  },
  {
    title: 'Harvest: Seeds',
    description: 'Pathfinder receives Seed earnings.',
    note: ''
  },
  {
    title: 'Start: Refresh reputation',
    description: 'Initial reputation refresh.',
    note: ''
  },
  {
    title: 'Update Reputations',
    description: 'Updated reputations to chain.',
    note: 'This operation will allocate social currency, consume a lot of on-chain resources, and pack too many transactions that will cause the block to exceed the weight limit'
  },
  {
    title: 'Wait',
    description: 'Waiting for reputations confirmation.',
    note: 'This period is a reserved challenge period and the test network is generally set to a smaller number of value'
  },
  {
    title: 'Harvest: Reputations',
    description: 'Pathfinder receives Reputation earnings.',
    note: ''
  },
  {
    title: 'Done',
    description: 'All done!.',
    note: ''
  }
]

export default defineComponent({
  components: {
    SmileTwoTone
  },
  setup() {
    const { api } = useSubstrateContext()
    const apiRef = computed(() => api)
    const deadlineRef = ref(0)
    const totalData = ref(0)

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

    type TxInfoType = {
      txExecute: SubmittableExtrinsic<'promise', ISubmittableResult>
      fromAcct: KeyringPair
      range: number
    }

    interface TxData {
      nextStep: boolean
      txInfos: TxInfoType[]
      nextTx: boolean
    }

    const state = reactive<TxData>({
      nextStep: true,
      txInfos: [],
      nextTx: false
    })
    const isStop = ref(false)

    const current = ref(-1)
    const jobInfo = ref<msgType>({
      status: 'wait',
      msgs: []
    })
    const percentInfo = ref<PercentType>({
      total: 1,
      finish: 0,
      error: 0
    })

    let users = null
    const allAddress = null
    let seeds = null
    let edges = null
    let alice = null
    let edgesCount = null

    const store = useStore()
    const chainInfo = computed(() => store.state.general.chainInfo)

    const chainConfig = async () => {
      const confirmationPeriod = chainInfo.value.confirmationPeriod
      const sysInfo = await api.query.zdReputation.systemInfo()
      const lastUpdateAt = (sysInfo as any).last.toNumber()
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

    const initStep = total => {
      percentInfo.value.total = total
      percentInfo.value.finish = 0
      percentInfo.value.error = 0
    }

    const moving = (isErr?: boolean) => {
      if (isErr) {
        jobInfo.value.status = 'error'
        percentInfo.value.error += 1
      } else {
        percentInfo.value.finish += 1
      }
      if (percentInfo.value.error + percentInfo.value.finish >= percentInfo.value.total) {
        state.nextTx = false
        if (jobInfo.value.status != 'error') {
          current.value += 1
        }
      }
    }

    const waitingBlock = async () => {
      initStep(1)
      const startBlock = await bestNumber(apiRef)
      const { lastUpdateAt, confirmationPeriod } = await chainConfig()

      if (lastUpdateAt + confirmationPeriod <= startBlock) {
        moving()
      } else {
        jobInfo.value.msgs[0] = `Current Block: ${startBlock}, Target Block: ${lastUpdateAt + confirmationPeriod}`
        jobInfo.value.msgs[1] = `Wating...`
        deadlineRef.value = Date.now() + (lastUpdateAt + confirmationPeriod - startBlock) * 6000
      }
    }

    const txResHandler = ({ status }): void => {
      if (status.isInBlock) {
        state.nextTx = true
        moving()
        const msg = `Completed. Block hash: ${status.asInBlock.toString()}`
        const last = jobInfo.value.msgs[jobInfo.value.msgs.length - 1]
        if (last === msg) return

        jobInfo.value.msgs.push(`Completed. Block hash: ${status.asInBlock.toString()}`)
      }
    }

    const txErrHandler = err => {
      moving(true)
      jobInfo.value.msgs.push(`Transaction Failed: ${err.toString()}`)
    }

    const unitTx = (palletRpc, callable, params) => {
      return params ? apiRef?.value?.tx[palletRpc][callable](...params) : apiRef?.value?.tx[palletRpc][callable]()
    }

    const batchTx = async (fromAcct, palletRpc, callable, dataSet) => {
      const txs = dataSet.map(data => unitTx(palletRpc, callable, data))
      const txExecute = apiRef?.value?.tx.utility.batch(txs)
      state.txInfos.push({
        txExecute: txExecute,
        fromAcct: fromAcct,
        range: dataSet.length
      })
    }

    const signedTx = async (fromAcct, palletRpc, callable, params) => {
      const txExecute = params ? apiRef?.value?.tx[palletRpc][callable](...params) : apiRef?.value?.tx[palletRpc][callable]()
      state.txInfos.push({
        txExecute: txExecute,
        fromAcct: fromAcct,
        range: 1
      })
    }

    const initEdgesCount = () => {
      if (edgesCount === null) {
        edgesCount = require(`@/testing-utils/data/edges.json`).length
      }
    }

    const initUsers = () => {
      if (!users) {
        users = require(`@/testing-utils/data/nodes.json`)
      }
    }

    const initAllAddress = () => {
      if (!allAddress) {
        initUsers()
        users = require(`@/testing-utils/data/nodes.json`)
      }
    }

    const initSeeds = () => {
      if (!seeds) {
        seeds = require(`@/testing-utils/data/seeds.json`)
      }
    }

    const initEdges = () => {
      if (!edges) {
        edges = require(`@/testing-utils/data/edges_set.json`)
      }
    }

    const readFiles = () => {
      initStep(4)
      totalData.value = 4
      const files = require.context(`@/testing-utils/data/`, false, /\.json$/).keys()

      const requireFiles = ['./nodes.json', './seeds.json', './edges_set.json', './edges.json']

      requireFiles.forEach(file => {
        if (!(files.indexOf(file) > -1)) {
          jobInfo.value = {
            status: 'error',
            msgs: [`Missing file ${file}`]
          }
        }
      })
      initUsers()
      jobInfo.value.msgs.push(`Users count: ${users.length}`)
      moving()
      initSeeds()
      jobInfo.value.msgs.push(`Seeds count: ${seeds.length}`)
      moving()
      initEdges()
      moving()
      initEdgesCount()
      jobInfo.value.msgs.push(`Edges count: ${edgesCount}`)
      moving()
    }

    const addUsers = () => {
      initStep(users.length)
      totalData.value = users.length
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
        // allAddress[users[index].id] = pair.address
        moving()
        // keyring.saveAccount(pair)
        keyring.saveAddress(pair.address, { name: users[index].label })
      })
    }

    const transferToUsers = () => {
      totalData.value = users.length

      let total = 0
      const range = 100
      for (let i = 0; i * range < users.length; i++) {
        const dataSet = []
        for (let index = 0; index < range && i * range + index < users.length; index++) {
          const user = users[i * range + index]
          const amount = Math.ceil(Math.random() * 100) + 10
          dataSet.push([user.address, reduceDenomToBalance(amount, chainInfo.value.tokenDecimal)])
        }
        total++
        batchTx(getAlic(), 'balances', 'transfer', dataSet)
      }
      initStep(total)
      state.nextTx = true
    }

    const transferSocToUsers = () => {
      totalData.value = users.length

      let total = 0
      const range = 100
      for (let i = 0; i * range < users.length; i++) {
        const dataSet = []
        for (let index = 0; index < range && i * range + index < users.length; index++) {
          const user = users[i * range + index]
          const amount = Math.ceil(Math.random() * 100)
          dataSet.push([user.address, reduceDenomToBalance(amount, chainInfo.value.tokenDecimal)])
        }
        total++
        batchTx(getAlic(), 'zdToken', 'transferSocial', dataSet)
      }
      initStep(total)
      state.nextTx = true
    }

    const trust = () => {
      initEdges()
      initEdgesCount()
      totalData.value = edgesCount

      let total = 0
      // Should be greater than the maximum number of trusts
      // const range = 100
      Object.keys(edges).forEach(key => {
        const targrts = edges[key]
        const form = userPair(key)
        const dataSet = targrts.map(id => [userPair(id).address])
        total++
        batchTx(form, 'zdTrust', 'trust', dataSet)

        // for (let i = 0; i * range < targrts.length; i++) {
        //   const dataSet = []
        //   for (let index = 0; index < range && i * range + index < targrts.length; index++) {
        //     const to = userPair(targrts[i * range + index])
        //     dataSet.push([to.address])
        //   }
        //   total++
        //   batchTx(form, 'zdTrust', 'trust', dataSet)
        // }
      })
      initStep(total)
      state.nextTx = true
    }

    const newRound = () => {
      totalData.value = 1
      initStep(1)
      signedTx(getAlic(), 'zdRefreshSeeds', 'start', [])
      state.nextTx = true
    }

    const newSeeds = () => {
      initSeeds()
      totalData.value = seeds.length

      let total = 0
      const range = 10
      for (let i = 0; i * range < seeds.length; i++) {
        const dataSet = []
        for (let index = 0; index < range && i * range + index < seeds.length; index++) {
          const seed = seeds[i * range + index]
          const seedAddress = userPair(seed.id).address
          dataSet.push([seedAddress, parseInt(seed.value) * 100])
        }
        total++
        batchTx(getAlic(), 'zdRefreshSeeds', 'add', dataSet)
      }
      initStep(total)
      state.nextTx = true
    }

    const harvestSeeds = () => {
      initSeeds()
      initStep(seeds.length)
      totalData.value = seeds.length
      console.log(seeds)

      seeds.forEach(seed => {
        const seedAddress = userPair(seed.id).address
        signedTx(getAlic(), 'zdRefreshSeeds', 'harvestSeed', [seedAddress])
      })
      state.nextTx = true
    }

    const refreshReputationStart = () => {
      totalData.value = 1

      initStep(1)
      signedTx(getAlic(), 'zdRefreshReputation', 'start', [])
      state.nextTx = true
    }

    const updateReputations = () => {
      initUsers()
      totalData.value = users.length

      let total = 0
      const range = 5
      for (let i = 0; i * range < users.length; i++) {
        const dataSet = []
        for (let index = 0; index < range && i * range + index < users.length; index++) {
          const user = users[i * range + index]
          const userAddress = userPair(user.id).address
          dataSet.push([[[userAddress, parseInt(user.reputation)]]])
        }
        total++
        batchTx(getAlic(), 'zdRefreshReputation', 'refresh', dataSet)
      }
      initStep(total)
      state.nextTx = true
    }

    const harvestAllReputations = () => {
      totalData.value = 1

      initUsers()
      initStep(1)
      users.forEach(() => {
        signedTx(getAlic(), 'zdRefreshReputation', 'harvestRefAll', [])
      })
      state.nextTx = true
    }

    const onFinish = () => {
      jobInfo.value.status = 'finish'
    }

    const onStop = () => {
      isStop.value = true
    }

    const nextStep = () => {
      jobInfo.value.status = 'process'
      jobInfo.value.msgs = []
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
            transferSocToUsers()
            break
          case 4:
            trust()
            break
          case 5:
            newRound()
            break
          case 6:
            newSeeds()
            break
          case 7:
            waitingBlock()
            break
          case 8:
            harvestSeeds()
            break
          case 9:
            refreshReputationStart()
            break
          case 10:
            updateReputations()
            break
          case 11:
            waitingBlock()
            break
          case 12:
            harvestAllReputations()
            break
          case 13:
            onFinish()
            break
          default:
            break
        }
      } catch (error) {
        jobInfo.value.status = 'error'
        jobInfo.value.msgs.push(`Error: ${error}`)
      }
    }

    const start = async (restart?: boolean) => {
      isStop.value = false
      if (restart) {
        return nextStep()
      }
      current.value += 1

      const doUnsub = unsub => {
        return (): void => {
          if (!unsub) {
            console.log('fuck it')
          }
          unsub && unsub()
        }
      }

      let singersSet: Array<string> = []

      watch(
        () => state.nextTx,
        async nextTx => {
          if (!nextTx) return
          const concurrent = 10

          state.nextTx = false

          for (let i = 1; i < concurrent; i++) {
            if (i == 1) {
              singersSet = []
            }
            if (state.txInfos.length > 0) {
              const txInfo = state.txInfos[0]
              if (singersSet && singersSet.indexOf(txInfo.fromAcct.address) > -1) {
                singersSet = []
                return
              }
              state.txInfos.shift()
              singersSet.push(txInfo.fromAcct.address)
              const unsub = await txInfo.txExecute.signAndSend(txInfo.fromAcct, txResHandler).catch(txErrHandler)
              doUnsub(unsub)
            }
          }
        },
        { immediate: true }
      )

      watch(
        () => current.value,
        () => {
          nextStep()
        },
        { immediate: true }
      )
    }

    return {
      start,
      current,
      jobInfo,
      percentInfo,
      deadlineRef,
      waitingBlock,
      jobs,
      isStop,
      onStop,
      totalData
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
      margin-left: 15px;
    }
  }
  .ant-alert-message {
    color: #ff7f0b;
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
      color: #81859f;
      display: block;
      margin: 10px auto;
      font-size: 12px;
    }
  }
  .ant-result-title {
    color: #fff;
  }
}
</style>
