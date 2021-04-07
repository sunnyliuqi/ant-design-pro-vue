<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="任务名称">
                <a-input v-model="queryParam.taskNameLike" placeholder="请输入任务名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="流程">
                <a-select :options="getProcessDefinitions" v-model="queryParam.processDefinitionId" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="状态">
                <a-select :options="allStatus" v-model="queryParam.state" placeholder="请选择"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.taskTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
      </div>
    </div>
    <s-table
      ref="taskTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="sequence" slot-scope="text, record, index">
        {{ index+1 }}
      </span>
      <span slot="involvedPeople" slot-scope="text">
        {{ getInvolvedPeople(text) }}
      </span>
      <span slot="assignee" slot-scope="text">
        {{ getAssignee(text) }}
      </span>
      <span slot="created" slot-scope="text">
        {{ formatDate(text) }}
      </span>
      <span slot="duration" slot-scope="text">
        {{ duration(text) }}
      </span>
      <span slot="status" slot-scope="text">
        {{ text?'结束':'进行' }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="trace(record)">跟踪</a>
          <a-divider type="vertical"/>
          <a v-if="!record.endDate && record.complete" @click="complete(record)">完成</a>
          <a v-if="!record.endDate && record.claim " @click="claim(record)">获取</a>
        </template>
      </span>
    </s-table>
    <trace
      ref="trace"
      :format-date="formatDate"
      :duration="duration"
      :record="recordActive"
    />
    <complete-task
      ref="completeTask"
      :record="recordActive"
      :form-info="formInfo"
      :get-assignee="getAssignee"
      :get-involved-people="getInvolvedPeople"
      :complete-task-form="completeTaskForm"
      :refresh="refresh"/>
  </a-card>
</template>

<script>
import { getProcessInstance } from '@/api/process/instance'
import Trace from '../../instance/components/Trace'
import {
  listTasksCurrentUser,
  listProcessDefinitions,
  claimTask,
  getTask,
  taskForm,
  completeTaskForm
} from '@/api/process/user'
import { STable } from '@/components'
import CompleteTask from './components/CompleteTask'
import { formatDate, duration } from '@/utils/common'

const _allStatus = [{ label: '进行', value: 'running' }, { label: '结束', value: 'completed' }]
export default {
  name: 'UserTask',
  components: {
    STable,
    Trace,
    CompleteTask
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
          title: '任务名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'BusinessKey',
          dataIndex: 'processInstancesBusinessKey',
          key: 'processInstancesBusinessKey'
        },
        {
          title: '发起人',
          dataIndex: 'processInstanceStartUserId',
          key: 'processInstanceStartUserId'
        },
        {
          title: '可处理',
          dataIndex: 'involvedPeople',
          key: 'involvedPeople',
          scopedSlots: { customRender: 'involvedPeople' }
        },
        {
          title: '处理人',
          dataIndex: 'assignee',
          key: 'assignee',
          scopedSlots: { customRender: 'assignee' }
        },
        {
          title: '启动时间',
          dataIndex: 'created',
          key: 'created',
          width: '150px',
          scopedSlots: { customRender: 'created' }
        },
        {
          title: '耗时',
          dataIndex: 'duration',
          key: 'duration',
          scopedSlots: { customRender: 'duration' }
        },
        {
          title: '状态',
          dataIndex: 'endDate',
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
        return listTasksCurrentUser(Object.assign(parameter, this.getQuery()))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      },
      // 单个记录行
      recordActive: {},
      // 表单信息
      formInfo: undefined,
      completeTaskForm: completeTaskForm
    }
  },
  created () {
    listProcessDefinitions().then((res) => {
      if (res.code === 10000) {
        const dnyProcessDefinitions = res.result.map(item => {
          return { label: `${item.name}`, value: `${item.id}`, hasStartForm: `${item.hasStartForm}` }
        })
        this.getProcessDefinitions = [...this.getProcessDefinitions, ...dnyProcessDefinitions]
      }
    })
  },
  computed: {},
  methods: {
    getInvolvedPeople (involves) {
      let involvesString = ''
      if (involves && involves.length > 0) {
        involves.forEach(i => {
          involvesString = involvesString + i.id + ','
        })
        involvesString = involvesString.substring(0, involvesString.length - 1)
      }
      return involvesString
    },
    getAssignee (assignee) {
      if (assignee && assignee.id) {
        return assignee.id
      }
      return ''
    },
    trace (record) {
      getProcessInstance(record.processInstanceId).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.trace.show()
        }
      })
    },
    complete (record) {
      getTask(record.id).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          taskForm(record.id).then(res => {
            if (res.code === 10000) {
              this.formInfo = res.result
              this.$refs.completeTask.show()
            }
          })
        }
      })
    },
    claim (record) {
      claimTask(record.id).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
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
      this.$refs.taskTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.taskTable.refresh()
    }
  }
}
</script>

<style scoped>

</style>
