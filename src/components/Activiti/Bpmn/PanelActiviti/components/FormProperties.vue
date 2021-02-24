<template>
  <div>
    <a-button v-if="isEmpty(formProperties)" icon="select" @click="handleFormProperties">未配置表单属性</a-button>
    <a-button icon="check" v-else @click="handleFormProperties">{{ getSelectedFormProperties() }}</a-button>
    <a-drawer
      wrapClassName="custom-drawer custom-drawer-7"
      :maskClosable="false"
      title="配置表单属性"
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
              <a-input v-if="record.editable" v-model="record.name" placeholder="请输入名称"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="type" slot-scope="text, record">
              <a-select
                @change="(value)=>{handleChange(value, record)}"
                style="width: 100%"
                v-if="record.editable"
                v-model="record.type"
                placeholder="请选择类型">
                <a-select-option v-for="o in typeOptions" :key="o" :value="o">
                  {{ o }}
                </a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="datePattern" slot-scope="text, record">
              <a-input v-if="record.editable && record.type==='date'" v-model="record.datePattern" placeholder="请输入日期格式"/>
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
            <span slot="variable" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.variable" placeholder="请输入变量"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="default" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.default" placeholder="请输入默认值"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="required" slot-scope="text, record">
              <a-select v-if="record.editable" v-model="record.required" placeholder="请设置是否必填">
                <a-select-option value="false">
                  否
                </a-select-option>
                <a-select-option value="true">
                  是
                </a-select-option>
              </a-select>
              <template v-else>
                {{ text==='true'?'是':'否' }}
              </template>
            </span>
            <span slot="action" slot-scope="text, record">
              <span v-if="record.editable">
                <a @click="() => saveFormProperty(record.key)">关闭编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定撤销吗?" @confirm="() => cancelFormProperty(record.key)">
                  <a href="javascript:void(0)">撤销</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => editFormProperty(record.key)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="您确认删除吗?" @confirm="handleDeleteFormProperty(record.key)" okText="确认" cancelText="取消">
                  <a href="javascript:void(0)">删除</a>
                </a-popconfirm>
              </span>
            </span>
            <template slot="footer">
              <a-button type="dashed" class="footer-button" @click="handleAddFormProperty">新增表单属性</a-button>
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
    { title: '类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
    { title: '是否必填', dataIndex: 'required', key: 'required', scopedSlots: { customRender: 'required' } },
    { title: '日期格式', dataIndex: 'datePattern', key: 'datePattern', scopedSlots: { customRender: 'datePattern' } },
    { title: '默认值', dataIndex: 'default', key: 'default', scopedSlots: { customRender: 'default' } },
    { title: '表达式', dataIndex: 'expression', key: 'expression', scopedSlots: { customRender: 'expression' } },
    { title: '变量', dataIndex: 'variable', key: 'variable', scopedSlots: { customRender: 'variable' } },
    {
      title: '操作',
      key: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  const typeOptions = ['string', 'long', 'boolean', 'date']
  export default {
    name: 'FormProperties',
    inheritAttrs: false,
    model: {
      prop: 'formProperties',
      event: 'change'
    },
    props: {
      formProperties: {
        type: String,
        default: undefined
      }
    },
    data () {
      return {
        isEmpty,
        stateValue: undefined,
        cacheFormProperty: undefined,
        editingKey: '',
        visible: false,
        columns,
        typeOptions
      }
    },
    watch: {
      formProperties: function (newVal, oldVal) {
        this.stateValue = this.wrapperToObj(newVal)
      }
    },
    methods: {
      handleChange (value, record) {
        if (value && value !== 'date') {
          record.datePattern = undefined
        }
      },
      editFormProperty (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => {
          delete item.editable
          return key === item.key
        })[0]
        this.editingKey = key
        if (target) {
          this.cacheProperty = { ...target }
          target.editable = true
          this.stateValue = newData
        }
      },
      saveFormProperty (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.stateValue = newData
          this.cacheProperty = undefined
        }
        this.editingKey = ''
      },
      cancelFormProperty (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          Object.assign(target, this.cacheProperty)
          delete target.editable
          this.stateValue = newData
          this.cacheProperty = undefined
        }
        this.editingKey = ''
      },
      handleDeleteFormProperty (key) {
        const newData = [...this.stateValue]
        const targets = newData.filter(item => {
          return key !== item.key
        })
        this.stateValue = targets
      },
      handleAddFormProperty () {
        const id = uuid()
        const property = { key: id, id: id, name: undefined, type: 'string', required: 'false', readable: 'true', writable: 'true', datePattern: undefined, default: undefined, expression: undefined, variable: undefined }
        let newData
        if (this.stateValue) {
          newData = [...this.stateValue]
        } else {
          newData = []
        }
        newData.push(property)
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
      getSelectedFormProperties () {
        const _formProperties = this.formProperties && JSON.parse(this.formProperties)
        const eLength = _formProperties.length
        return `已配置${eLength}个表单字段`
      },
      handleFormProperties () {
        this.stateValue = this.wrapperToObj(this.formProperties)
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
        this.cacheProperty = undefined
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
