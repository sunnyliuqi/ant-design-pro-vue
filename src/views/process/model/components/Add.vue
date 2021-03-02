<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-9"
    :maskClosable="false"
    title="新增模型"
    @close="onClose"
    :visible="addVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form-model
      :model="form"
      ref="modelForm"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 8 }">
      <a-tabs :activeKey="customActiveKey" @change="callback">
        <a-tab-pane key="1" tab="基础信息">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item
                ref="name"
                prop="name"
                label="模型名称">
                <a-input
                  v-model="form.name"
                  placeholder="请输入模型名称"
                  @blur="
                    () => {
                      $refs.name.onFieldBlur();
                    }
                  "/>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                ref="modelKey"
                prop="modelKey"
                label="key">
                <a-input
                  v-model="form.modelKey"
                  placeholder="请输入key"
                  @blur="
                    () => {
                      $refs.modelKey.onFieldBlur();
                    }
                  "/>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                ref="description"
                prop="description"
                label="描述">
                <a-textarea
                  v-model="form.description"
                  placeholder="请输入描述"
                  @blur="
                    () => {
                      $refs.description.onFieldBlur();
                    }
                  "/>
              </a-form-model-item>
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

    </a-form-model>
  </a-drawer>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import AFormModel from 'ant-design-vue/es/form-model'
import AFormModelItem from 'ant-design-vue/es/form-model/FormItem'
import BpmnDesign from '@/components/Activiti/Bpmn'
const initForm = {
  name: undefined,
  modelKey: undefined,
  description: undefined
}
export default {
  name: 'ModelAdd',
  components: { ACol, AFormModel, AFormModelItem, BpmnDesign },
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
    const validatorCheckKey = (rule, value, callback) => {
      const params = { modelKey: value }
      this.checkKey(params).then(res => {
        if (res.code !== 10000) {
          callback(new Error(res.msg))
        } else if (res.code === 10000 && res.result > 0) {
          callback(new Error('key已存在'))
        }
        callback()
      })
    }
    return {
      customActiveKey: '1',
      addVisible: false,
      form: initForm,
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        modelKey: [
          { required: true, message: 'key不能为空', trigger: 'blur' },
          { validator: validatorCheckKey, trigger: 'blur' }
        ]
      },
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
    show () {
      this.addVisible = true
    },
    onClose () {
      this.addVisible = false
      this.formLoading = false
      this.$refs.modelForm.resetFields()
      this.customActiveKey = '1'
    },
    handleSubmit () {
      this.formLoading = true
      this.$refs.modelForm.validate(valid => {
        if (valid) {
             this.$refs.bpmnDesign.generatePicture(pic => {
              const designValue = { 'base64Thumbnail': pic }
              this.save(Object.assign({}, designValue, this.form)).then(res => {
                if (res.code === 10000) {
                  this.$message.info(res.msg)
                  this.refresh()
                  this.onClose()
                }
              }).finally(() => {
                this.formLoading = false
              })
            })
        } else {
          setTimeout(() => {
            this.formLoading = false
          }, 1000)
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
