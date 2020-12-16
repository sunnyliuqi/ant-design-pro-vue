<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">

      <a-form-item
        label="头像"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-upload
          name="file"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadUrl"
          :beforeUpload="beforeUpload"
          @change="handleFileChange"
        >
          <img v-if="imageUrl" :src="fileDisplayPrefix+imageUrl" alt="avatar" height="104" width="104"/>
          <div v-else>
            <a-icon :type="fileLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="手机号"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'mobileNum',
            {rules: [{ pattern: /^1[0123456789]\d{9}$/, message: '请正确填写您的手机号码' }]}
          ]"
          name="mobileNum"
          placeholder="请输入手机号"/>
      </a-form-item>
      <a-form-item
        label="邮箱"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'email',
            {rules: [{ pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, message: '请正确填写您的邮箱' }]}
          ]"
          name="email"
          placeholder="请输入邮箱"/>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary" :loading="formLoading">更新</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { FILE_DISPLAY_PREFIX, parseFileRespon, UPLOAD_URL } from '@/api/upload'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserInfo',
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      fileLoading: false,
      imageUrl: '',
      formLoading: false,
      uploadUrl: UPLOAD_URL + '/files',
      fileDisplayPrefix: FILE_DISPLAY_PREFIX
    }
  },
  created: function () {
    this.loadInfo()
  },
  methods: {
    ...mapActions(['UpdateUserInfo', 'GetInfo']),
    ...mapGetters(['userInfo', 'avatar']),
    // 读取用户信息
    loadInfo () {
      this.GetInfo().then((res) => {
        if (res.code === 10000) {
          this.imageUrl = res.result.suserHeader
          this.form.setFieldsValue({
            mobileNum: res.result.smobileNum,
            email: res.result.semail
          })
        }
      })
    },
    handleFileChange (info) {
      if (info.file.status === 'uploading') {
        this.imageUrl = ''
        this.fileLoading = true
      } else if (info.file.status === 'error') {
        this.$message.error('服务器无响应，请联系管理员！')
        this.fileLoading = false
      } else if (info.file.status === 'done') {
        this.imageUrl = parseFileRespon(info.file.response)
        this.fileLoading = false
      }
    },
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('文件必须小于 2MB!')
      }
      return isLt2M
    },
    handleSubmit (e) {
      e.preventDefault()
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          values.userHeader = this.imageUrl
          this.UpdateUserInfo(values).then((res) => {
            if (res.code === 10000) {
              this.loadInfo()
              this.$message.info(res.result)
            }
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
