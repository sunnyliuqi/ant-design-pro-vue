<template>
  <a-drawer
    wrapClassName="custom-drawer  custom-drawer-8"
    title="流程跟踪"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-tabs>
      <a-tab-pane key="1" tab="实例信息">
        <a-row :gutter="16">
          <a-col :span="12">
            <span class="detail-label">实例名称</span><span class="detail-content">{{ record.name }}</span>
          </a-col>
          <a-col :span="12">
            <span class="detail-label">BusinessKey</span><span class="detail-content">{{ record.businessKey }}</span>
          </a-col>
          <a-col :span="12">
            <span class="detail-label">发起人</span><span class="detail-content">{{ record.startUserId }}</span>
          </a-col>
          <a-col :span="12">
            <span class="detail-label">发起时间</span><span class="detail-content">{{ formatDate(record.startTime) }}</span>
          </a-col>
          <a-col :span="12">
            <span class="detail-label">结束时间</span><span class="detail-content">{{ formatDate(record.endTime) }}</span>
          </a-col>
          <a-col :span="12">
            <span class="detail-label">耗时</span><span
              class="detail-content">{{ duration(record.durationInMillis) }}</span>
          </a-col>
          <a-col :span="12">
            <span class="detail-label">状态</span><span class="detail-content">{{ record.endTime?'结束':'进行' }}</span>
          </a-col>
          <a-col v-if="record.deleteReason" :span="12">
            <span class="detail-label">终止原因</span><span class="detail-content">{{ record.deleteReason }}</span>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="实例图表">
        <a-row :gutter="16">
          <a-col :span="24">
            <view-bpmn-design
              v-if="bpmnXml"
              ref="viewBpmnDesign"
              :xml="bpmnXml"
              :active-nodes="activeNodes"
            />
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="3" tab="实例跟踪">
        <s-table
          ref="taskTable"
          size="default"
          :rowKey="(recordActive) => recordActive.id"
          :columns="taskColumns"
          :data="loadDataTasks"
          showPagination="false"
        >
          <span slot="sequence" slot-scope="text, recordTask, index">
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
          <span slot="outcome" slot-scope="text" style="color: red">
            {{ text }}
          </span>
          <span slot="comment" slot-scope="text">
            {{ text&&text.message }}
          </span>
          <p slot="expandedRowRender" slot-scope="text" style="margin: 0">
            <a-table
              v-if="text && text.nodeForm && text.nodeForm.fields && text.nodeForm.fields.length>0"
              size="default"
              :pagination="false"
              :rowKey="(recordActive) => recordActive.id"
              :columns="formColumns"
              class="formTable"
              :data-source="text.nodeForm.fields"
            />
            <span v-else>无</span>
          </p>
        </s-table>
      </a-tab-pane>
      <a-tab-pane key="4" tab="实例变量">
        <s-table
          ref="variableTable"
          size="default"
          :rowKey="(recordActive) => recordActive.id"
          :columns="variableColumns"
          :data="loadDataVariables"
          showPagination="false"
        >
          <span slot="sequence" slot-scope="text, recordVariable, index">
            {{ index+1 }}
          </span>
        </s-table>
      </a-tab-pane>
      <a-tab-pane key="5" tab="子流程实例">
        <s-table
          ref="subprocessTable"
          size="default"
          :rowKey="(recordActive) => recordActive.id"
          :columns="subprocessColumns"
          :data="loadDataSubprocesses"
          showPagination="false"
        >
          <span slot="sequence" slot-scope="text, recordSubprocess, index">
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
        </s-table>
      </a-tab-pane>
      <a-tab-pane key="6" tab="jobs">
        <s-table
          ref="jobTable"
          size="default"
          :rowKey="(recordActive) => recordActive.id"
          :columns="jobColumns"
          :data="loadDataJobs"
          showPagination="false"
        >
          <span slot="sequence" slot-scope="text, recordJob, index">
            {{ index+1 }}
          </span>
          <span slot="dueDate" slot-scope="text">
            {{ formatDate(text) }}
          </span>
        </s-table>
      </a-tab-pane>
    </a-tabs>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button
        :style="{marginRight: '8px'}"
        @click="onClose"
      >
        返回
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { STable } from '@/components'
  import {
    getProcessInstanceDiagram,
    getHistoricProcessTaskInstances,
    getHistoricActivityInstances,
    getHistoricSubprocessInstances,
    getJobs
  } from '@/api/process/instance'
  import { ViewBpmnDesign } from '@/components/Activiti/Bpmn'

  const _formColumns = [{
    title: '字段名',
    dataIndex: 'name',
    key: 'name'
  },
    {
      title: '字段值',
      dataIndex: 'value',
      key: 'value'
    }]
  const _taskColumns = [
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
      title: '发起人/处理人',
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
      title: '任务状态',
      dataIndex: 'endTime',
      key: 'status',
      scopedSlots: { customRender: 'status' }
    },
    {
      title: '审批状态',
      dataIndex: 'outcome',
      fixed: 'right',
      key: 'outcome',
      scopedSlots: { customRender: 'outcome' }
    },
    {
      title: '批注',
      dataIndex: 'comment',
      key: 'comment',
      fixed: 'right',
      scopedSlots: { customRender: 'comment' }
    }
  ]
  const _variableColumns = [
    {
      title: '序列',
      dataIndex: 'sequence',
      key: 'sequence',
      scopedSlots: { customRender: 'sequence' }
    },
    {
      title: '变量名',
      dataIndex: 'variable.name',
      key: 'name'
    },
    {
      title: '变量值',
      dataIndex: 'variable.value',
      key: 'value'
    }
  ]
  const _subprocessColumns = [
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
    }
  ]
  const _jobColumns = [
    {
      title: '序列',
      dataIndex: 'sequence',
      key: 'sequence',
      scopedSlots: { customRender: 'sequence' }
    },
    {
      title: '流程实例id',
      dataIndex: 'processInstanceId',
      key: 'processInstanceId'
    },
    {
      title: '执行id',
      dataIndex: 'executionId',
      key: 'executionId'
    },
    {
      title: '有效期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      scopedSlots: { customRender: 'dueDate' }
    },
    {
      title: '重试次数',
      dataIndex: 'retries',
      key: 'retries'
    },
    {
      title: '异常消息',
      dataIndex: 'exceptionMessage',
      key: 'exceptionMessage'
    }
  ]
  export default {
    name: 'Trace',
    components: {
      STable,
      ViewBpmnDesign
    },
    props: {
      record: {
        type: Object,
        default: function () {
          return {}
        }
      },
      formatDate: {
        type: Function,
        default: undefined
      },
      duration: {
        type: Function,
        default: undefined
      }
    },
    data () {
      return {
        visible: false,
        bpmnXml: undefined,
        activeNodes: [],
        taskColumns: _taskColumns,
        variableColumns: _variableColumns,
        subprocessColumns: _subprocessColumns,
        jobColumns: _jobColumns,
        formColumns: _formColumns,
        /**
         * 任务
         */
        loadDataTasks: parameter => {
          return getHistoricProcessTaskInstances(this.record.id)
            .then(res => {
              if (res.code === 10000) {
                return res.result
              }
            })
        },
        /**
         * 变量
         */
        loadDataVariables: parameter => {
          return getHistoricActivityInstances(this.record.id)
            .then(res => {
              if (res.code === 10000) {
                return this.filterVariable(res.result.data)
              }
            })
        },
        filterVariable (data) {
          if (data && data.length > 0) {
            return data.filter(this.removeVariable)
          }
          return data
        },
        removeVariable (v) {
          if (v.variable.name === 'outcome') {
            return false
          }
          return true
        },
        /**
         * 子流程
         */
        loadDataSubprocesses: parameter => {
          return getHistoricSubprocessInstances(this.record.id)
            .then(res => {
              if (res.code === 10000) {
                return res.result.data
              }
            })
        },
        /**
         * jobs
         */
        loadDataJobs: parameter => {
          return getJobs(this.record.id)
            .then(res => {
              if (res.code === 10000) {
                return res.result.data
              }
            })
        }
      }
    },
    created () {
    },
    watch: {
      record () {
        if (this.visible) {
          this.refresh()
        }
      }
    },
    methods: {
      refresh () {
        this.getDiagram()
        if (this.$refs.taskTable) {
          this.$refs.taskTable.refresh()
        }
        if (this.$refs.variableTable) {
          this.$refs.variableTable.refresh()
        }
        if (this.$refs.subprocessTable) {
          this.$refs.subprocessTable.refresh()
        }
        if (this.$refs.loadDataJobs) {
          this.$refs.loadDataJobs.refresh()
        }
      },
      /**
       * 图表
       */
      getDiagram () {
        getProcessInstanceDiagram(this.record.id).then(
          res => {
            if (res.code === 10000) {
              this.bpmnXml = res.result.bpmnXml
              this.activeNodes = res.result.activeNodes
            }
          }
        )
      },
      show () {
        this.visible = true
      },
      onClose () {
        this.visible = false
      }
    }
  }
</script>

<style lang="less" scoped>
/deep/ .formTable{
    max-width: 400px;
}
</style>
