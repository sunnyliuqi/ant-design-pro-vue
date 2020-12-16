<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-6"
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
        <a-divider orientation="left">任务信息</a-divider>
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
      <a-divider v-if="formInfo" orientation="left">表单变量</a-divider>
      <dynamic-form :form-info="formInfo" v-if="formInfo" />
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
        <a-button @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
import { formatDate, duration, setActivitiFormDateFormat } from '@/utils/common'
import DynamicForm from '@/components/Activiti/WorkFlow/DynamicForm'
export default {
  name: 'CompleteTask',
  components: {
    DynamicForm
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
    handleSubmit (e) {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = setActivitiFormDateFormat(values, this.formInfo.fields)
          this.completeTaskForm(this.record.id, params).then(res => {
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
</style>
