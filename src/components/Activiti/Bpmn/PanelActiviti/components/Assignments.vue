<template>
  <div>
    <a-button v-if="isEmpty(assignments)" icon="select" @click="handleAssignments">未分配</a-button>
    <a-button icon="check" v-else @click="handleAssignments">{{ getSelectedAssignments() }}</a-button>
    <a-drawer
      wrapClassName="custom-drawer custom-drawer-3"
      :maskClosable="false"
      title="分配"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{ overflow: 'auto' }"
    >
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="分配类型"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 16 }">
              <a-select
                allowClear
                :options="typeOptions"
                @change="handleChangeType"
                v-decorator="['type',{initialValue: type,rules:[]}]"
                placeholder="请选择分配类型"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="type && type ==='0'">
            <a-form-item
              label="指派用户"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 16 }">
              <a-select
                allowClear
                :options="userLists"
                v-decorator="['assignee',{initialValue: stateValue && stateValue.assignee,rules:[]}]"
                placeholder="请选择用户"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="type && type==='1'">
            <a-form-item
              label="候选用户"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 16 }">
              <a-select
                mode="multiple"
                allowClear
                :options="userLists"
                v-decorator="['candidateUsers',{initialValue: getCandidateUsers,rules:[]}]"
                placeholder="请选择候选用户"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="type && type==='2'">
            <a-form-item
              label="候选组"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 16 }">
              <a-select
                mode="multiple"
                :options="groupLists"
                v-decorator="['candidateGroups',{initialValue: getCandidateGroups,rules:[]}]"
                placeholder="请选择候选组"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
  import { isEmpty } from '@/utils/common'
  const typeOptions = [{ label: '指定用户', value: '0' }, { label: '候选用户', value: '1' }, { label: '候选组', value: '2' }]
  export default {
    name: 'Assignments',
    inheritAttrs: false,
    model: {
      prop: 'assignments',
      event: 'change'
    },
    props: {
      assignments: {
        type: String,
        default: undefined
      },
      userLists: {
        type: Array,
        default: () => {
          return []
        }
      },
      groupLists: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        isEmpty,
        typeOptions,
        type: undefined,
        form: this.$form.createForm(this),
        formLoading: false,
        stateValue: undefined,
        visible: false
      }
    },
    computed: {
      getCandidateUsers () {
        const _stateValue = this.stateValue
        if (_stateValue) {
          if (_stateValue.candidateUsers && !isEmpty(_stateValue.candidateUsers)) {
            const candidateUsers = _stateValue.candidateUsers.split(',')
            return candidateUsers
          }
        }
        return undefined
      },
      getCandidateGroups () {
        const _stateValue = this.stateValue
        if (_stateValue) {
          if (_stateValue.candidateGroups && !isEmpty(_stateValue.candidateGroups)) {
            const candidateGroups = _stateValue.candidateGroups.split(',')
            return candidateGroups
          }
        }
        return undefined
      }
    },
    watch: {
      assignments: function (newVal, oldVal) {
        this.stateValue = this.wrapperToObj(newVal)
        this.type = this.getTypeValue()
      }
    },
    methods: {
      handleChangeType (v, a) {
        this.type = v
      },
      getTypeValue () {
        const _stateValue = this.stateValue
        let _type
        if (_stateValue) {
          if (_stateValue.assignee) {
            _type = '0'
          } else if (_stateValue.candidateUsers) {
            _type = '1'
          } else if (_stateValue.candidateGroups) {
            _type = '2'
          }
        }
        return _type
      },
      wrapperToObj (str) {
        if (!isEmpty(str)) {
          if (typeof str === 'string') {
            return JSON.parse(str)
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
          return JSON.stringify(obj)
        }
        return ''
      },
      getSelectedAssignments () {
        return `查看指派`
      },
      handleAssignments () {
        this.stateValue = this.wrapperToObj(this.assignments)
        this.type = this.getTypeValue()
        this.show()
      },
      handleSubmit (e) {
        this.formLoading = true
        this.form.validateFields((err, values) => {
          if (!err) {
            const _type = this.type
            if (_type) {
              let result
              if (_type === '2') {
                result = { candidateGroups: values.candidateGroups && values.candidateGroups.toString() }
              } else if (_type === '1') {
                result = { candidateUsers: values.candidateUsers && values.candidateUsers.toString() }
              } else {
                result = { assignee: values.assignee }
              }
              this.$emit('change', this.unWrapperToString(result))
            }
            this.onClose()
          } else {
            setTimeout(() => {
              this.formLoading = false
            }, 1000)
          }
        })
      },
      show () {
        this.stateValue = this.wrapperToObj(this.assignments)
        this.visible = true
      },
      onClose () {
        this.visible = false
        this.formLoading = false
        this.stateValue = undefined
        this.form.resetFields()
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
