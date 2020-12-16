<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="实例名称">
                <a-input v-model="queryParam.nameLike" placeholder="请输入实例名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="BusinessKey">
                <a-input v-model="queryParam.businessKey" placeholder="请输入业务key"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="发起人">
                <a-select :options="getUsers" v-model="queryParam.startedBy" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="参与人">
                <a-select :options="getUsers" v-model="queryParam.involvedUser" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="发起时间">
                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-model="queryParam.startedCondition"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="结束时间">
                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-model="queryParam.finishedCondition"/>
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
                <a-button type="primary" @click="$refs.instanceTable.refresh(true)">查询</a-button>
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
      ref="instanceTable"
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
          <a v-if="!record.endTime" @click="cancel(record)">终止</a>
        </template>
      </span>
    </s-table>
    <cancel
      ref="cancel"
      :delete-process-instance="deleteProcessInstance"
      :refresh="refresh"
      :record="recordActive" />
    <trace
      ref="trace"
      :format-date="formatDate"
      :duration="duration"
      :record="recordActive"
    />
  </a-card>
</template>

<script>
import { queryList, deleteProcessInstance, getProcessInstance } from '@/api/process/instance'
import { queryUsers } from '@/api/process/identity'
import { STable } from '@/components'
import Cancel from './components/Cancel'
import Trace from './components/Trace'
import { formatDate, duration } from '@/utils/common'
export default {
  name: 'Instance',
  components: {
    STable,
    Cancel,
    Trace
  },
  data () {
    return {
      deleteProcessInstance: deleteProcessInstance,
      getProcessInstance: getProcessInstance,
      formatDate: formatDate,
      duration: duration,
      allStatus: [{ label: '全部', value: '' }, { label: '进行', value: 'false' }, { label: '结束', value: 'true' }],
      getUsers: [{ label: '全部', value: '' }],
      // 查询参数
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
          dataIndex: 'startUserId',
          key: 'startUserId'
        },
        {
          title: '发起时间',
          dataIndex: 'startTime',
          key: 'startTime',
          width: '150px',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          key: 'endTime',
          width: '150px',
          scopedSlots: { customRender: 'endTime' }
        },
        {
          title: '耗时',
          dataIndex: 'durationInMillis',
          key: 'durationInMillis',
          scopedSlots: { customRender: 'durationInMillis' }
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
    /**
     * 结束
     * @param record
     */
    cancel (record) {
      this.recordActive = record
      this.$refs.cancel.show()
    },
    getQuery () {
      const _queryParma = Object.assign({}, this.queryParam)
      if (this.queryParam.startedCondition) {
        _queryParma.startedBefore = formatDate(this.queryParam.startedCondition[1], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.startedAfter = formatDate(this.queryParam.startedCondition[0], 'YYYY-MM-DD HH:mm:ssD')
        _queryParma.startedCondition = []
      }
      if (this.queryParam.finishedCondition) {
        _queryParma.finishedBefore = formatDate(this.queryParam.finishedCondition[1], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.finishedAfter = formatDate(this.queryParam.finishedCondition[0], 'YYYY-MM-DD HH:mm:ss')
        _queryParma.finishedCondition = []
      }
      return _queryParma
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.instanceTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.instanceTable.refresh()
    }
  }
}
</script>

<style scoped>

</style>
