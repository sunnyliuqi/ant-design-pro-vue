<template>
  <a-drawer
    wrapClassName="custom-drawer"
    :maskClosable="false"
    title="完成任务"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form
      :form="form"
    >
      <a-row :gutter="16">
        <a-divider orientation="left">任务</a-divider>
        <a-col :span="12">
          <span class="detail-label">任务名称</span><span class="detail-content">{{ record.name }}</span>
        </a-col>
        <a-col :span="12">
          <span class="detail-label">流程名称</span><span class="detail-content">{{ record.processDefinitionName }}</span>
        </a-col>
        <a-col :span="12">
          <span class="detail-label">BusinessKey</span><span class="detail-content">{{ record.processInstancesBusinessKey }}</span>
        </a-col>
        <a-col :span="12">
          <span class="detail-label">发起人</span><span
            class="detail-content">{{ record.processInstanceStartUserId }}</span>
        </a-col>
        <a-col :span="12">
          <span class="detail-label">启动时间</span><span class="detail-content">{{ formatDate(record.created) }}</span>
        </a-col>
        <a-col :span="12">
          <span class="detail-label">有效期</span><span class="detail-content">{{ formatDate(record.dueDate) }}</span>
        </a-col>
      </a-row>
      <a-divider v-if="formInfo" orientation="left">表单</a-divider>
      <dynamic-form :form-info="formInfo" v-if="formInfo"/>
      <a-divider orientation="left">批注</a-divider>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="审批意见"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-textarea
              :rows="4"
              v-decorator="['comment',{rules:[]}]"
              placeholder="请输入审批意见"/>
          </a-form-item>
        </a-col>
      </a-row>
      <dynamic-button :form-info="formInfo" v-if="formInfo" :close-drawer="onClose" :call-back="handleSubmit"/>
    </a-form>
  </a-drawer>
</template>

<script>
  import { formatDate, duration, setActivitiFormDateFormat } from '@/utils/common'
  import DynamicForm from '@/components/Activiti/WorkFlow/DynamicForm'
  import DynamicButton from '@/components/Activiti/WorkFlow/DynamicButton'

  export default {
    name: 'CompleteTask',
    components: {
      DynamicForm,
      DynamicButton
    },
    props: {
      getInvolvedPeople: {
        type: Function,
        default: undefined
      },
      completeTaskForm: {
        type: Function,
        default: undefined
      },
      getAssignee: {
        type: Function,
        default: undefined
      },
      refresh: {
        type: Function,
        default: undefined
      },
      formInfo: {
        type: Object,
        default: function () {
          return {}
        }
      },
      record: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        formatDate: formatDate,
        duration: duration,
        form: this.$form.createForm(this),
        visible: false,
        formLoading: false
      }
    },
    methods: {
      handleSubmit (outcome) {
        this.formLoading = true
        this.form.validateFields((err, values) => {
          if (!err) {
            const params = setActivitiFormDateFormat(values, this.formInfo.fields)
            this.completeTaskForm(this.record.id, { ...params, outcome: outcome }).then(res => {
              if (res.code === 10000) {
                this.$message.info(res.msg)
                this.onClose()
                this.refresh()
              }
            })
              .finally(() => {
                this.formLoading = false
              })
          } else {
            setTimeout(() => {
              this.formLoading = false
            }, 600)
          }
        })
      },
      show () {
        this.visible = true
      },
      onClose () {
        this.visible = false
        this.formLoading = false
        this.form.resetFields()
      }
    }
  }
</script>

<style scoped>
  /deep/ .ant-divider-horizontal .ant-divider-with-text-left {
    font-size: 14px;
  }

  /deep/ .detail-content {
    width: 66.67%;
  }

  /deep/ .detail-label {
    width: 33.33%;
  }
</style>
