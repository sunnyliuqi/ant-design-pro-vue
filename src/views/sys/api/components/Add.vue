<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-4"
    :maskClosable="false"
    title="新增"
    @close="onClose"
    :visible="addVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="名称"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['name',{rules:[{required: true, message: '名称不能为空'},{validator:validatorCheckName}]}]"
              placeholder="请输入名称,格式[js接口方法-菜单页面-操作]"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="路径"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              @change="refreshRequestMethod"
              v-decorator="['path',{rules:[{required: true, message: '路径不能为空'}, {pattern:/^\/.+$/,message:'请输入正确的路径'}]}]"
              placeholder="请输入以/开头的路径"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="请求方法"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select v-decorator="['requestMethod',{initialValue:'',rules:[{required: true, message: '请求方法不能为空'},{validator:validatorCheckUrl}]}]" placeholder="请选择请求方法">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PUT">PUT</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
            </a-select>
          </a-form-item>
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
        <a-button v-authorize:SYS_API_ADD @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'

export default {
  name: 'ApiAdd',
  components: { ACol },
  props: {
    checkName: {
      type: Function,
      default: undefined
    },
    checkUrl: {
      type: Function,
      default: undefined
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
    }
  },
  data () {
    return {
      addVisible: false,
      form: this.$form.createForm(this),
      formLoading: false
    }
  },
  computed: {},
  methods: {
    /* 重置请求方法 */
    refreshRequestMethod () {
      this.form.setFieldsValue({ 'requestMethod': '' })
    },
    /* 验证名称 */
    validatorCheckName (rule, value, callback) {
      const params = { 'id': this.record.id, 'name': value }
      this.checkName(params).then(res => {
        if (res.code !== 10000) {
          callback(new Error(res.msg))
        } else if (res.code === 10000 && res.result > 0) {
          callback(new Error('名称已存在'))
        }
        callback()
      })
    },
    /* 验证url */
    validatorCheckUrl (rule, value, callback) {
      const params = { 'id': this.record.id, 'path': this.form.getFieldValue('path'), 'requestMethod': this.form.getFieldValue('requestMethod') }
      this.checkUrl(params).then(res => {
        if (res.code !== 10000) {
          callback(new Error(res.msg))
        } else if (res.code === 10000 && res.result > 0) {
          callback(new Error('路径+请求方法已存在'))
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
    },
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.save(values).then(res => {
            if (res.code === 10000) {
              this.$message.info(res.msg)
              this.refresh()
              this.onClose()
            }
          }).finally(() => {
            this.formLoading = false
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

<style lang="less" scoped>

</style>
