<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="流程">
                <a-select :options="getProcessDefinitions" v-model="queryParam.processDefinitionId" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="状态">
                <a-select :options="allStatus" v-model="queryParam.state" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.processInstanceTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-authorize:SYS_API_ADD type="primary" icon="plus" @click="handleStart()">启动一个流程</a-button>
      </div>
    </div>
    <s-table
      ref="processInstanceTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="sequence" slot-scope="text, record, index">
        {{ index+1 }}
      </span>
      <span slot="started" slot-scope="text">
        {{ formatDate(text) }}
      </span>
      <span slot="ended" slot-scope="text">
        {{ formatDate(text) }}
      </span>
      <span slot="durationInMillis" slot-scope="text">
        {{ duration(text) }}
      </span>
      <span slot="status" slot-scope="text">
        {{ text?'结束':'进行' }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="trace(record)">跟踪</a>
          <a-divider v-if="!record.ended" type="vertical"/>
          <a v-if="record.cancel" @click="cancel(record)">终止</a>
        </template>
      </span>
    </s-table>
    <trace
      ref="trace"
      :format-date="formatDate"
      :duration="duration"
      :record="recordActive"
    />
    <cancel
      ref="cancel"
      :delete-process-instance="deleteProcessInstance"
      :refresh="refresh"
      :record="recordActive" />
    <start-process-instance
      ref="startProcessInstance"
      :refresh="refresh"
      :get-process-definitions="getProcessDefinitions"
    />
  </a-card>
</template>

<script>
import { getProcessInstance } from '@/api/process/instance'
import { listProcessInstancesCurrentUser, listProcessDefinitions, deleteProcessInstanceCurrentUser } from '@/api/process/user'
import { STable } from '@/components'
import Trace from '../../instance/components/Trace'
import Cancel from '../../instance/components/Cancel'
import StartProcessInstance from './components/StartProcessInstance'
import { formatDate, duration } from '@/utils/common'
const _allStatus = [{ label: '全部', value: 'all' }, { label: '进行', value: 'running' }, { label: '结束', value: 'completed' }]
export default {
  name: 'UserProcessInstances',
  components: {
    STable,
    Trace,
    Cancel,
    StartProcessInstance
  },
  data () {
    return {
      duration: duration,
      formatDate: formatDate,
      allStatus: _allStatus,
      // 查询参数
      getProcessDefinitions: [{ label: '全部', value: '' }],
      queryParam: { state: 'running' },
      // 列表表头
      columns: [
        {
          title: '序列',
          dataIndex: 'sequence',
          key: 'sequence',
          scopedSlots: { customRender: 'sequence' }
        },
        {
          title: '流程名称',
          dataIndex: 'processDefinitionName',
          key: 'processDefinitionName'
        },
        {
          title: '实例名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'BusinessKey',
          dataIndex: 'businessKey',
          key: 'businessKey'
        },
        {
          title: '发起人',
          dataIndex: 'startedBy.id',
          key: 'startedBy.id'
        },
        {
          title: '发起时间',
          dataIndex: 'started',
          key: 'started',
          width: '150px',
          scopedSlots: { customRender: 'started' }
        },
        {
          title: '结束时间',
          dataIndex: 'ended',
          key: 'ended',
          width: '150px',
          scopedSlots: { customRender: 'ended' }
        },
        {
          title: '耗时',
          dataIndex: 'durationInMillis',
          key: 'durationInMillis',
          scopedSlots: { customRender: 'durationInMillis' }
        },
        {
          title: '状态',
          dataIndex: 'ended',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '320px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return listProcessInstancesCurrentUser(Object.assign(parameter, this.getQuery()))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      },
      // 单个记录行
      recordActive: {},
      deleteProcessInstance: deleteProcessInstanceCurrentUser
    }
  },
  created () {
    listProcessDefinitions().then((res) => {
      if (res.code === 10000) {
        const dnyProcessDefinitions = res.result.map(item => {
          return { label: `${item.name}`, value: `${item.id}`, name: `${item.name}`, hasStartForm: `${item.hasStartForm}` }
        })
        this.getProcessDefinitions = [...this.getProcessDefinitions, ...dnyProcessDefinitions]
      }
    })
  },
  computed: {},
  methods: {
    /**
     * 结束
     * @param record
     */
    cancel (record) {
      this.recordActive = record
      this.$refs.cancel.show()
    },
    /**
     * 启动一个流程
     */
    handleStart () {
      this.$refs.startProcessInstance.show()
    },
    /**
     * 跟踪
     * @param record
     */
    trace (record) {
      getProcessInstance(record.id).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.trace.show()
        }
      })
    },
    getQuery () {
      const _queryParma = Object.assign({}, this.queryParam)
      return _queryParma
    },
    // 重置查询
    restQuery () {
      this.queryParam = { state: 'running' }
      this.$refs.processInstanceTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.processInstanceTable.refresh()
    }
  }
}
</script>

<style scoped>

</style>
