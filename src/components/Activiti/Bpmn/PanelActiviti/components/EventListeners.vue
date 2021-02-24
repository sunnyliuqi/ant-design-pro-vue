<template>
  <div>
    <a-button v-if="isEmpty(eventListeners)" icon="select" @click="handleEventListener">未配置事件监听器</a-button>
    <a-button icon="check" v-else @click="handleEventListener">{{ getSelectedEventListeners() }}</a-button>
    <a-drawer
      wrapClassName="custom-drawer custom-drawer-7"
      :maskClosable="false"
      title="配置事件监听器"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{ overflow: 'auto' }"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-table
            class="table-footer"
            :pagination="false"
            :columns="columns"
            :data-source="stateValue"
            :rowKey="(record, index)=>{return record.key}">
            <span slot="events" slot-scope="text, record">
              <a-select style="width: 100%" mode="multiple" v-if="record.editable" v-model="record.events" placeholder="请选择事件类型">
                <a-select-option v-for="o in eventOptions" :key="o" :value="o">
                  {{ o }}
                </a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="throwEvent" slot-scope="text, record">
              <a-select
                allowClear
                @change="(value)=>{handleChange(value, record)}"
                style="width: 100%"
                v-if="record.editable"
                v-model="record.throwEvent"
                placeholder="请选择抛出事件">
                <a-select-option v-for="o in throwEventOptions" :key="o" :value="o">
                  {{ o }}
                </a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="class" slot-scope="text, record">
              <a-input v-if="record.editable && typeof(record.throwEvent) === 'undefined'" v-model="record.class" placeholder="请输入类"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="delegateExpression" slot-scope="text, record">
              <a-input v-if="record.editable && typeof(record.throwEvent) === 'undefined'" v-model="record.delegateExpression" placeholder="请输入代理表达式"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="entityType" slot-scope="text, record">
              <a-input v-if="record.editable && typeof(record.throwEvent) === 'undefined'" v-model="record.entityType" placeholder="请输入实体类型"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="signalName" slot-scope="text, record">
              <a-input v-if="record.editable && record.throwEvent && record.throwEvent.search('ignal') !== -1" v-model="record.signalName" placeholder="请输入信息名称"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="errorCode" slot-scope="text, record">
              <a-input v-if="record.editable && record.throwEvent && record.throwEvent==='error'" v-model="record.errorCode" placeholder="请输入错误编码"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="messageName" slot-scope="text, record">
              <a-input v-if="record.editable&& record.throwEvent && record.throwEvent==='message'" v-model="record.messageName" placeholder="请输入消息名称"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="action" slot-scope="text, record">
              <span v-if="record.editable">
                <a @click="() => saveListener(record.key)">保存</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定取消吗?" @confirm="() => cancelListener(record.key)">
                  <a href="javascript:void(0)">取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => editListener(record.key)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="您确认删除吗?" @confirm="handleDeleteListener(record.key)" okText="确认" cancelText="取消">
                  <a href="javascript:void(0)">删除</a>
                </a-popconfirm>
              </span>
            </span>
            <template slot="footer">
              <a-button type="dashed" class="footer-button" @click="handleAddListener">新增监听器</a-button>
            </template>
          </a-table>
        </a-col>
      </a-row>
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
          取消
        </a-button>
        <a-button @click="handleSubmit" type="primary">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import { isEmpty, uuid } from '@/utils/common'

  const columns = [
    { title: '事件', dataIndex: 'events', key: 'events', width: 200, scopedSlots: { customRender: 'events' } },
    { title: '抛出事件', dataIndex: 'throwEvent', key: 'throwEvent', width: 150, scopedSlots: { customRender: 'throwEvent' } },
    { title: '类', dataIndex: 'class', key: 'class', scopedSlots: { customRender: 'class' } },
    { title: '代理表达式', dataIndex: 'delegateExpression', key: 'delegateExpression', scopedSlots: { customRender: 'delegateExpression' } },
    { title: '实体类型', dataIndex: 'entityType', key: 'entityType', scopedSlots: { customRender: 'entityType' } },
    { title: '信号名称', dataIndex: 'signalName', key: 'signalName', scopedSlots: { customRender: 'signalName' } },
    { title: '错误码', dataIndex: 'errorCode', key: 'errorCode', scopedSlots: { customRender: 'errorCode' } },
    { title: '消息名称', dataIndex: 'messageName', key: 'messageName', scopedSlots: { customRender: 'messageName' } },
    {
      title: '操作',
      key: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  const eventOptions = ['ACTIVITY_COMPENSATE', 'ACTIVITY_COMPLETED', 'ACTIVITY_ERROR_RECEIVED', 'ACTIVITY_MESSAGE_RECEIVED', 'ACTIVITY_SIGNALED', 'ACTIVITY_STARTED', 'ENGINE_CLOSED', 'ENGINE_CREATED', 'ENTITY_ACTIVATED', 'ENTITY_CREATED', 'ENTITY_DELETED', 'ENTITY_INITIALIZED', 'ENTITY_SUSPENDED', 'ENTITY_UPDATED', 'JOB_EXECUTION_FAILURE', 'JOB_EXECUTION_SUCCESS', 'JOB_RETRIES_DECREMENTED', 'MEMBERSHIP_CREATED', 'MEMBERSHIP_DELETED', 'MEMBERSHIPS_DELETED', 'TASK_ASSIGNED', 'TASK_COMPLETED', 'TIMER_FIRED', 'UNCAUGHT_BPMN_ERROR', 'VARIABLE_CREATED', 'VARIABLE_DELETED', 'VARIABLE_UPDATED']
  const throwEventOptions = ['error', 'message', 'signal', 'globalSignal']
  export default {
    name: 'EventListeners',
    inheritAttrs: false,
    model: {
      prop: 'eventListeners',
      event: 'change'
    },
    props: {
      eventListeners: {
        type: String,
        default: undefined
      }
    },
    data () {
      return {
        isEmpty,
        stateValue: undefined,
        cacheListener: undefined,
        editingKey: '',
        visible: false,
        columns,
        eventOptions,
        throwEventOptions
      }
    },
    watch: {
      eventListeners: function (newVal, oldVal) {
        this.stateValue = this.wrapperToObj(newVal)
      }
    },
    methods: {
      handleChange (value, record) {
        if (value) {
          record.class = undefined
          record.delegateExpression = undefined
          record.entityType = undefined
          if (value.search('ignal') !== -1) {
            record.errorCode = undefined
            record.messageName = undefined
          } else if (value === 'message') {
            record.signalName = undefined
            record.errorCode = undefined
          } else if (value === 'error') {
            record.signalName = undefined
            record.messageName = undefined
          }
        } else {
          record.signalName = undefined
          record.errorCode = undefined
          record.messageName = undefined
        }
      },
      editListener (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        this.editingKey = key
        if (target) {
          this.cacheListener = { ...target }
          target.editable = true
          this.stateValue = newData
        }
      },
      saveListener (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.stateValue = newData
          this.cacheListener = undefined
        }
        this.editingKey = ''
      },
      cancelListener (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          Object.assign(target, this.cacheListener)
          delete target.editable
          this.stateValue = newData
          this.cacheListener = undefined
        }
        this.editingKey = ''
      },
      handleDeleteListener (key) {
        const newData = [...this.stateValue]
        const targets = newData.filter(item => {
          return key !== item.key
        })
        this.stateValue = targets
      },
      handleAddListener () {
        const listener = { key: uuid(), events: 'ACTIVITY_COMPENSATE', throwEvent: undefined, signalName: undefined, errorCode: undefined, messageName: undefined, class: undefined, delegateExpression: undefined, entityType: undefined }
        let newData
        if (this.stateValue) {
          newData = [...this.stateValue]
        } else {
          newData = []
        }
        newData.push(listener)
        this.stateValue = newData
      },
      wrapperToObj (str) {
        if (!isEmpty(str)) {
          if (typeof str === 'string') {
            const obj = JSON.parse(str)
            if (obj) {
              obj.forEach(item => {
                item.key = uuid()
                if (item.fields && item.fields.length && item.fields.length > 0) {
                  item.fields = item.fields.map(childrenItem => {
                    childrenItem.key = uuid()
                    return Object.assign({}, childrenItem)
                  })
                }
              })
            }
          return obj
          }
          return str
        }
        return undefined
      },
      unWrapperToString (obj) {
        if (!isEmpty(obj)) {
          if (typeof obj === 'string') {
            return obj
          }
          obj.forEach(item => {
            item.key = undefined
          })
          return JSON.stringify(obj)
        }
        return ''
      },
      getSelectedEventListeners () {
        const _eventListeners = this.eventListeners && JSON.parse(this.eventListeners)
        const eLength = _eventListeners.length
        return `已配置${eLength}个事件监听器`
      },
      handleEventListener () {
        this.stateValue = this.wrapperToObj(this.eventListeners)
        this.show()
      },
      handleSubmit (e) {
        this.$emit('change', this.unWrapperToString(this.stateValue))
        this.onClose()
      },
      show () {
        this.visible = true
      },
      onClose () {
        this.visible = false
        this.stateValue = undefined
        this.cacheListener = undefined
        this.editingKey = ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .table-footer {
    /deep/ .ant-table-footer {
      text-align: center;
      background-color: white;
    }

    /deep/ .ant-table-footer {
      border: none;
      padding: 0px;

      .footer-button {
        width: 100%;
        height: 48px;
        margin: 0px;
        padding: 0px;
      }
    }

    /deep/ .table-expanded {
      margin: 0px;
    }
  }
</style>
