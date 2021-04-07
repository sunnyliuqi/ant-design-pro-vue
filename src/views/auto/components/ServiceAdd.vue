<template>
  <div>
    <a-modal
      title="新增服务"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form
        :form="form"
      >
        <a-form-item
          label="服务属性名"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'serviceProName',
              {rules: [{ required: true, message: '服务属性名不能为空!' },{validator:validatorEnglish}]}
            ]"
            placeholder="请输入服务属性名"
          />
        </a-form-item>
        <a-form-item
          label="服务地址"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'serviceProAddr',
              {rules: [{ required: true, message: '服务地址名不能为空!' },{pattern:/^\/.+$/,message:'请输入正确的服务地址'}]}
            ]"
            placeholder="请输入以/开头的地址"
          />
        </a-form-item>
        <a-form-item
          :wrapper-col="{ span: 12, offset: 5 }"
        >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    // 验证英文名称
    validatorEnglish (rule, value, callback) {
      const han = /^[a-zA-Z]+$/
      if (!han.test(value)) {
        callback(new Error('服务属性名含有非英文字符'))
      } else {
        callback()
      }
    },
    handleOk (e) {
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = { ...values }
          const servicePro = { }
          servicePro[params['serviceProName']] = params['serviceProAddr']
          this.$emit('setService', servicePro)
          this.confirmLoading = false
          this.handleCancel()
        } else {
          setTimeout(() => {
            this.confirmLoading = false
          }, 600)
        }
      })
    },
    handleCancel (e) {
      this.visible = false
      this.form.resetFields()
    }
  }
}
</script>
