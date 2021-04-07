<template>
  <div>
    <a-button v-if="isEmpty(fields)" icon="select" @click="handleField">未配置字段</a-button>
    <a-button icon="check" v-else @click="handleField">{{ getSelectedFields() }}</a-button>
    <a-drawer
      wrapClassName="custom-drawer custom-drawer-7"
      :maskClosable="false"
      title="配置字段"
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
            <span slot="name" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.name" placeholder="请输入字段名称"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="string" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.string" placeholder="请输入字符串"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="stringValue" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.stringValue" placeholder="请输入字符串值"/>
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
            <span slot="action" slot-scope="text, record">
              <span v-if="record.editable">
                <a @click="() => saveField(record.key)">关闭编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定撤销吗?" @confirm="() => cancelField(record.key)">
                  <a href="javascript:void(0)">撤销</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => editField(record.key)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="您确认删除吗?" @confirm="handleDeleteField(record.key)" okText="确认" cancelText="取消">
                  <a href="javascript:void(0)">删除</a>
                </a-popconfirm>
              </span>
            </span>
            <template slot="footer">
              <a-button type="dashed" class="footer-button" @click="handleAddField">新增字段</a-button>
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
    name: 'Fields',
    inheritAttrs: false,
    model: {
      prop: 'fields',
      event: 'change'
    },
    props: {
      fields: {
        type: String,
        default: undefined
      }
    },
    data () {
      return {
        isEmpty,
        stateValue: undefined,
        cacheField: undefined,
        editingKey: '',
        visible: false,
        columns
      }
    },
    watch: {
      fields: function (newVal, oldVal) {
        this.stateValue = this.wrapperToObj(newVal)
      }
    },
    methods: {
      editField (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => {
          delete item.editable
          return key === item.key
        })[0]
        this.editingKey = key
        if (target) {
          this.cacheField = { ...target }
          target.editable = true
          this.stateValue = newData
        }
      },
      saveField (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.stateValue = newData
          this.cacheField = undefined
        }
        this.editingKey = ''
      },
      cancelField (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          Object.assign(target, this.cacheField)
          delete target.editable
          this.stateValue = newData
          this.cacheField = undefined
        }
        this.editingKey = ''
      },
      handleDeleteField (key) {
        const newData = [...this.stateValue]
        const targets = newData.filter(item => {
          return key !== item.key
        })
        this.stateValue = targets
      },
      handleAddField () {
        const field = { key: uuid(), name: undefined, string: undefined, stringValue: undefined, expression: undefined }
        let newData
        if (this.stateValue) {
          newData = [...this.stateValue]
        } else {
          newData = []
        }
        newData.push(field)
        this.stateValue = newData
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
      getSelectedFields () {
        const _fields = this.fields && JSON.parse(this.fields)
        const eLength = _fields.length
        return `已配置${eLength}个字段`
      },
      handleField () {
        this.stateValue = this.wrapperToObj(this.fields)
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
        this.cacheField = undefined
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
