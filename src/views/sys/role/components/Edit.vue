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
            label="角色名称"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['name',{initialValue: record.name,rules:[{required: true, message: '角色名称不能为空'}]}]"
              placeholder="请输入角色名称"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="状态"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select
              v-decorator="['status',{initialValue: record.status,rules:[{required: true, message: '状态,0禁用，1启用不能为空'}]}]"
              placeholder="请选择状态">
              <a-select-option value="0">禁用</a-select-option>
              <a-select-option value="1">启用</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="菜单"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-tree
              v-decorator="['menus',{}]"
              checkable
              @check="onCheck"
              :checkedKeys="checkedKeys"
              :treeData="treeData"
            />
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
        <a-button v-authorize:SYS_ROLE_UPDATE @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'RoleEdit',
  props: {
    getRoleMenus: {
      type: Function,
      default: undefined
    },
    treeData: {
      type: Array,
      default: function () {
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
    }
  },
  data () {
    return {
      editVisible: false,
      form: this.$form.createForm(this),
      formLoading: false,
      /* 选中项 */
      checkedKeys: [],
      /* 半选中项 */
      halfCheckedKeys: []
    }
  },
  computed: {},
  watch: {
    record () {
      if (this.record.id) {
        this.getRoleMenus(this.record).then(res => {
          if (res.code === 10000) {
            if (res.result.menuAndOperationIds) {
              this.checkedKeys = res.result.menuAndOperationIds
            }
            if (res.result.supMenuIds) {
              this.halfCheckedKeys = res.result.supMenuIds
            }
          }
        })
      }
    }
  },
  methods: {
    onCheck (checkedKeys, info) {
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = info.halfCheckedKeys
    },
    show () {
      this.editVisible = true
    },
    onClose () {
      this.editVisible = false
      this.form.resetFields()
      this.checkedKeys = []
      this.halfCheckedKeys = []
    },
    renderData () {
      return [...this.checkedKeys, ...this.halfCheckedKeys].filter(item => item !== '-1')
    },
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.record.id
          values.menuIds = this.renderData()
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
