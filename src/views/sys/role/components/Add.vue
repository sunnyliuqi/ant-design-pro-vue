<template>
  <a-drawer
    wrapClassName="custom-drawer"
    :maskClosable="false"
    title="新增"
    @close="onClose"
    :visible="addVisible"
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
              v-decorator="['name',{rules:[{required: true, message: '角色名称不能为空'}]}]"
              placeholder="请输入角色名称"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="状态"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select v-decorator="['status',{initialValue:'0',rules:[{required: true, message: '状态不能为空'}]}]" placeholder="请选择状态">
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
        <a-button v-authorize:SYS_ROLE_ADD @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
export default {
  name: 'RoleAdd',
  components: { ACol },
  props: {
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
    save: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      addVisible: false,
      form: this.$form.createForm(this),
      formLoading: false,
      /* 选中项 */
      checkedKeys: [],
      /* 半选中项 */
      halfCheckedKeys: []
    }
  },
  computed: {
  },
  created: function () {
  },
  methods: {
    onCheck (checkedKeys, info) {
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = info.halfCheckedKeys
    },
    show () {
      this.addVisible = true
    },
    onClose () {
      this.addVisible = false
      this.formLoading = false
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
          values.menuIds = this.renderData()
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

<style scoped>

</style>
