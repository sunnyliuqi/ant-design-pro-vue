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
            label="上级区域"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-tree-select
              showSearch
              allowClear
              :disabled="record.disabled"
              :treeData="treeData"
              :filterTreeNode="filterTreeNode"
              v-decorator="['supId',{initialValue: record.supId,rules:[]}]"
              placeholder="请选择上级区域">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="名称"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['name',{initialValue: record.name,rules:[{required: true, message: '名称不能为空'}]}]"
              placeholder="请输入名称"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="编码"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['code',{initialValue: record.code,rules:[{required: true, message: '编码不能为空'},{validator:validatorCheckCode}]}]"
              placeholder="请输入编码"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="备注"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['remark',{initialValue: record.remark}]"
              placeholder="请输入备注"/>
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
        <a-button v-authorize:SYS_AREA_UPDATE @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'AreaEdit',
  props: {
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    checkCode: {
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
    update: {
      type: Function,
      default: undefined
    },
    areaType: {
      type: Array,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      editVisible: false,
      form: this.$form.createForm(this),
      formLoading: false
    }
  },
  watch: {
    record () {
      this.setDisSelectabled(this.treeData)
    }
  },
  methods: {
    /* 不可选设置 */
    setDisSelectabled (array) {
      array.forEach(item => {
        if (item.value === this.record.id || (item.supIds && item.supIds.split(',').includes(this.record.id))) {
          item.selectable = false
        }
        if (item.children && item.children.length > 0) {
          this.setDisSelectabled(item.children)
        }
      })
    },
    validatorCheckCode (rule, value, callback) {
      const params = { 'id': this.record.id, 'code': value }
      this.checkCode(params).then(res => {
        if (res.code !== 10000) {
          callback(new Error(res.msg))
        } else if (res.code === 10000 && res.result > 0) {
          callback(new Error('编码已经存在'))
        } else {
          callback()
        }
      })
    },
    /* 树查询 */
    filterTreeNode (inputValue, treeNode) {
      return treeNode.data.props.title.indexOf(inputValue) > -1
    },
    show () {
      this.editVisible = true
    },
    onClose () {
      this.editVisible = false
      this.form.resetFields()
    },
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
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
