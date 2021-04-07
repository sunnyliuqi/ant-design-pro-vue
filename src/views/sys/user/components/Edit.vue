<template>
  <a-drawer
    wrapClassName="custom-drawer"
    :maskClosable="false"
    title="修改"
    @close="onClose"
    :visible="editVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :lg="12" :md="24">
          <a-form-item
            label="工号"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="[
                'workNum',
                {
                  initialValue: record.workNum,
                  rules: [ { required: true, message: '工号不能为空' },{validator: validatorCheckWorkNum}]
                }
              ]"
              placeholder="请输入工号"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="员工头像"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadUrl"
              :beforeUpload="beforeUpload"
              @change="handleFileChange"
            >
              <img
                v-if="record.userHeader"
                :src="fileDisplayPrefix+record.userHeader"
                alt="avatar"
                height="104"
                width="104"/>
              <div v-else>
                <a-icon :type="fileLoading ? 'loading' : 'plus'"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="用户名"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="[
                'userName',
                {
                  initialValue: record.userName,
                  rules: [ { required: true, message: '用户名不能为空' },{validator: validatorCheckUserName}]
                }
              ]"
              placeholder="请输入用户名"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="姓名"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="[
                'fullName',
                {
                  initialValue: record.fullName,
                  rules: [ { required: true, message: '姓名不能为空' }]
                }
              ]"
              placeholder="请输入姓名"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="身份证号"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['idNum',{initialValue: record.idNum,}]"
              placeholder="请输入身份证号"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="手机号"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="[
                'mobileNum',
                {
                  initialValue: record.mobileNum,
                  rules: [{ pattern: /^1[0123456789]\d{9}$/, message: '请正确填写您的手机号码' }]
                }
              ]"
              placeholder="请输入手机号"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="邮箱"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="[
                'email',
                {
                  initialValue: record.email,
                  rules: [{ pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, message: '请正确填写您的邮箱' }]
                }
              ]"
              placeholder="请输入邮箱"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="所属机构"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-tree-select
              allowClear
              showSearch
              :treeData="treeData"
              :filterTreeNode="filterTreeNode"
              v-decorator="['srcOrgId',{initialValue: record.srcOrgId,}]"
              placeholder="请选择所属机构">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="岗位"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['position',{initialValue: record.position,}]"
              placeholder="请输入岗位"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="入职时间"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-date-picker
              v-decorator="['entryTime',{ initialValue: record.entryTime ? moment(record.entryTime, 'YYYY-MM-DD'):null }]"
              placeholder="请选择入职时间"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="状态"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select v-decorator="['enabled',{ initialValue: record.enabled===true ? 'true' : 'false' }]">
              <a-select-option value="true">正常</a-select-option>
              <a-select-option value="false">冻结</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="超级管理员"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 8 }">
            <a-select @change="changRoles" v-decorator="['adminFlag',{initialValue: record.adminFlag ? record.adminFlag : 0} ]">
              <a-select-option value="0">否</a-select-option>
              <a-select-option value="1">是</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="isRoles">
          <a-form-item
            label="用户角色"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }">
            <a-checkbox-group
              :options="getRoles"
              v-decorator="['roles',{initialValue: record.roles ? record.roles: []}]"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="备注"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }">
            <a-textarea v-decorator="['remark',{initialValue: record.remark,}]" placeholder="请输入备注" :rows="4"/>
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
        <a-button v-authorize:SYS_USER_UPDATE @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'UserEdit',
  props: {
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
    checkUserName: {
      type: Function,
      default: undefined
    },
    checkWorkNum: {
      type: Function,
      default: undefined
    },
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    roles: {
      type: Array,
      default: function () {
        return []
      }
    },
    filterTreeNode: {
      type: Function,
      default: undefined
    },
    fileDisplayPrefix: {
      type: String,
      default: ''
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    parseFileRespon: {
      type: Function,
      default: undefined
    },
    moment: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      editVisible: false,
      form: this.$form.createForm(this),
      formLoading: false,
      fileLoading: false,
      isRoles: true
    }
  },
  computed: {
    getRoles: function () {
      return this.roles.map(item => {
        return { label: item.name, value: item.id }
      })
    }
  },
  methods: {
    changRoles (value, option) {
      if (value === '1') {
        this.isRoles = false
      } else {
        this.isRoles = true
      }
    },
    show () {
      this.editVisible = true
    },
    onClose () {
      this.editVisible = false
      this.form.resetFields()
    },
    validatorCheckUserName (rule, value, callback) {
      const params = { userName: this.form.getFieldValue('userName'), id: this.record.id }
      this.checkUserName(params).then(res => {
        if (res.code !== 10000) {
          callback(new Error(res.msg))
        } else if (res.code === 10000 && res.result > 0) {
          callback(new Error('用户名已存在'))
        }
        callback()
      })
    },
    validatorCheckWorkNum (rule, value, callback) {
      const params = { workNum: this.form.getFieldValue('workNum'), id: this.record.id }
      this.checkWorkNum(params).then(res => {
        if (res.code !== 10000) {
          callback(new Error(res.msg))
        } else if (res.code === 10000 && res.result > 0) {
          callback(new Error('员工号已存在'))
        }
        callback()
      })
    },
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
    handleFileChange (info) {
      if (info.file.status === 'uploading') {
        this.record.userHeader = ''
        this.fileLoading = true
      } else if (info.file.status === 'error') {
        this.$message.error('服务器无响应，请联系管理员！')
        this.fileLoading = false
      } else if (info.file.status === 'done') {
        this.record.userHeader = this.parseFileRespon(info.file.response)
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
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          values.userHeader = this.record.userHeader
          values.id = this.record.id
          this.update(values).then(res => {
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

<style scoped>

</style>
