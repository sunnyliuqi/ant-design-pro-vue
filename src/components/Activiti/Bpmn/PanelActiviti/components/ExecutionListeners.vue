<template>
  <div>
    <a-button v-if="isEmpty(executionListeners)" icon="select" @click="handleExecutionListener">未配置执行监听器</a-button>
    <a-button icon="check" v-else @click="handleExecutionListener">{{ getSelectedExecutionListeners() }}</a-button>
    <a-drawer
      wrapClassName="custom-drawer"
      :maskClosable="false"
      title="配置执行监听器"
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
            :data-source="statsValue"
            :rowKey="(record, index)=>{return record.key}">
            <span slot="event" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.event" placeholder="请选择事件类型"/>
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
                <a @click="() => saveListener(record.key)">保存</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定取消吗?" @confirm="() => cancelListener(record.key)">
                  <a href="javascript:void(0)">取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => editListener(record.key)">编辑</a>
              </span>
              <a-divider type="vertical"/>
              <a-popconfirm title="您确认删除吗?" @confirm="handleDelete(record)" okText="确认" cancelText="取消">
                <a href="javascript:void(0)">删除</a>
              </a-popconfirm>
            </span>
            <template slot="footer">
              <a-button type="dashed" class="footer-button">新增监听器</a-button>
            </template>
            <p slot="expandedRowRender" slot-scope="record" class="table-expanded">
              <a-table
                :pagination="false"
                :columns="columnFields"
                :data-source="record.fields"
                :rowKey="(field, indexField)=>{return indexField}">
                <span slot="sequence" slot-scope="textField, recordField, indexField">
                  {{ indexField+1 }}
                </span>
                <span slot="action" slot-scope="textField, recordField">
                  <a-popconfirm title="您确认删除吗?" @confirm="handleDelete(recordField)" okText="确认" cancelText="取消">
                    <a href="javascript:void(0)">删除</a>
                  </a-popconfirm>
                </span>
                <template slot="footer">
                  <a-button type="dashed" class="footer-button">新增字段</a-button>
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
    { title: '序号', dataIndex: 'sequence', key: 'sequence', scopedSlots: { customRender: 'sequence' } },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '字符串', dataIndex: 'string', key: 'string' },
    { title: '字符串值', dataIndex: 'stringValue', key: 'stringValue' },
    { title: '表达式', dataIndex: 'expression', key: 'expression' },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'ExecutionListeners',
    inheritAttrs: false,
    model: {
      prop: 'executionListeners',
      event: 'change'
    },
    props: {
      executionListeners: {
        type: String,
        default: undefined
      }
    },
    data () {
      return {
        isEmpty,
        statsValue: undefined,
        cacheData: undefined,
        editingKey: '',
        visible: false,
        columns,
        columnFields
      }
    },
    watch: {
      executionListeners: function (newVal, oldVal) {
        this.statsValue = this.wrapperToObj(newVal)
        this.cacheData = this.statsValue.map(item => ({ ...item }))
      }
    },
    methods: {
      editListener (key) {
        const newData = [...this.statsValue]
        const target = newData.filter(item => key === item.key)[0]
        this.editingKey = key
        if (target) {
          target.editable = true
          this.statsValue = newData
        }
      },
      saveListener (key) {
        const newData = [...this.statsValue]
        const newCacheData = [...this.cacheData]
        const target = newData.filter(item => key === item.key)[0]
        const targetCache = newCacheData.filter(item => key === item.key)[0]
        if (target && targetCache) {
          delete target.editable
          this.statsValue = newData
          Object.assign(targetCache, target)
          this.cacheData = newCacheData
        }
        this.editingKey = ''
      },
      cancelListener (key) {
        const newData = [...this.statsValue]
        const target = newData.filter(item => key === item.key)[0]
        this.editingKey = ''
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
          delete target.editable
          this.statsValue = newData
        }
      },
      handleDelete (record) {
      },
      wrapperToObj (str) {
        if (!isEmpty(str)) {
          if (typeof str === 'string') {
            const obj = JSON.parse(str)
            if (obj) {
              obj.forEach(item => {
                item.key = uuid()
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
      getSelectedExecutionListeners () {
        const _executionListeners = this.executionListeners && JSON.parse(this.executionListeners)
        const eLength = _executionListeners.length
        return `已配置${eLength}个执行监听器`
      },
      handleExecutionListener () {
        this.statsValue = this.wrapperToObj(this.executionListeners)
        this.cacheData = this.statsValue.map(item => ({ ...item }))
        this.show()
      },
      handleSubmit (e) {
        this.onClose()
      },
      show () {
        this.visible = true
      },
      onClose () {
        this.visible = false
        this.$emit('change', this.unWrapperToString(this.statsValue))
        this.statsValue = undefined
        this.cacheData = undefined
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
