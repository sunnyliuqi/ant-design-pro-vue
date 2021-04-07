<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-9"
    :maskClosable="false"
    title="编辑模型"
    @close="onClose"
    :visible="addVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form-model
      :model="record"
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
                  v-model="record.name"
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
                  v-model="record.modelKey"
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
                  v-model="record.description"
                  placeholder="请输入描述"
                  @blur="
                    () => {
                      $refs.description.onFieldBlur();
                    }
                  "/>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                ref="newVersion"
                prop="newVersion"
                label="新版本">
                <a-checkbox-group
                  @change="
                    () => {
                      $refs.newVersion.onFieldChange();
                    }
                  "
                  v-model="record.newVersion">
                  <a-checkbox :value="true">
                    保存为新版本可以方便回滚到历史版本
                  </a-checkbox>
                </a-checkbox-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                ref="modelComment"
                prop="modelComment"
                label="备注">
                <a-textarea
                  v-model="record.modelComment"
                  placeholder="请输入备注"
                  @blur="
                    () => {
                      $refs.modelComment.onFieldBlur();
                    }
                  "/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" tab="设计器" force-render>
          <bpmn-design
            ref="bpmnDesign"
            :xml-state="xmlState"
            :form-lists="formLists"
            :assignee-opts="assigneeOpts"
            :initiator-opts="initiatorOpts"
            :group-lists="groupLists"
            v-model="record.modelEditorJson"
            :model-key="record.modelKey"
            :model-name="record.name"
            :description="record.description"
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
        <a-button v-authorize:PROCESS_MODEL_EDIT @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
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
  description: undefined,
  newVersion: [false],
  modelComment: undefined
}
export default {
  name: 'ModelEdit',
  components: { ACol, AFormModel, AFormModelItem, BpmnDesign },
  props: {
    formLists: {
      type: Array,
      default: () => {
        return []
      }
    },
    assigneeOpts: {
      type: Array,
      default: () => {
        return []
      }
    },
    initiatorOpts: {
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
        return initForm
      }
    },
    refresh: {
      type: Function,
      default: undefined
    },
    update: {
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
      const params = { modelKey: value, id: this.record.id }
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
      xmlState: 0
    }
  },
  computed: {
  },
  methods: {
    /**
     * 新版本标识
     */
    getNewVersion (checkedValue) {
      if (checkedValue && checkedValue instanceof Array && checkedValue.length > 0) {
        return checkedValue[0]
      } else {
        return false
      }
    },
    callback (key) {
      this.customActiveKey = key
    },
    show () {
      this.addVisible = true
      this.xmlState = this.xmlState + 1
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
              const designValue = {
                id: this.record.id,
                name: this.record.name,
                modelKey: this.record.modelKey,
                description: this.record.description,
                newVersion: this.getNewVersion(this.record.newVersion),
                modelComment: this.record.modelComment,
                'base64Thumbnail': pic,
                'modelEditorJson': this.record.modelEditorJson
              }
              this.update(Object.assign({}, designValue)).then(res => {
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
