<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="主表名">
                <a-input v-model="queryParam.tableName" placeholder="请输入表名"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.tableComment" placeholder="请输入名称"/>
              </a-form-item>
            </a-col>
            <a-col v-authorize:CODE_GENERATE_LIST :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.autoTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-authorize:CODE_GENERATE_ADD type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      </div>
    </div>
    <s-table
      v-if="$authorize('CODE_GENERATE_LIST')"
      ref="autoTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="enabled" slot-scope="text">
        {{ getEnableName(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-popconfirm v-authorize:CODE_GENERATE_DEL title="您确认删除吗?" @confirm="handleDelete(record)" okText="确认" cancelText="取消">
            <a href="javascript:void(0)">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <add
      ref="autoAdd"
      :record="recordActive"
      :save="save"
      :set-service="setService"
      :table-info="tableInfo"
      :table-column-info="tableColumnInfo"
      :router-list="routerList"
      :is-empty="isEmpty"
      :create-code="createCode"
      :refresh="refresh"
      :service-name="serviceName"
    />
  </a-card>
</template>

<script>
import { asyncRouterMap } from '@/config/router.config'
import path from '@/api/index'
import {
  queryList,
  tableDel,
  tableInfo,
  tableColumnInfo,
  save,
  createCode
} from '@/api/auto'
import { STable } from '@/components'
import Add from './components/Add'
import { isEmpty } from '@/utils/common'

export default {
  name: 'AutoList',
  components: { STable, Add },
  data () {
    return {
      // 前端代码生成
      createCode: createCode,
      // 保存方法
      save: save,
      //  删除记录
      tableDel: tableDel,
      // 表信息
      tableInfo: tableInfo,
      // 表列信息
      tableColumnInfo: tableColumnInfo,
      // 路由配置信息
      routerList: [asyncRouterMap[0]],
      isEmpty: isEmpty,
      serviceName: path,
      // 查询参数
      queryParam: {},
      // 列表表头
      columns: [
        {
          title: '主表名',
          dataIndex: 'tableName',
          key: 'tableName'
        }, {
          title: '路由',
          dataIndex: 'fileUrl',
          key: 'fileUrl'
        }, {
          title: '名称',
          dataIndex: 'tableComment',
          key: 'tableComment'
        }, {
          title: '操作人',
          dataIndex: 'fullName',
          key: 'fullName'
        }, {
          title: '操作时间',
          dataIndex: 'addTime',
          key: 'addTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '320px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 单个记录行
      recordActive: {},
      // 列表加载数据方法
      loadData: parameter => {
        return queryList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      }
    }
  },
  created () {
  },
  methods: {
    // 设置服务
    setService (serviceContent) {
      const serviceContents = Object.keys(serviceContent)
      const _serviceName = {}
      _serviceName[serviceContents[0]] = serviceContent[serviceContents[0]]
      this.serviceName = { ..._serviceName, ...this.serviceName }
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.autoTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.autoTable.refresh()
    },
    // 打开新增
    handleAdd () {
      this.record = {}
      this.$refs.autoAdd.show()
    },
    // 删除记录
    handleDelete (record) {
      const param = { id: record.id }
      this.tableDel(param).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
        }
      })
    }
  }
}
</script>
