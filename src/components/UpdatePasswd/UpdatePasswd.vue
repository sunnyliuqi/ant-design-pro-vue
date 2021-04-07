<template>
  <a-modal
    title="修改密码"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-form
      :form="form"
    >
      <a-form-item
        label="原密码"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          type="password"
          v-decorator="[
            'oldPassword',
            {rules: [{ required: true, message: '原密码不能为空!' }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="新密码"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          type="password"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '新密码不能为空!' },
                     { min: 6, message: '新密码长度最小6位' },
                     { validator: handlePasswordCheck }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          type="password"
          v-decorator="[
            'repassword',
            {rules: [{ required: true, message: '确认密码不能为空!' },
                     { min: 6, message: '确认密码长度最小6位' },
                     {validator:handlePasswordCheck}]}
          ]"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12, offset: 5 }"
      >
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    ...mapActions(['UpdPasswd', 'Logout']),
    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
        return
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
        return
      }
      callback()
    },
    show () {
      this.visible = true
    },
    handleOk (e) {
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = { ...values }
          this.UpdPasswd(params).then((res) => {
            if (res.code === 10000) {
              this.$message.info(res.result + ' 请重新登录')
              this.visible = false
              this.Logout().then(() => {
                this.$router.push('/user/login')
              })
            }
          })
            .finally(() => {
              this.confirmLoading = false
            })
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
