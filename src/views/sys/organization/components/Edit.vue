<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-6"
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
            label="上级机构"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-tree-select
              showSearch
              allowClear
              treeDefaultExpandAll
              :treeData="treeData"
              :filterTreeNode="filterTreeNode"
              v-decorator="['supId',{initialValue: record.supId,rules:[]}]"
              placeholder="请选择上级机构">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="机构名称"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['name',{initialValue: record.name,rules:[{required: true, message: '机构名称不能为空'}]}]"
              placeholder="请输入机构名称"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="机构编码"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['code',{initialValue: record.code,rules:[{required: true, message: '机构编码不能为空'},{validator:validatorCheckCode}]}]"
              placeholder="请输入机构编码"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="机构类型"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select
              :options="orgType"
              v-decorator="['orgType',{initialValue: record.orgType,rules:[{required: true, message: '机构类型不能为空'}]}]"
              placeholder="请选择机构类型"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="负责人"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select :options="managerUsers" v-decorator="['principalCode',{initialValue: record.principalCode,rules:[]}]" placeholder="请选择负责人"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="手机号"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['mobileNum',{initialValue: record.mobileNum,rules:[{pattern:/^1\d{10}$/,message:'请输入正确格式的手机号'}]}]"
              placeholder="请输入手机号"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="归属区域"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-cascader
              allowClear
              changeOnSelect
              :options="optionsArea"
              v-decorator="['srcAreaId',{initialValue: record.srcAreaId,rules:[]}]"
              :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
              placeholder="请选择归属区域"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="详细地址"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['address',{initialValue: record.address}]"
              placeholder="请输入详细地址"/>
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
        <a-button v-authorize:SYS_ORGANIZATION_UPDATE @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'OrganizationEdit',
  props: {
    checkCode: {
      type: Function,
      default: undefined
    },
    optionsArea: {
      type: Array,
      default: function () {
        return []
      }
    },
    managerUsers: {
      type: Array,
      default: function () {
        return []
      }
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
    },
    orgType: {
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
  computed: {
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
          if (values.srcAreaId && values.srcAreaId.length > 0) {
            values.srcAreaId = values.srcAreaId[values.srcAreaId.length - 1]
          } else {
            values.srcAreaId = ''
          }
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
