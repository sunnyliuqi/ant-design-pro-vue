<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-7"
    :maskClosable="false"
    :title="title"
    @close="onClose"
    :visible="editVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :lg="12" :md="24">
          <a-form-item
            label="上级菜单"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-tree-select
              showSearch
              treeDefaultExpandAll
              @change="supChange"
              :disabled="record.disabled"
              :treeData="menuTreeData"
              :filterTreeNode="filterTreeNode"
              v-decorator="['supId',{initialValue: record.supId || undefined,rules:[{required:true, message:'上级菜单不能为空'}]}]"
              placeholder="请选择上级菜单">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="菜单名称"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['name',{initialValue: record.name,rules:[{required: true, message: '菜单名称不能为空'}]}]"
              placeholder="请输入菜单名称"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="URL"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['url',{initialValue: record.url, rules:[{required: true, message: 'URL不能为空'}, {pattern:/^\/.+$/,message:'请输入正确的URL'}, {validator:validatorUrl}]}]"
              :placeholder="getPlaceHolder"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24" v-if="proxyUrlFlag===true">
          <a-form-item
            label="代理地址"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              v-decorator="['proxyUrl',{initialValue: record.proxyUrl, rules:[{required: true, message: '代理地址不能为空'}]}]"
              placeholder="请输入代理地址"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="排序"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input-number
              v-decorator="['sort',{initialValue: record.sort || 10000}]"
              placeholder="请输入排序"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="24">
          <a-form-item
            label="显示"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select
              v-decorator="['showFlag',{initialValue: record.showFlag,rules:[{required: true, message: '显示不能为空'}]}]"
              placeholder="请选择显示">
              <a-select-option value="1">是</a-select-option>
              <a-select-option value="0">否</a-select-option>
            </a-select>
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
        <a-col :span="24" v-if="proxyUrlFlag===false">
          <div class="table-operator" style="margin-bottom: 8px">
            <a-button type="primary" @click="addOperate()">新建操作</a-button>
          </div>
        </a-col>
        <a-col :span="24" v-if="proxyUrlFlag===false">
          <s-table
            ref="operatesTable"
            size="default"
            :rowKey="(operate) => operate.id"
            :columns="operateColumns"
            :data="loadData"
            :showPagination="false"
          >
            <span slot="operateName" slot-scope="text, recordChildren">
              <a-form-item
                :wrapperCol="{ span: 24 }">
                <a-input
                  v-decorator="[recordChildren.id+'name',{initialValue: text, rules:[{required: true,message: '操作名称不能为空'}]}]"
                  @change="e => handleChange({'name': e.target.value}, recordChildren)"
                  placeholder="请输入操作名称"/>
              </a-form-item>
            </span>
            <span class="custom-required" slot="customNameTitle">操作名称</span>
            <span slot="operateCode" slot-scope="text, recordChildren">
              <a-form-item
                :wrapperCol="{ span: 24 }">
                <a-input
                  v-decorator="[recordChildren.id,{initialValue: text,rules:[{required: true,message: '操作编码不能为空'}, {validator:validatorOperateCode}]}]"
                  @change="e => handleChange({'code': e.target.value}, recordChildren)"
                  placeholder="请输入操作编码"/>
              </a-form-item>
            </span>
            <span class="custom-required" slot="customCodeTitle">
              操作编码<a-tooltip style="margin-left: 4px">
                <template slot="title">
                  对应权限指令v-authorize:xxx、权限属性$authorize('xxx')中的xxx
                </template>
                <Icon type="question-circle"/>
              </a-tooltip>
            </span>
            <span class="custom-required" slot="customApiTitle">API</span>
            <span slot="operateApis" slot-scope="text, recordChildren">
              <a-form-item
                :wrapperCol="{ span: 24 }">
                <a-select
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  :filterOption="filterOption"
                  :options="apiList"
                  v-decorator="[recordChildren.id+'sysApis',{initialValue: recordChildren.sysApis,rules:[{required: true,message: 'API不能为空'}]}]"
                  @change=" value => handleChange({'sysApis':value}, recordChildren)"
                >
                </a-select>
              </a-form-item>
            </span>
            <span slot="operateAction" slot-scope="text, recordChildren">
              <template>
                <a-form-item
                  :wrapperCol="{ span: 24 }">
                  <a @click="handleOperateDelete(recordChildren)">删除</a>
                </a-form-item>
              </template>
            </span>
          </s-table>
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
          zIndex: 2
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose"
        >
          取消
        </a-button>
        <a-button v-authorize:SYS_MENU_EDIT @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>

    </a-form>
  </a-drawer>
</template>

<script>
  import { STable } from '@/components'
  import { isEmpty } from '@/utils/common'
  import Icon from 'ant-design-vue/es/icon'

  export default {
    name: 'MenuEdit',
    components: { STable, Icon },
    props: {
      getSupUrl: {
        type: Function,
        default: function () {
          return '/'
        }
      },
      checkCode: {
        type: Function,
        default: undefined
      },
      checkUrl: {
        type: Function,
        default: undefined
      },
      menuTreeData: {
        type: Array,
        default: function () {
          return []
        }
      },
      title: {
        type: String,
        default: '编辑'
      },
      menus: {
        type: Array,
        default: function () {
          return []
        }
      },
      loadApi: {
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
      save: {
        type: Function,
        default: undefined
      }
    },
    data () {
      return {
        proxyUrlFlag: false,
        editVisible: false,
        form: this.$form.createForm(this, { onValuesChange: this.onFieldsChange }),
        formLoading: false,
        apiList: [],
        isEmpty: isEmpty,
        operateColumns: [{
          dataIndex: 'name',
          width: '260px',
          key: 'name',
          slots: { title: 'customNameTitle' },
          scopedSlots: { customRender: 'operateName' }
        },
          {
            dataIndex: 'code',
            width: '270px',
            key: 'code',
            slots: { title: 'customCodeTitle' },
            scopedSlots: { customRender: 'operateCode' }
          },
          {
            dataIndex: 'sysApis',
            key: 'sysApis',
            width: '400px',
            slots: { title: 'customApiTitle' },
            scopedSlots: { customRender: 'operateApis' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '70px',
            scopedSlots: { customRender: 'operateAction' }
          }],
        getPlaceHolder: undefined,
        operations: [],
        loadData: parameter => {
          let operates = []
          if (!this.isEmpty(this.record) && !this.isEmpty(this.record.operations)) {
            operates = this.record.operations
          }
          return new Promise(function (resolve) {
            resolve(operates)
          }).then(
            res => {
              this.operations = res
              return this.operations
            }
          )
        }
      }
    },
    computed: {},
    created () {
      this.loadApi({}).then(res => {
        if (res.code === 10000) {
          this.apiList = res.result.map(item => {
            return { label: item.name, value: item.id }
          })
        }
      })
    },
    watch: {
      /* 当前数据变化时，刷新操作列表 */
      record: function () {
        this.refreshOperatesTable()
        this.setChangeSupMenu(this.form.getFieldValue('url'))
      }
    },
    methods: {
      /**
       * 上级菜单变化更新
       */
      setChangeSupMenu (url) {
        this.setDisSelectabled(this.menuTreeData)
        this.setProxyUrl(this.record.supId)
        this.setPlaceHolder()
        this.formatUrl(url, this.form)
      },
      /**
       * 设置地址提示语
       */
      setPlaceHolder () {
        /* url提示语 */
        const parentUrl = this.getSupUrl(this.record.supId)
        this.getPlaceHolder = `请输入以${parentUrl}开头的URL`
      },
      /**
       * 检测表单字段变化
       */
      onFieldsChange (props, fields) {
        if (fields.proxyUrl) {
          // 代理地址
          const { form } = props
          this.formatProxyUrl(fields.proxyUrl, form)
        }
        if (fields.url) {
          // url地址
          const { form } = props
          this.formatUrl(fields.url, form)
        }
      },
      /**
       * 格式化url输入框值
       */
      formatUrl (url, form) {
        if (typeof url === 'undefined') {
          setTimeout(() => {
            const formUrl = form.getFieldValue('url')
            if (!formUrl) { form.setFieldsValue({ url: url }) }
          }, 100)
          return
        }
        if (url === '') {
          setTimeout(() => {
            form.setFieldsValue({ url: undefined })
          }, 100)
          return
        }
        const _parentUrl = this.getSupUrl(this.record.supId)
        let _url = url

        function setStartUrl () {
          if (_url.length && _url.length > 0 && _url.substr(0, 1) === '/') {
            _url = _url.substr(1, _url.length)
          }
          _url = `${_parentUrl}${_url}`
        }
        if (url.length && url.length > 0 && url.length >= _parentUrl.length) {
          const urlSub = url.substr(0, _parentUrl.length)
          if (urlSub !== _parentUrl) {
            setStartUrl()
          }
        } else {
          setStartUrl()
        }
        const formUrl = form.getFieldValue('url')
        if (_url !== formUrl) {
          setTimeout(() => {
            form.setFieldsValue({ url: _url })
          }, 10)
        }
      },
      /**
       * 格式化代理地址
       */
      formatProxyUrl (proxyUrl, form) {
        const formProxyUrl = form.getFieldValue('proxyUrl')
        if (proxyUrl !== formProxyUrl) {
          let _proxyUrl = proxyUrl.replace(/(https:\/\/|http:\/\/)?(.*?\.).*?\/(.*)/, '/$3')
          if (_proxyUrl && _proxyUrl.length > 0) {
            if (_proxyUrl.substr(0, 1) !== '/') {
              _proxyUrl = `/${_proxyUrl}`
            }
            setTimeout(() => {
              form.setFieldsValue({ proxyUrl: _proxyUrl })
            }, 10)
          }
        }
      },
      /**
       * 是否显示proxyUrl输入框
       */
      setProxyUrl (value) {
        let _proxyUrlFlag = false
        this.menus.forEach(m => {
          if (m.id === value && m.reportFlag === '1') {
            _proxyUrlFlag = true
          }
        })
        this.proxyUrlFlag = _proxyUrlFlag
      },
      /**
       * 上级菜单值变化
       */
      supChange (value) {
        this.record.supId = value
        this.setChangeSupMenu('')
      },
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
      /* 验证操作编码 */
      validatorOperateCode (rule, value, callback) {
        const index = this.operations.filter(item => item.code === value)
        if (index.length > 1) {
          callback(new Error('操作编码已经存在当前页面'))
        } else {
          const params = { 'code': value, 'id': rule.field }
          this.checkCode(params).then(res => {
            if (res.code !== 10000) {
              callback(new Error(res.msg))
            } else if (res.code === 10000 && res.result > 0) {
              callback(new Error('操作编码已经存在'))
            }
            callback()
          })
        }
      },
      /* 验证url */
      validatorUrl (rule, value, callback) {
        const params = { 'url': value, 'id': this.record.id }
        this.checkUrl(params).then(res => {
          if (res.code !== 10000) {
            callback(new Error(res.msg))
          } else if (res.code === 10000 && res.result > 0) {
            callback(new Error('url已存在'))
          }
          callback()
        })
      },
      /* api多选下拉框 筛选 */
      filterOption (input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      /* 新增操作 */
      addOperate () {
        const newOperate = {
          'id': `PAGE_ID${Math.random()}`,
          'code': '',
          'name': '',
          'menuId': this.record.id,
          'sysApis': []
        }
        this.operations.push(newOperate)
      },
      // 操作列信息值更新
      handleChange (valueObj, recordChildren) {
        const target = this.operations.filter(item => item.id === recordChildren.id)[0]
        if (!this.isEmpty(target)) {
          Object.assign(target, valueObj)
        }
      },
      /* 操作删除 */
      handleOperateDelete (obj) {
        const index = this.operations.findIndex(item => item.id === obj.id)
        if (index > -1) {
          this.operations.splice(index, 1)
        }
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
      /* 刷新操作列表 */
      refreshOperatesTable () {
        if (this.$refs.operatesTable) {
          this.$refs.operatesTable.refresh()
        }
      },
      handleSubmit () {
        this.formLoading = true
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.proxyUrlFlag === false) {
              values.proxyUrl = ''
              values.operations = this.operations
            }
            values.id = this.record.id
            if (!values.id) {
              this.save(values).then(res => {
                  if (res.code === 10000) {
                    this.$message.info(res.msg)
                    this.refresh()
                    this.onClose()
                  }
                }
              ).finally(
                () => {
                  this.formLoading = false
                }
              )
            } else {
              this.update(values).then(res => {
                if (res.code === 10000) {
                  this.$message.info(res.msg)
                  this.refresh()
                  this.onClose()
                }
              }).finally(() => {
                this.formLoading = false
              })
            }
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
  /*穿透重置表格里面单元格高度*/
  /deep/ .ant-table-tbody tr td {
    padding: 16px 16px 0 16px;
  }
</style>
