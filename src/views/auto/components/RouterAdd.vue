<template>
  <a-modal
    title="新增路由"
    :visible="addRouterVisible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-form
      :form="form"
    >
      <a-form-item
        label="父路由"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          :disabled="true"
          v-decorator="[
            'parentRouter',{initialValue: selectedTreeNodeKey}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="路由"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'router',
            {rules:[{required:true,message:'路由不能为空'},{pattern:/^\/.+$/,message:'请输入正确的路由地址'},{validator:validatorCheckRouter}]}
          ]"
          placeholder="请输入以/开头的路由"
        />
      </a-form-item>
      <a-form-item
        label="中文名称|标题"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'chinaValue',
            {rules:[{required:true,message:'中文不能为空'},{validator:validatorChina}]}
          ]"
          placeholder="请输入中文名称"
        />
      </a-form-item>
      <a-form-item
        label="英文名称|名称"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'engValue',
            {rules:[{required:true,message:'英文名称不能为空'},{validator:validatorEnglish}]}
          ]"
          placeholder="请输入英文名称"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'RouterAdd',
  props: {
    selectedTreeNodeKey: {
      type: String,
      default: ''
    },
    routerList: {
      type: Array,
      default: function () {
        return []
      }
    },
    isEmpty: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      addRouterVisible: false,
      confirmLoading: false
    }
  },
  methods: {
    show () {
      this.addRouterVisible = true
    },
    // 路由唯一性验证
    validatorCheckRouter (rule, value, callback) {
      const parentRouter = this.form.getFieldValue('parentRouter')
      const router = this.form.getFieldValue('router')
      const fileUrl = (parentRouter === '/' ? '' : parentRouter) + router
      if (this.findRouter(fileUrl, this.routerList)) {
        callback(new Error('路由已存在'))
      } else {
        callback()
      }
    },
    // 查找路由
    findRouter (fileUrl, routerList) {
      let existRouter = false
      for (const item in routerList) {
        if (fileUrl === routerList[item].path) {
          existRouter = true
          break
        }
        if (!this.isEmpty(routerList[item].children)) {
          existRouter = this.findRouter(fileUrl, routerList[item].children)
        }
        if (existRouter) {
          break
        }
      }
      return existRouter
    },
    // 验证中文名称
    validatorChina (rule, value, callback) {
      const han = /^[\u4e00-\u9fa5]+$/
      if (!han.test(value)) {
        callback(new Error('中文名称含有非中文字符'))
      } else {
        callback()
      }
    },
    // 验证英文名称
    validatorEnglish (rule, value, callback) {
      const han = /^[a-zA-Z]+$/
      if (!han.test(value)) {
        callback(new Error('英文名称含有非英文字符'))
      } else {
        callback()
      }
    },
    handleOk (e) {
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          values.fileUrl = (values.parentRouter === '/' ? '' : values.parentRouter) + values.router
          this.$emit('setRouter', values)
          this.handleCancel()
        } else {
          setTimeout(() => {
            this.confirmLoading = false
          }, 600)
        }
      })
    },
    handleCancel (e) {
      this.addRouterVisible = false
      this.confirmLoading = false
      this.form.resetFields()
    }
  }
}
</script>
