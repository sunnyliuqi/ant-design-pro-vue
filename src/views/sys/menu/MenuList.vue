<template>
  <a-card :bordered="false">
    <div>
      <div class="table-operator">
        <a-button v-authorize:SYS_MENU_EDIT type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      </div>
    </div>
    <s-table
      v-if="$authorize('SYS_MENU_LIST')"
      ref="menuTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :defaultExpandedRowKeys="['-1']"
      :data="loadData"
      showPagination="false"
    >
      <span slot="showFlag" slot-scope="text">
        {{ getShowFlagName(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-if="record.id != -1" v-authorize:SYS_MENU_EDIT @click="handleUpdate(record)">修改</a>
          <a-divider v-if="record.id != -1" v-authorize:SYS_MENU_EDIT type="vertical"/>
          <a-popconfirm
            v-if="record.id != -1"
            v-authorize:SYS_MENU_DELETE
            title="您确认删除吗?"
            @confirm="handleDelete([record])"
            okText="确认"
            cancelText="取消">
            <a href="javascript:void(0)">删除</a>
          </a-popconfirm>
          <a-divider v-if="record.id != -1" v-authorize:SYS_MENU_DELETE type="vertical"/>
          <a v-authorize:SYS_MENU_EDIT @click="handleAdd(record.id,record.url,true)">添加下级</a>
        </template>
      </span>
    </s-table>
    <edit
      ref="menuEdit"
      :title="title"
      :menu-tree-data="menuTreeData"
      :load-api="loadApi"
      :check-url="checkUrl"
      :check-code="checkCode"
      :record="recordActive"
      :update="update"
      :save="save"
      :custom-width="1000"
      :refresh="refresh"
    />
  </a-card>
</template>

<script>

import { del, get, queryList, save, update, checkUrl, checkCode } from '@/api/sys/menu'
import { queryList as loadApi } from '@/api/sys/api'
import { STable } from '@/components'
import Edit from './components/Edit'
/**
 * 格式化树名称为标题
 * @param list
 */
const treeData = list => {
  list.forEach(item => {
    item.title = item.name
    item.value = item.id
    if (item.children) {
      treeData(item.children)
    }
  })
}
const baseMenu = { id: '-1', name: '平台菜单', url: '', code: '-1', supId: '', title: '平台菜单', value: '-1' }
export default {
  name: 'MenuList',
  components: {
    STable,
    Edit
  },
  data () {
    return {
      // 保存方法
      save: save,
      // 修改方法
      update: update,
      /* 读取api列表 */
      loadApi: loadApi,
      /* 检查url唯一性 */
      checkUrl: checkUrl,
      /* 检查操作编码唯一性 */
      checkCode: checkCode,
      title: '编辑',
      // 查询参数
      queryParam: {},
      // 列表表头
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'name',
          width: '200px',
          key: 'name'
        },
        {
          title: '菜单编码',
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: 'URL',
          dataIndex: 'url',
          key: 'url'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort'
        },
        {
          title: '显示',
          dataIndex: 'showFlag',
          key: 'showFlag',
          scopedSlots: { customRender: 'showFlag' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      menuTreeData: [],
      loadData: parameter => {
        return queryList()
          .then(res => {
            if (res.code === 10000) {
              const result = res.result
              treeData(result)
              if (result && result.length > 0) {
                baseMenu.children = result
              }
              this.menuTreeData = [baseMenu]
              return this.menuTreeData
            }
          })
      },
      // 单个记录行
      recordActive: {}
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    /* 是否显示转换 */
    getShowFlagName (key) {
      let value = ''
      switch (key) {
        case '1':
          value = '是'
          break
        case '0':
          value = '否'
          break
      }
      return value
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.menuTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.menuTable.refresh()
    },
    // 打开新增
    handleAdd (supId, url, disabled) {
      this.recordActive = { supId: supId || '', parentUrl: url, disabled: disabled || false }
      this.title = '新增'
      this.$refs.menuEdit.show()
    },
    // 打开更新
    handleUpdate (record) {
      get(record).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.title = '编辑'
          this.$refs.menuEdit.show()
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
        if (res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
        }
      })
    }
  }
}
</script>
