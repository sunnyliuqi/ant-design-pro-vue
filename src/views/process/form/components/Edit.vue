<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-9"
    :maskClosable="false"
    title="编辑表单"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form :form="form">
      <a-tabs :activeKey="customActiveKey" @change="callback">
        <a-tab-pane key="1" tab="基础信息">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item
                label="表单名称"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 8 }">
                <a-input
                  v-decorator="['name',{initialValue: record.name, rules:[{required: true, message: '名称不能为空'}]}]"
                  placeholder="请输入表单名称"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="key"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 8 }">
                <a-input
                  v-decorator="['modelKey',{initialValue: record.modelKey, rules:[{required: true, message: 'key不能为空'},{validator: validatorCheckKey}]}]"
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
                  v-decorator="['description',{initialValue: record.description, rules:[]}]"
                  placeholder="请输入描述"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="新版本"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 8 }">
                <a-checkbox-group @change="changeNewVersion" v-decorator="['newVersion',{initialValue: [false], rules:[]}]">
                  <a-checkbox :value="true">
                    保存为新版本可以方便回滚到历史版本
                  </a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="record.newVersion">
              <a-form-item
                label="备注"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 8 }">
                <a-textarea
                  :rows="4"
                  v-decorator="['modelComment',{rules:[]}]"
                  placeholder="请输入备注"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" tab="设计器" force-render>
          <form-design
            ref="eformDesign"
            :input-components="inputComponents"
            :select-components="selectComponents"
            :outcomes-components="outcomesComponents"
            :drawing-list="record.drawingList"
            :drawing-button-list="record.drawingButtonList"
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
import FormDesign from '@/components/Activiti/FormDesign'
export default {
  name: 'FormEdit',
  components: { ACol, FormDesign },
  props: {
    inputComponents: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectComponents: {
      type: Array,
      default: () => {
        return []
      }
    },
    outcomesComponents: {
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
    return {
      customActiveKey: '1',
      visible: false,
      form: this.$form.createForm(this),
      formLoading: false
    }
  },
  computed: {
  },
  methods: {
    /**
     * 新版本标识
     */
    changeNewVersion (checkedValue) {
      if (checkedValue && checkedValue instanceof Array && checkedValue.length > 0) {
        this.record.newVersion = checkedValue[0]
      } else {
        this.record.newVersion = false
      }
    },
    callback (key) {
      this.customActiveKey = key
    },
    validatorCheckKey (rule, value, callback) {
      const params = { modelKey: this.form.getFieldValue('modelKey'), id: this.record.id }
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
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.formLoading = false
      this.form.resetFields()
      this.customActiveKey = '1'
    },
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$refs.eformDesign.generatePicture(pic => {
            const designValue = { newVersion: this.record.newVersion, id: this.record.id, 'base64Thumbnail': pic, 'modelEditorJson': JSON.stringify([...this.record.drawingList, ...this.record.drawingButtonList]) }
            this.update(Object.assign({}, values, designValue)).then(res => {
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
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
