<template>
  <div>
    <a-button v-if="isEmpty(taskListeners)" icon="select" @click="handleTaskListener">未配置任务监听器</a-button>
    <a-button icon="check" v-else @click="handleTaskListener">{{ getSelectedTaskListeners() }}</a-button>
    <a-drawer
      wrapClassName="custom-drawer custom-drawer-7"
      :maskClosable="false"
      title="配置任务监听器"
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
            <span slot="event" slot-scope="text, record">
              <a-select v-if="record.editable" v-model="record.event" placeholder="请选择事件类型">
                <a-select-option value="start">
                  start
                </a-select-option>
                <a-select-option value="end">
                  end
                </a-select-option>
                <a-select-option value="take">
                  take
                </a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="class" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.class" placeholder="请输入类"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="expression" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.expression" placeholder="请输入表达式"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="delegateExpression" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.delegateExpression" placeholder="请输入代理表达式"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="action" slot-scope="text, record">
              <span v-if="record.editable">
                <a @click="() => saveListener(record.key)">关闭编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定撤销吗?" @confirm="() => cancelListener(record.key)">
                  <a href="javascript:void(0)">撤销</a>
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
            <p slot="expandedRowRender" slot-scope="record" class="table-expanded">
              <a-table
                :pagination="false"
                :columns="columnFields"
                :data-source="record.fields"
                :rowKey="(field, indexField)=>{return indexField}">
                <span slot="name" slot-scope="textField, recordField">
                  <a-input v-if="recordField.editable" v-model="recordField.name" placeholder="请输入字段名称"/>
                  <template v-else>
                    {{ textField }}
                  </template>
                </span>
                <span slot="string" slot-scope="textField, recordField">
                  <a-input v-if="recordField.editable" v-model="recordField.string" placeholder="请输入字符串"/>
                  <template v-else>
                    {{ textField }}
                  </template>
                </span>
                <span slot="stringValue" slot-scope="textField, recordField">
                  <a-input v-if="recordField.editable" v-model="recordField.stringValue" placeholder="请输入字符串值"/>
                  <template v-else>
                    {{ textField }}
                  </template>
                </span>
                <span slot="expression" slot-scope="textField, recordField">
                  <a-input v-if="recordField.editable" v-model="recordField.expression" placeholder="请输入表达式"/>
                  <template v-else>
                    {{ textField }}
                  </template>
                </span>
                <span slot="action" slot-scope="textField, recordField">
                  <span v-if="recordField.editable">
                    <a @click="() => saveField(record.key, recordField.key)">关闭编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定撤销吗?" @confirm="() => cancelField(record.key, recordField.key)">
                      <a href="javascript:void(0)">撤销</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a @click="() => editField(record.key, recordField.key)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="您确认删除吗?" @confirm="handleDeleteField(record.key, recordField.key)" okText="确认" cancelText="取消">
                      <a href="javascript:void(0)">删除</a>
                    </a-popconfirm>
                  </span>
                </span>
                <template slot="footer">
                  <a-button type="dashed" class="footer-button" @click="handleAddField(record.key)">新增字段</a-button>
                </template>
              </a-table>
            </p>
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
    { title: '事件', dataIndex: 'event', key: 'event', scopedSlots: { customRender: 'event' } },
    { title: '类', dataIndex: 'class', key: 'class', scopedSlots: { customRender: 'class' } },
    { title: '表达式', dataIndex: 'expression', key: 'expression', scopedSlots: { customRender: 'expression' } },
    { title: '代理表达式', dataIndex: 'delegateExpression', key: 'delegateExpression', scopedSlots: { customRender: 'delegateExpression' } },
    {
      title: '操作',
      key: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  const columnFields = [
    { title: '名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
    { title: '字符串', dataIndex: 'string', key: 'string', scopedSlots: { customRender: 'string' } },
    { title: '字符串值', dataIndex: 'stringValue', key: 'stringValue', scopedSlots: { customRender: 'stringValue' } },
    { title: '表达式', dataIndex: 'expression', key: 'expression', scopedSlots: { customRender: 'expression' } },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'TaskListeners',
    inheritAttrs: false,
    model: {
      prop: 'taskListeners',
      event: 'change'
    },
    props: {
      taskListeners: {
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
        cacheField: undefined,
        editingFieldKey: '',
        visible: false,
        columns,
        columnFields
      }
    },
    watch: {
      taskListeners: function (newVal, oldVal) {
        this.stateValue = this.wrapperToObj(newVal)
      }
    },
    methods: {
      editListener (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => {
          delete item.editable
          return key === item.key
        })[0]
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
        const listener = { key: uuid(), event: 'start', class: undefined, expression: undefined, delegateExpression: undefined }
        let newData
        if (this.stateValue) {
          newData = [...this.stateValue]
        } else {
          newData = []
        }
        newData.push(listener)
        this.stateValue = newData
      },
      editField (parentKey, key) {
        const newData = [...this.stateValue]
        const targetListener = newData.filter(item => parentKey === item.key)[0]
        if (targetListener && targetListener.fields && targetListener.fields.length && targetListener.fields.length > 0) {
          const target = targetListener.fields.filter(item => {
            delete item.editable
            return key === item.key
          })[0]
          this.editingFieldKey = key
          if (target) {
            this.cacheField = { ...target }
            target.editable = true
            this.stateValue = newData
          }
        }
      },
      saveField (parentKey, key) {
        const newData = [...this.stateValue]
        const targetListener = newData.filter(item => parentKey === item.key)[0]
        if (targetListener && targetListener.fields && targetListener.fields.length && targetListener.fields.length > 0) {
          const target = targetListener.fields.filter(item => key === item.key)[0]
          if (target) {
            delete target.editable
            this.stateValue = newData
            this.cacheField = undefined
          }
          this.editingFieldKey = ''
        }
      },
      cancelField (parentKey, key) {
        const newData = [...this.stateValue]
        const targetListener = newData.filter(item => parentKey === item.key)[0]
        if (targetListener && targetListener.fields && targetListener.fields.length && targetListener.fields.length > 0) {
          const target = targetListener.fields.filter(item => key === item.key)[0]
          if (target) {
            Object.assign(target, this.cacheField)
            delete target.editable
            this.stateValue = newData
            this.cacheField = undefined
          }
          this.editingFieldKey = ''
        }
      },
      handleDeleteField (parentKey, key) {
        const newData = [...this.stateValue]
        const targetListener = newData.filter(item => parentKey === item.key)[0]
        if (targetListener && targetListener.fields && targetListener.fields.length && targetListener.fields.length > 0) {
          const targets = targetListener.fields.filter(item => key !== item.key)
          targetListener.fields = targets
        }
        this.stateValue = newData
      },
      handleAddField (parentKey) {
        const targetListener = this.stateValue.filter(item => parentKey === item.key)[0]
        if (targetListener) {
          const field = { key: uuid(), name: undefined, string: undefined, stringValue: undefined, expression: undefined }
          let newData
          if (targetListener.fields) {
            newData = [...targetListener.fields]
          } else {
            newData = []
          }
          newData.push(field)
          this.stateValue.forEach(item => {
            if (parentKey === item.key) {
              item.fields = newData
            }
          })
          this.stateValue = [...this.stateValue]
        }
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
      getSelectedTaskListeners () {
        const _taskListeners = this.taskListeners && JSON.parse(this.taskListeners)
        const eLength = _taskListeners.length
        return `已配置${eLength}个任务监听器`
      },
      handleTaskListener () {
        this.stateValue = this.wrapperToObj(this.taskListeners)
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
        this.cacheField = undefined
        this.editingKey = ''
        this.editingFieldKey = ''
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
