<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="节点名称">
                <a-input v-model="queryParam.taskNameLike" placeholder="请输入节点名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="BusinessKey">
                <a-input v-model="queryParam.processBusinessKeyLike" placeholder="请输入业务key"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="处理人">
                <a-input v-model="queryParam.taskAssigneeLike" placeholder="请输入处理人"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="参与人">
                <a-select :options="getUsers" v-model="queryParam.taskInvolvedUser" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="创建时间">
                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-model="queryParam.taskCreatedCondition"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="完成时间">
                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-model="queryParam.taskCompletedCondition"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="任务期限">
                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-model="queryParam.dueDateCondition"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="优先级">
                <a-input-number v-model="queryParam.taskPriority" placeholder="请输入优先级"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="状态">
                <a-select :options="allStatus" v-model="queryParam.finished" placeholder="全部"/>
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
      <span slot="startTime" slot-scope="text">
        {{ formatDate(text) }}
      </span>
      <span slot="endTime" slot-scope="text">
        {{ formatDate(text) }}
      </span>
      <span slot="dueDate" slot-scope="text">
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
          <a-divider v-if="!record.endTime" type="vertical"/>
          <a v-if="!record.endTime"@click="complete(record)">完成</a>
          <a-divider v-if="!record.endTime && !record.assignee" type="vertical"/>
          <a v-if="!record.endTime && !record.assignee"@click="assign(record)">指派</a>
        </template>
      </span>
    </s-table>
    <trace
      ref="trace"
      :format-date="formatDate"
      :duration="duration"
      :record="recordActive"
    />
    <assign
      ref="assign"
      :refresh="refresh"
      :get-candidates="getCandidates"
      :task-assign="taskAction"
      :record="recordActive"
    />
  </a-card>
</template>

<script>
import { queryList, taskAction, taskCandidate } from '@/api/process/task'
import { deleteProcessInstance, getProcessInstance } from '@/api/process/instance'
import { queryUsers } from '@/api/process/identity'
import { STable } from '@/components'
import Trace from '../instance/components/Trace'
import Assign from './components/Assign'
import { formatDate, duration } from '@/utils/common'
export default {
  name: 'Task',
  components: {
    STable,
    Trace,
    Assign
  },
  data () {
    return {
      getCandidates: [],
      taskAction: taskAction,
      deleteProcessInstance: deleteProcessInstance,
      getProcessInstance: getProcessInstance,
      duration: duration,
      formatDate: formatDate,
      allStatus: [{ label: '全部', value: '' }, { label: '进行', value: 'false' }, { label: '结束', value: 'true' }],
      // 查询参数
      getUsers: [{ label: '全部', value: '' }],
      queryParam: { 'finished': 'false' },
      // 列表表头
      columns: [
        {
          title: '序列',
          dataIndex: 'sequence',
          key: 'sequence',
          scopedSlots: { customRender: 'sequence' }
        },
        {
          title: '节点名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '表单Key',
          dataIndex: 'formKey',
          key: 'formKey'
        },
        {
          title: '处理人',
          dataIndex: 'assignee',
          key: 'assignee'
        },
        {
          title: '创建时间',
          dataIndex: 'startTime',
          key: 'startTime',
          width: '150px',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '完成时间',
          dataIndex: 'endTime',
          key: 'endTime',
          width: '150px',
          scopedSlots: { customRender: 'endTime' }
        },
        {
          title: '任务期限',
          dataIndex: 'dueDate',
          key: 'dueDate',
          width: '150px',
          scopedSlots: { customRender: 'dueDate' }
        },
        {
          title: '耗时',
          dataIndex: 'durationInMillis',
          key: 'durationInMillis',
          scopedSlots: { customRender: 'durationInMillis' }
        },
        {
          title: '优先级',
          dataIndex: 'priority',
          key: 'priority'
        },
        {
          title: '状态',
          dataIndex: 'endTime',
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
        return queryList(Object.assign(parameter, this.getQuery()))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      },
      // 单个记录行
      recordActive: {}
    }
  },
  created () {
    queryUsers().then((res) => {
      if (res.code === 10000) {
        const dnyUsers = res.result.map(item => {
          return { label: `${item.lastName}`, value: `${item.id}` }
        })
        this.getUsers = [...this.getUsers, ...dnyUsers]
      }
    })
  },
  computed: {},
  methods: {
    complete (record) {
      taskAction(record.id, { 'action': 'complete' }).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
          this.$refs.taskTable.refresh(true)
        }
      })
    },
    /**
     * 指派
     * @param record
     */
    assign (record) {
      taskCandidate(record.id).then((res) => {
        if (res.code === 10000) {
          this.recordActive = record
          const dnyCandidates = res.result.map(item => {
            return { label: `${item.user}`, value: `${item.user}` }
          })
          this.getCandidates = dnyCandidates
          this.$refs.assign.show()
        }
      }
      )
    },
    /**
     * 跟踪
     * @param record
     */
    trace (record) {
      getProcessInstance(record.processInstanceId).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.trace.show()
        }
      })
    },
    getQuery () {
      const _queryParma = Object.assign({}, this.queryParam)
      if (this.queryParam.taskCreatedCondition) {
        _queryParma.taskCreatedBefore = formatDate(this.queryParam.taskCreatedCondition[1], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.taskCreatedAfter = formatDate(this.queryParam.taskCreatedCondition[0], 'YYYY-MM-DD HH:mm:ssD')
        _queryParma.taskCreatedCondition = []
      }
      if (this.queryParam.taskCompletedCondition) {
        _queryParma.taskCompletedBefore = formatDate(this.queryParam.taskCompletedCondition[1], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.taskCompletedAfter = formatDate(this.queryParam.taskCompletedCondition[0], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.taskCompletedCondition = []
      }
      if (this.queryParam.dueDateCondition) {
        _queryParma.dueDateBefore = formatDate(this.queryParam.dueDateCondition[1], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.dueDateAfter = formatDate(this.queryParam.dueDateCondition[0], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.dueDateCondition = []
      }
      return _queryParma
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
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
