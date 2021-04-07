<template>
  <a-card :bordered="false">
    <div>
      <div class="table-operator">
        <a-button v-authorize:SYS_ROLE_ADD type="primary" icon="plus" @click="handleAdd()">新建</a-button>

      </div>
    </div>
    <s-table
      v-if="$authorize('SYS_ROLE_LIST')"
      ref="roleTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"

      :data="loadData"
      showPagination="false"
    >
      <span slot="status" slot-scope="text">
        {{ getStatusName(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-authorize:SYS_ROLE_UPDATE @click="handleUpdate(record)">修改</a>
          <a-divider v-authorize:SYS_ROLE_UPDATE type="vertical"/>
          <a-popconfirm v-authorize:SYS_ROLE_DELETE title="您确认删除吗?" @confirm="handleDelete([record])" okText="确认" cancelText="取消">
            <a href="javascript:void(0)">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <add
      ref="roleAdd"
      :tree-data="treeData"
      :record="recordActive"
      :save="save"
      :refresh="refresh"
    />
    <edit
      ref="roleEdit"
      :tree-data="treeData"
      :get-role-menus="getRoleMenus"
      :record="recordActive"
      :update="update"
      :refresh="refresh"
    />
  </a-card>
</template>

<script>

import { del, get, queryList, save, update, getRoleMenus } from '@/api/sys/role'
import { getMenuAndOrganization } from '@/api/sys/menu'
import { STable } from '@/components'
import Add from './components/Add'
import Edit from './components/Edit'

export default {
  name: 'RoleList',
  components: {
    STable,
    Add,
    Edit
  },
  data () {
    return {
      // 保存方法
      save: save,
      // 修改方法
      update: update,
      /* 获取角色菜单 */
      getMenuAndOrganization: getMenuAndOrganization,
      /* 获取选中的菜单 */
      getRoleMenus: getRoleMenus,
      // 查询参数
      queryParam: {},
      // 列表表头
      columns: [
        {
          title: '编码',
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'addTime',
          key: 'addTime'
        },
        {
          title: '创建者',
          dataIndex: 'userName',
          key: 'userName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '320px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return queryList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      },
      // 单个记录行
      recordActive: {},
      /* 菜单树 */
      treeData: []
    }
  },
  created () {
    this.getMenuAndOrganization().then(res => {
      if (res.code === 10000) {
        const baseMenu = { id: '-1', name: '平台菜单', url: '', code: '-1', supId: '-1', title: '平台菜单', value: '-1', key: '-1' }
        if (res.result && res.result.length > 0) {
          baseMenu.children = res.result
        }
        this.treeData = this.formatTree([baseMenu])
      }
    })
  },
  computed: {},
  methods: {
    /* 格式化树 */
    formatTree (baseMenuArray) {
      if (baseMenuArray && baseMenuArray instanceof Array && baseMenuArray.length > 0) {
        baseMenuArray = baseMenuArray.map(item => {
          if (item.children) {
            item.children = this.formatTree(item.children)
          }
          return Object.assign(item, { title: item.name, key: item.id })
        })
        return baseMenuArray
      } else {
        return baseMenuArray
      }
    },
    getStatusName (key) {
      let value = ''
      switch (key) {
        case '0':
          value = '禁用'
          break
        case '1':
          value = '启用'
          break
      }
      return value
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.roleTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.roleTable.refresh()
    },
    // 打开新增
    handleAdd () {
      this.recordActive = {}
      this.$refs.roleAdd.show()
    },
    // 打开更新
    handleUpdate (record) {
      get(record).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.roleEdit.show()
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
