<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="编码">
                <a-input v-model="queryParam.code" placeholder="请输入编码"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.name" placeholder="请输入名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="区域类型">
                <a-select :options="areaType" v-model="queryParam.type" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col v-authorize:SYS_AREA_LIST :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.areaTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-authorize:SYS_AREA_ADD type="primary" icon="plus" @click="handleAdd()">新建</a-button>

      </div>
    </div>
    <s-table
      v-if="$authorize('SYS_AREA_LIST')"
      ref="areaTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      :expandedRowKeys="expandedKeys"
      :expand="expand"
      :showPagination="showPagination"
    >
      <span slot="type" slot-scope="text">
        {{ getTypeName(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-authorize:SYS_AREA_UPDATE @click="handleUpdate(record)">修改</a>
          <a-divider v-authorize:SYS_AREA_UPDATE type="vertical"/>
          <a-popconfirm v-authorize:SYS_AREA_DELETE title="您确认删除吗?" @confirm="handleDelete([record])" okText="确认" cancelText="取消">
            <a href="javascript:void(0)">删除</a>
          </a-popconfirm>
          <a-divider v-authorize:SYS_AREA_DELETE type="vertical"/>
          <a v-authorize:SYS_AREA_ADD @click="handleAdd(record.id,record.code,true)">添加下级机构</a>
        </template>
      </span>
    </s-table>
    <add
      ref="areaAdd"
      :tree-data="treeData"
      :check-code="checkCode"
      :area-type="selectAreaType"
      :record="recordActive"
      :save="save"
      :refresh="refresh"
    />
    <edit
      ref="areaEdit"
      :tree-data="treeData"
      :check-code="checkCode"
      :area-type="selectAreaType"
      :record="recordActive"
      :update="update"
      :refresh="refresh"
    />
  </a-card>
</template>

<script>

import { del, get, queryList, save, update, checkCode } from '@/api/sys/area'
import { getDictByType } from '@/api/common'
import { STable } from '@/components'
import Add from './components/Add'
import Edit from './components/Edit'
/**
   * 格式化树名称为标题
   * @param list
   */
const formatTree = list => {
  list.forEach(item => {
    item.title = item.name
    item.value = item.id
    if (item.children) {
      formatTree(item.children)
    }
  })
}
export default {
  name: 'AreaList',
  components: {
    STable,
    Add,
    Edit
  },
  data () {
    return {
      showPagination: true,
      checkCode: checkCode,
      // 保存方法
      save: save,
      // 修改方法
      update: update,
      // 查询参数
      queryParam: {},
      // 列表表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '编码',
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: '区域类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '320px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      treeData: [],
      listData: [],
      expandedKeys: [],
      loadData: parameter => {
        return queryList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code && res.code === 10000) {
              const result = res.result
              if (result instanceof Array) {
                formatTree(result)
                this.treeData = JSON.parse(JSON.stringify(result))
                /* 默认展开两层 */
                this.expandedKeys = this.renderTree(result)
                this.showPagination = false
                this.filterTrees(result, 0)
              } else {
                this.showPagination = true
              }
              this.listData = result
              return this.listData
            }
          })
      },
      areaType: [{ label: '全部', value: '' }],
      selectAreaType: [],
      // 单个记录行
      recordActive: {}
    }
  },
  created () {
    getDictByType('area_type').then(
      (res) => {
        if (res.code && res.code === 10000) {
          const dnyAreaType = res.result.map(item => {
            return { label: `${item.dictKey}`, value: `${item.dictValue}` }
          })
          this.areaType = [...this.areaType, ...dnyAreaType]
          this.selectAreaType = dnyAreaType
        }
      }
    )
  },
  computed: {},
  methods: {
    /* 拿出id */
    renderTree (treeData) {
      if (treeData) {
        const keys = []
        treeData.forEach(item => {
          keys.push(item.id)
        })
        return keys
      }
    },
    /* 节点图标点击事件 展开或合并 */
    expand (expanded, record) {
      const src = JSON.parse(JSON.stringify(this.deepQuery(this.treeData, record.id)))
      this.filterTrees(src, 0)
      const target = this.deepQuery(this.listData, record.id)
      target.children = src.children
      let _expandedKeys = this.expandedKeys
      if (expanded) {
        _expandedKeys.push(record.id)
      } else {
        _expandedKeys = _expandedKeys.filter(item => {
          return item !== record.id
        })
      }
      this.expandedKeys = _expandedKeys
    },
    getTypeName (key) {
      let value = ''
      this.selectAreaType.forEach(item => {
        if (item.value === key) {
          value = item.label
        }
      })
      return value
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.areaTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.areaTable.refresh()
    },
    // 打开新增
    handleAdd (supId, supCode, disabled) {
      this.recordActive = { supId: supId || '', supCode: supCode || '', disabled: disabled || false }
      this.$refs.areaAdd.show()
    },
    // 打开更新
    handleUpdate (record) {
      get(record).then(res => {
        if (res.code && res.code === 10000) {
          this.recordActive = res.result
          this.$refs.areaEdit.show()
        }
      })
    },
    // 删除记录
    handleDelete (records) {
      let ids = ''
      records.map(record => {
        ids += record.id + ','
      })
      const param = { id: ids }
      del(param).then(res => {
        if (res.code && res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
        }
      })
    },
    filterTrees (treeData, deep) {
      if (!deep) {
        deep = 0
      }
      if (deep >= 2) {
        return []
      } else {
        if (treeData instanceof Array) {
          const _treeDate = treeData.map(item => {
            if (item.children) {
              item.children = this.filterTrees(item.children, deep + 1)
            }
            return item
          })
          return _treeDate
        } else {
          if (treeData.children && treeData.children.length > 0) {
            treeData.children = this.filterTrees(treeData.children, deep + 1)
          }
          return treeData
        }
      }
    },
    deepQuery (tree, id) {
      let isGet = false
      let retNode = null
      function deepSearch (tree, id) {
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].children && tree[i].children.length > 0) {
            deepSearch(tree[i].children, id)
          }
          if (id === tree[i].id || isGet) {
            isGet || (retNode = tree[i])
            isGet = true
            break
          }
        }
      }
      deepSearch(tree, id)
      return retNode
    }
  }
}
</script>
