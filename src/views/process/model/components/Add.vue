<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-9"
    :maskClosable="false"
    title="新增模型"
    @close="onClose"
    :visible="addVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form :form="form">
      <a-tabs :activeKey="customActiveKey" @change="callback">
        <a-tab-pane key="1" tab="基础信息">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item
                label="模型名称"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 8 }">
                <a-input
                  v-decorator="['name',{rules:[{required: true, message: '模型不能为空'}]}]"
                  placeholder="请输入模型名称"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="key"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 8 }">
                <a-input
                  v-decorator="['modelKey',{rules:[{required: true, message: 'key不能为空'},{validator: validatorCheckKey}]}]"
                  placeholder="请输入key"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="描述"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 8 }">
                <a-textarea
                  :rows="4"
                  v-decorator="['description',{rules:[]}]"
                  placeholder="请输入描述"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" tab="设计器" force-render>
          <bpmn-design
            ref="bpmnDesign"
            :form-lists="formLists"
            :user-lists="userLists"
            :group-lists="groupLists"
            v-model="xml"
            :model-key="modelKey"
            :model-name="modelName"
            :description="description"
          />
        </a-tab-pane>
      </a-tabs>
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
import ACol from 'ant-design-vue/es/grid/Col'
import BpmnDesign from '@/components/Activiti/Bpmn'
export default {
  name: 'ModelAdd',
  components: { ACol, BpmnDesign },
  props: {
    formLists: {
      type: Array,
      default: () => {
        return []
      }
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
    },
    record: {
      type: Object,
      default: function () {
        return {}
      }
    },
    refresh: {
      type: Function,
      default: undefined
    },
    save: {
      type: Function,
      default: undefined
    },
    checkKey: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      customActiveKey: '1',
      addVisible: false,
      form: this.$form.createForm(this),
      formLoading: false,
      xml: undefined,
      modelKey: undefined,
      modelName: undefined,
      description: undefined
    }
  },
  computed: {
  },
  methods: {
    callback (key) {
      this.customActiveKey = key
    },
    validatorCheckKey (rule, value, callback) {
      const params = { modelKey: this.form.getFieldValue('modelKey') }
      this.checkKey(params).then(res => {
        if (res.code !== 10000) {
          callback(new Error(res.msg))
        } else if (res.code === 10000 && res.result > 0) {
          callback(new Error('key已存在'))
        }
        callback()
      })
    },
    show () {
      this.addVisible = true
    },
    onClose () {
      this.addVisible = false
      this.formLoading = false
      this.form.resetFields()
      this.customActiveKey = '1'
    },
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          /* this.$refs.bpmnDesign.generatePicture(pic => {
            const designValue = { 'base64Thumbnail': pic }
            this.save(Object.assign({}, designValue, values)).then(res => {
              if (res.code === 10000) {
                this.$message.info(res.msg)
                this.refresh()
                this.onClose()
              }
            }).finally(() => {
              this.formLoading = false
            })
          }) */
        } else {
          setTimeout(() => {
            this.formLoading = false
          }, 1000)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
