<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-4"
    :maskClosable="false"
    title="完成任务"
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
            <a-input
              v-if="record.editable"
              v-model="record.name"
              placeholder="请输入变量名"/>
            <template v-else>
              {{ text }}
            </template>
          </span>
          <span slot="value" slot-scope="text, record">
            <a-input
              v-if="record.editable"
              v-model="record.value"
              placeholder="请输入变量值"/>
            <template v-else>
              {{ text }}
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <span v-if="record.editable">
              <a @click="() => saveVariable(record.key)">关闭编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定撤销吗?" @confirm="() => cancelVariable(record.key)">
                <a href="javascript:void(0)">撤销</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="() => editVariable(record.key)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="您确认删除吗?" @confirm="handleDeleteVariable(record.key)" okText="确认" cancelText="取消">
                <a href="javascript:void(0)">删除</a>
              </a-popconfirm>
            </span>
          </span>
          <template slot="footer">
            <a-button type="dashed" class="footer-button" @click="handleAddVariable">新增变量</a-button>
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
      <a-button v-authorize:PROCESS_TASK_COMPLETE @click="handleSubmit" type="primary" :loading="formLoading">保存
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { isEmpty, uuid } from '@/utils/common'
  const columns = [
    { title: '变量名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
    { title: '变量值', dataIndex: 'value', key: 'value', scopedSlots: { customRender: 'value' } },
    {
      title: '操作',
      key: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'Complete',
    props: {
      record: {
        type: Object,
        default: undefined
      },
      taskAction: {
        type: Function,
        default: undefined
      },
      refresh: {
        type: Function,
        default: undefined
      }
    },
    data () {
      return {
        visible: false,
        columns,
        stateValue: [],
        cacheVariable: undefined,
        editingKey: '',
        formLoading: false
      }
    },
    watch: {
      record: function (newVal, oldVal) {
        this.stateValue = []
      }
    },
    methods: {
      editVariable (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => {
          delete item.editable
          return key === item.key
        })[0]
        this.editingKey = name
        if (target) {
          this.cacheVariable = { ...target }
          target.editable = true
          this.stateValue = newData
        }
      },
      saveVariable (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.stateValue = newData
          this.cacheVariable = undefined
        }
        this.editingKey = ''
      },
      cancelVariable (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          Object.assign(target, this.cacheVariable)
          delete target.editable
          this.stateValue = newData
          this.cacheVariable = undefined
        }
        this.editingKey = ''
      },
      handleDeleteVariable (key) {
        const newData = [...this.stateValue]
        const targets = newData.filter(item => {
          return key !== item.key
        })
        this.stateValue = targets
      },
      handleAddVariable () {
        const variable = { key: uuid(), name: undefined, value: undefined, type: 'string' }
        let newData
        if (this.stateValue) {
          newData = [...this.stateValue]
        } else {
          newData = []
        }
        newData.push(variable)
        this.stateValue = newData
      },
      show () {
        this.visible = true
      },
      handleSubmit (e) {
        this.formLoading = true
        let error = false
        if (this.stateValue && this.stateValue.length > 0) {
          const _stateValue = this.stateValue
          for (let i = 0; i < this.stateValue.length; i++) {
            if (isEmpty(_stateValue[i].name)) {
              this.$message.error('存在变量名为空')
              error = true
              break
            }
          }
          if (error) {
            this.formLoading = false
            return
          }
        }
        const params = { action: 'complete', variables: this.stateValue }
        this.taskAction(this.record.id, params).then(res => {
          if (res.code === 10000) {
            this.$message.info(res.msg)
            this.onClose()
            this.refresh()
          }
        })
          .finally(() => {
            this.formLoading = false
          })
      },
      onClose (e) {
        this.visible = false
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .table-footer {
    .ant-table-footer {
      text-align: center;
      background-color: white;
    }

    .ant-table-footer {
      border: none;
      padding: 0px;

      .footer-button {
        width: 100%;
        height: 48px;
        margin: 0px;
        padding: 0px;
      }
    }

    .table-expanded {
      margin: 0px;
    }
  }
</style>
