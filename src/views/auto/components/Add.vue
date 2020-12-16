<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-9"
    :maskClosable="false"
    title="新增"
    :width="'calc(100% - 260px)'"
    @close="onClose"
    :visible="addVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="生成方式"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 10 }">
            <a-radio-group
              v-decorator="['hasPage',{
                initialValue: hasPage,
                rules: [ { required: true }]
              }]"
              @change="radioHasPage"
              buttonStyle="solid">
              <a-radio-button value="2">只生成路由</a-radio-button>
              <a-radio-button value="1">生成页面</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <keep-alive>
          <a-col :span="24" v-if="hasPage ==='1'">
            <a-form-item
              label="列表样式"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 10 }">
              <a-radio-group
                v-decorator="['tableType',{
                  initialValue: tableType
                }]"
                @change="radioTableType"
                buttonStyle="solid">
                <a-radio-button value="1">基本table</a-radio-button>
                <a-radio-button value="2">带有checkbox</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </keep-alive>
        <keep-alive>
          <a-col :span="24" v-if="hasPage ==='1'">
            <a-form-item
              label="接口服务配置"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 10 }">
              <a-select
                :options="getServiceNames"
                v-decorator="['serviceName',{
                  initialValue: `${Object.keys(serviceName)[0]}: \'${serviceName[Object.keys(serviceName)[0]]}\'`
                }]"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu"/>
                  <a-divider style="margin: 4px 0;" />
                  <div style="padding: 8px; cursor: pointer;" @mousedown="addService">
                    <a-icon type="plus" /> 增加服务
                  </div>
                </div>
              </a-select>
            </a-form-item>
          </a-col>
        </keep-alive>
        <keep-alive>
          <a-col :span="24" v-if="hasPage ==='1'">
            <a-form-item
              label="数据库表"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 10 }">
              <a-select
                :options="getTableInfos"
                @change="refreshColumn"
                v-decorator="['tableName',{
                  initialValue: tableName
                }]"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </keep-alive>
        <a-col :span="24">
          <a-form-item
            label="路由"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 10 }">
            <a-tree
              showLine
              :treeData="getTreeData"
              @select="addTreeNode"
              v-decorator="['fileUrl',{
                initialValue: routerNode.fileUrl
              }]"
            >
            </a-tree>
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="hasRouterNode">
          <a-form-item
            label="父路由"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 10 }">
            <a-input
              v-decorator="[
                'parentRouter',{initialValue: routerNode.parentRouter}
              ]"
              :disabled="true"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="hasRouterNode">
          <a-form-item
            label="路由"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 10 }">
            <a-input
              v-decorator="[
                'router',{initialValue: routerNode.router}
              ]"
              :disabled="true"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="hasRouterNode">
          <a-form-item
            label="中文名称|标题"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 10 }">
            <a-input
              v-decorator="[
                'chinaValue',{initialValue: routerNode.chinaValue}
              ]"
              :disabled="true"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="hasRouterNode">
          <a-form-item
            label="英文名称|名称"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 10 }">
            <a-input
              v-decorator="[
                'engValue',{initialValue: routerNode.engValue}
              ]"
              :disabled="true"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <add-router
        ref="routerAdd"
        :is-empty="isEmpty"
        :selected-tree-node-key="selectedTreeNodeKey"
        :router-list="routerList"
        @setRouter="setRouter"
      />
      <add-service
        ref="serviceAdd"
        @setService="setService"
      />
      <keep-alive>
        <s-table
          v-if="hasPage ==='1'"
          ref="columnInfoTable"
          size="default"
          :rowKey="(record) => record.tableColumn"
          :columns="columns"
          :data="loadData"
          :showPagination="false"
          style="margin-bottom: 64px"
        >
          <span slot="columnName" slot-scope="text, recordChildren">
            <a-input
              class="editTable"
              :value="text"
              @change="e => handleChange({'columnName': e.target.value}, recordChildren)"
            />
          </span>
          <span slot="columnLength" slot-scope="text, recordChildren">
            <a-input-number
              class="editTable"
              :min="0"
              :value="text"
              @change="value => handleChange({'columnLength':value}, recordChildren)"
            />
          </span>
          <span slot="javaType" slot-scope="text, recordChildren">
            <a-select class="editTable" :value="text" @change=" value => handleChange({'javaType':value}, recordChildren)">
              <a-select-option value="String">String</a-select-option>
              <a-select-option value="Integer">Integer</a-select-option>
              <a-select-option value="Double">Double</a-select-option>
              <a-select-option value="BigDecimal">BigDecimal</a-select-option>
              <a-select-option value="Float">Float</a-select-option>
              <a-select-option value="Date">Date</a-select-option>
            </a-select>
          </span>
          <span slot="scale" slot-scope="text, recordChildren">
            <a-input-number
              class="editTable"
              :min="0"
              :value="text"
              @change="value => handleChange({'scale':value}, recordChildren)"
            />
          </span>
          <span slot="notNullFlag" slot-scope="text, recordChildren">
            <a-checkbox
              class="editTable"
              :checked="getChecked(text)"
              @change="e => handleChange({'notNullFlag': e.target.checked}, recordChildren)"/>
          </span>
          <span slot="listFlag" slot-scope="text, recordChildren">
            <a-checkbox
              class="editTable"
              :checked="getChecked(text)"
              @change="e => handleChange({'listFlag':e.target.checked}, recordChildren)"/>
          </span>
          <span slot="queryFlag" slot-scope="text, recordChildren">
            <a-checkbox
              class="editTable"
              :checked="getChecked(text)"
              @change="e => handleQueryChange({'queryFlag':e.target.checked},undefined, recordChildren)"/>
          </span>
          <span slot="queryMode" slot-scope="text, recordChildren">
            <a-select
              class="editTable"
              style="min-width: 80px"
              :value="text"
              @change=" value => handleQueryChange(undefined,{'queryMode':value}, recordChildren)">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="=">=</a-select-option>
              <a-select-option value="like">like</a-select-option>
            </a-select>
          </span>
          <span slot="insertFlag" slot-scope="text, recordChildren">
            <a-checkbox
              class="editTable"
              :disabled="recordChildren.publicFlag === '1'"
              :checked="getChecked(text)"
              @change="e => handleChange({'insertFlag':e.target.checked}, recordChildren)"/>
          </span>
          <span slot="editFlag" slot-scope="text, recordChildren">
            <a-checkbox
              class="editTable"
              :disabled="recordChildren.publicFlag === '1'"
              :checked="getChecked(text)"
              @change="e => handleChange({'editFlag':e.target.checked}, recordChildren)"/>
          </span>
          <span slot="sort" slot-scope="text, recordChildren">
            <a-input-number
              class="editTable"
              :min="0"
              :value="text"
              @change="value => handleChange({'sort':value}, recordChildren)"
            />
          </span>
          <span slot="componentType" slot-scope="text, recordChildren">
            <a-select
              class="editTable"
              style="min-width: 80px"
              :value="text"
              @change=" value => handleChange({'componentType':value}, recordChildren)">
              <a-select-option value="Input">Input</a-select-option>
              <a-select-option value="InputNumber">InputNumber</a-select-option>
              <a-select-option value="Select">Select</a-select-option>
              <a-select-option value="DatePicker_date">Date</a-select-option>
              <a-select-option value="DatePicker_datetime">DateTime</a-select-option>
            </a-select>
          </span>
          <span slot="componentData" slot-scope="text, recordChildren">
            <a-tooltip title="数据字典填入字典类型，自定义填入格式1:one;2:two" placement="left">
              <a-input
                class="editTable"
                :value="text"
                @change="e => handleChange({'componentData': e.target.value}, recordChildren)"
              />
            </a-tooltip>
          </span>
        </s-table>
      </keep-alive>
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
        <a-button v-authorize:CODE_GENERATE_ADD @click="handleSubmit" type="primary" :loading="formLoading">保存</a-button>
      </div>
    </a-form>

  </a-drawer>
</template>

<script>
import AddRouter from './RouterAdd'
import AddService from './ServiceAdd'
import { STable } from '@/components'

export default {
  name: 'AutoAdd',
  props: {
    setService: {
      type: Function,
      default: undefined
    },
    record: {
      type: Object,
      default: function () {
        return {}
      }
    },
    serviceName: {
      type: Object,
      default: function () {
        return {}
      }
    },
    routerList: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableInfo: {
      type: Function,
      default: undefined
    },
    isEmpty: {
      type: Function,
      default: undefined
    },
    tableColumnInfo: {
      type: Function,
      default: undefined
    },
    refresh: {
      type: Function,
      default: undefined
    },
    save: {
      type: Function,
      default: undefined
    },
    createCode: {
      type: Function,
      default: undefined
    }
  },
  components: { AddRouter,
    AddService,
    STable,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    } },
  data () {
    return {
      addVisible: false,
      form: this.$form.createForm(this),
      formLoading: false,
      fileLoading: false,
      // 生成方式,默认只生成路由
      hasPage: '2',
      // 列表样式，默认基本table
      tableType: '1',
      // 数据库表数组
      tableNameList: [],
      // 路由选中的树节点
      selectedTreeNodeKey: '',
      // 是否有新增的路由
      hasRouterNode: false,
      routerNode: {},
      newRouterList: {},
      // 列表表头
      columns: [{
        title: '表字段',
        dataIndex: 'tableColumn',
        key: 'tableColumn'
      }, {
        title: '字段类型',
        dataIndex: 'columnType',
        key: 'columnType'
      }, {
        title: '字段名称',
        dataIndex: 'columnName',
        key: 'columnName',
        scopedSlots: { customRender: 'columnName' }
      }, {
        title: '字段长度',
        dataIndex: 'columnLength',
        key: 'columnLength',
        scopedSlots: { customRender: 'columnLength' }
      }, {
        title: 'java类型',
        dataIndex: 'javaType',
        key: 'javaType',
        scopedSlots: { customRender: 'javaType' }
      }, {
        title: '字段精度',
        dataIndex: 'scale',
        key: 'scale',
        scopedSlots: { customRender: 'scale' }
      }, {
        title: '不可为空',
        dataIndex: 'notNullFlag',
        key: 'notNullFlag',
        scopedSlots: { customRender: 'notNullFlag' }
      }, {
        title: '列表',
        dataIndex: 'listFlag',
        key: 'listFlag',
        scopedSlots: { customRender: 'listFlag' }
      }, {
        title: '查询',
        dataIndex: 'queryFlag',
        key: 'queryFlag',
        scopedSlots: { customRender: 'queryFlag' }
      }, {
        title: '查询方式',
        dataIndex: 'queryMode',
        key: 'queryMode',
        scopedSlots: { customRender: 'queryMode' }
      }, {
        title: '插入',
        dataIndex: 'insertFlag',
        key: 'insertFlag',
        width: 50,
        scopedSlots: { customRender: 'insertFlag' }
      }, {
        title: '编辑',
        dataIndex: 'editFlag',
        key: 'editFlag',
        scopedSlots: { customRender: 'editFlag' }
      }, {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        scopedSlots: { customRender: 'sort' }
      }, {
        title: '组件类型',
        dataIndex: 'componentType',
        key: 'componentType',
        scopedSlots: { customRender: 'componentType' }
      }, {
        title: '选项或字典值',
        dataIndex: 'componentData',
        key: 'componentData',
        scopedSlots: { customRender: 'componentData' }
      }],
      // 列表加载数据方法
      tableName: '',
      columnInfos: [],
      loadData: parameter => {
        if (this.isEmpty(this.tableName)) {
          const initData = []
          return new Promise(function (resolve) {
            resolve(initData)
          })
        } else {
          return this.tableColumnInfo(this.tableName).then(res => {
            if (res.code === 10000) {
              this.columnInfos = res.result
              this.columnInfos.forEach(item => {
                item.queryMode = this.getChecked(item.queryFlag) ? '=' : ''
                item.componentType = 'Input'
                item.componentData = ''
              })
              return this.columnInfos
            }
          })
        }
      }
    }
  },
  created () {
    this.tableInfo().then(res => {
      if (res.code === 10000) {
        this.tableNameList = res.result
      }
    })
  },
  computed: {
    // 表列表
    getTableInfos: function () {
      return this.tableNameList.map(item => {
        return { label: item.keyName, value: item.valueName }
      })
    },
    // 路由树
    getTreeData: function () {
      if (!this.isEmpty(this.routerList)) {
        this.loopRouter(this.routerList)
        return this.routerList
      }
      return []
    },
    getServiceNames: function () {
      const servicePro = this.serviceName
      const sp = ':'
      return Object.keys(servicePro).map(item => {
        return { label: `${item}${sp} '${servicePro[item]}'`, value: `${item}${sp} '${servicePro[item]}'` }
      })
    }
  },
  methods: {
    // 获取是否选中
    getChecked (value) {
      if (!this.isEmpty(value) && (value === '1' || value === true)) {
        return true
      }
      return false
    },
    // 查询级联切换
    handleQueryChange (flagObj, modeObj, recordChildren) {
      const target = this.columnInfos.filter(item => item.tableColumn === recordChildren.tableColumn)[0]
      if (!this.isEmpty(target)) {
        if (!this.isEmpty(flagObj)) {
          let queryMode = {}
          if (flagObj.queryFlag) {
            queryMode = { 'queryMode': '=' }
          } else {
            queryMode = { 'queryMode': '' }
          }
          Object.assign(target, flagObj, queryMode)
        }
        if (!this.isEmpty(modeObj)) {
          let queryFlag = {}
          if (modeObj.queryMode === '') {
            queryFlag = { 'queryFlag': '0' }
          } else {
            queryFlag = { 'queryFlag': '1' }
          }
          Object.assign(target, modeObj, queryFlag)
        }
        const tempColumnInfos = JSON.parse(JSON.stringify(this.columnInfos))
        this.columnInfos.splice(0, this.columnInfos.length, ...tempColumnInfos)
      }
    },
    // 表列信息值更新
    handleChange (valueObj, recordChildren) {
      const target = this.columnInfos.filter(item => item.tableColumn === recordChildren.tableColumn)[0]
      if (!this.isEmpty(target)) {
        Object.assign(target, valueObj)
        const tempColumnInfos = JSON.parse(JSON.stringify(this.columnInfos))
        this.columnInfos.splice(0, this.columnInfos.length, ...tempColumnInfos)
      }
    },
    show () {
      this.addVisible = true
    },
    onClose () {
      this.addVisible = false
      this.hasPage = '2'
      this.tableType = '1'
      this.selectedTreeNodeKey = ''
      this.routerNode = {}
      this.hasRouterNode = false
      this.newRouterList = {}
      this.tableName = ''
      this.columnInfos = []
      this.form.resetFields()
    },
    // 刷新列表
    refreshColumn (value) {
      this.tableName = { 'tableName': value }
      this.$refs.columnInfoTable.refresh()
    },
    // 生成方式
    radioHasPage (e) {
      this.hasPage = e.target.value
    },
    // 列表样式
    radioTableType (e) {
      this.tableType = e.target.value
    },
    // 路由循环列表
    loopRouter (routerList) {
      routerList.filter(item => {
        item.title = item.path
        item.key = item.path
        if (!this.isEmpty(item.children)) {
          this.loopRouter(item.children)
        }
      })
    },
    // 增加路由树
    addTreeNode (keys) {
      if (!this.isEmpty(keys) && !this.isEmpty(keys[0])) {
        this.selectedTreeNodeKey = keys[0]
      }
      this.$refs.routerAdd.show()
    },
    // 设置子路由
    setRouter (routerNode) {
      this.hasRouterNode = true
      this.routerNode = routerNode
      this.newRouterList = JSON.parse(JSON.stringify(this.routerList))
      this.updateRouterList(this.newRouterList, routerNode)
    },
    // 将新增的路由节点放到父级下面
    updateRouterList (routerList, routerNode) {
      let existRouter = false
      for (const item in routerList) {
        if (routerNode.parentRouter === routerList[item].path) {
          const router = {
            path: routerNode.fileUrl,
            name: routerNode.engValue,
            meta: { title: routerNode.chinaValue, keepAlive: true }
          }
          if (this.isEmpty(routerList[item].children)) {
            routerList[item].children = []
          }
          routerList[item].children.push(router)
          existRouter = true
          break
        }
        if (!this.isEmpty(routerList[item].children)) {
          existRouter = this.updateRouterList(routerList[item].children, routerNode)
        }
        if (existRouter) {
          break
        }
      }
    },
    // 新增服务
    addService () {
      this.$refs.serviceAdd.show()
    },
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          values.tableInfo = this.columnInfos
          values.tableComment = values.chinaValue
          if (this.isEmpty(values.fileUrl) || this.isEmpty(values.parentRouter) || this.isEmpty(values.router) || this.isEmpty(values.chinaValue) || this.isEmpty(values.engValue)) {
            this.$message.info('路由信息不能为空')
            this.formLoading = false
            return
          }
          if (this.hasPage === '1') {
            for (let i = 0; i < this.columnInfos.length; i++) {
              const item = this.columnInfos[i]
              if (this.isEmpty(item.componentType)) {
                this.$message.info('组件类型不能为空')
                this.formLoading = false
                return
              }
              if (!this.isEmpty(item.componentType) && item.componentType === 'Select' && this.isEmpty(item.componentData)) {
                this.$message.info('组件类型为Select时,选项或字典值不能为空')
                this.formLoading = false
                return
              }
            }
            if (this.isEmpty(values.tableInfo)) {
              this.$message.info('生成方式为页面时,表信息不能为空')
              this.formLoading = false
              return
            }
          }
          const params = replaceBlooean(values)
          // 前端代码生成
          this.createCode(params).then(res => {
            if (res.code === 10000) {
              this.$message.info(`生成前端代码结果：${res.msg}`)
              if (this.hasPage === '1') {
                // 生成页面 后端代码生成
                this.save(params).then(res => {
                  if (res.code === 10000) {
                    this.$message.info(`生成后端代码结果：${res.msg}`)
                  }
                })
              }
            }
          }).finally(() => {
            this.formLoading = false
            this.refresh()
            this.onClose()
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

/**
 * boolean 转 字符串类型 配合后台类型，否则不用转
 * @param obj
 * @returns {any}
 */
function replaceBlooean (obj) {
  return JSON.parse(JSON.stringify(obj).replace(/:true/g, ':"1"').replace(/:false/g, ':"0"').replace(/ :true/g, ':"1"').replace(/ :false/g, ':"0"'))
}
</script>

<style scoped>
  .editTable {
    margin: -5px 0;
    min-width: 50px
  }
</style>
