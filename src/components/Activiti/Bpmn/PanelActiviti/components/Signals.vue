<template>
  <div>
    <a-button v-if="isEmpty(signals)" icon="select" @click="handleSignals">未配置信号</a-button>
    <a-button icon="check" v-else @click="handleSignals">{{ getSelectedSignals() }}</a-button>
    <a-drawer
      wrapClassName="custom-drawer custom-drawer-7"
      :maskClosable="false"
      title="配置信号"
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
            <span slot="id" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.id" placeholder="请输入id"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="name" slot-scope="text, record">
              <a-input v-if="record.editable" v-model="record.name" placeholder="请输入名称"/>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="scop" slot-scope="text, record">
              <a-select style="width: 100%" v-if="record.editable" v-model="record.scop" placeholder="请选择范围">
                <a-select-option v-for="o in scopeOptions" :key="o" :value="o">
                  {{ o }}
                </a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </span>
            <span slot="action" slot-scope="text, record">
              <span v-if="record.editable">
                <a @click="() => saveSignal(record.key)">保存</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定取消吗?" @confirm="() => cancelSignal(record.key)">
                  <a href="javascript:void(0)">取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => editSignal(record.key)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="您确认删除吗?" @confirm="handleDeleteSignal(record.key)" okText="确认" cancelText="取消">
                  <a href="javascript:void(0)">删除</a>
                </a-popconfirm>
              </span>
            </span>
            <template slot="footer">
              <a-button type="dashed" class="footer-button" @click="handleAddSignal">新增信号</a-button>
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
    { title: 'id', dataIndex: 'id', key: 'id', scopedSlots: { customRender: 'id' } },
    { title: '名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
    { title: '范围', dataIndex: 'scop', key: 'scop', width: 150, scopedSlots: { customRender: 'scop' } },
    {
      title: '操作',
      key: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  const scopeOptions = ['Global', 'processInstance']
  export default {
    name: 'Signals',
    inheritAttrs: false,
    model: {
      prop: 'signals',
      event: 'change'
    },
    props: {
      signals: {
        type: String,
        default: undefined
      }
    },
    data () {
      return {
        isEmpty,
        stateValue: undefined,
        cacheSignal: undefined,
        editingKey: '',
        visible: false,
        columns,
        scopeOptions
      }
    },
    watch: {
      signals: function (newVal, oldVal) {
        this.stateValue = this.wrapperToObj(newVal)
      }
    },
    methods: {
      editSignal (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        this.editingKey = key
        if (target) {
          this.cacheSignal = { ...target }
          target.editable = true
          this.stateValue = newData
        }
      },
      saveSignal (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.stateValue = newData
          this.cacheSignal = undefined
        }
        this.editingKey = ''
      },
      cancelSignal (key) {
        const newData = [...this.stateValue]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          Object.assign(target, this.cacheSignal)
          delete target.editable
          this.stateValue = newData
          this.cacheSignal = undefined
        }
        this.editingKey = ''
      },
      handleDeleteSignal (key) {
        const newData = [...this.stateValue]
        const targets = newData.filter(item => {
          return key !== item.key
        })
        this.stateValue = targets
      },
      handleAddSignal () {
        const signal = { key: uuid(), id: undefined, name: undefined, scop: 'Global' }
        let newData
        if (this.stateValue) {
          newData = [...this.stateValue]
        } else {
          newData = []
        }
        newData.push(signal)
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
      getSelectedSignals () {
        const _signals = this.signals && JSON.parse(this.signals)
        const eLength = _signals.length
        return `已配置${eLength}个信号`
      },
      handleSignals () {
        this.stateValue = this.wrapperToObj(this.signals)
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
        this.cacheSignal = undefined
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
