<template>
  <a-card :bordered="false">
    <div>
      <div class="table-operator">
        <a-button v-authorize:SYS_API_ADD type="primary" icon="plus" @click="handleAdd()">新建</a-button>

      </div>
    </div>
    <s-table
      v-if="$authorize('SYS_API_LIST')"
      ref="apiTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="false"
    >
      <span slot="requestMethod" slot-scope="text">
        {{ getRequestMethodName(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-authorize:SYS_API_UPDATE @click="handleUpdate(record)">修改</a>
          <a-divider v-authorize:SYS_API_UPDATE type="vertical"/>
          <a-popconfirm v-authorize:SYS_API_DELETE title="您确认删除吗?" @confirm="handleDelete([record])" okText="确认" cancelText="取消">
            <a href="javascript:void(0)">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <add
      ref="apiAdd"
      :check-url="checkUrl"
      :check-name="checkName"
      :record="recordActive"
      :save="save"
      :refresh="refresh"
    />
    <edit
      ref="apiEdit"
      :check-url="checkUrl"
      :check-name="checkName"
      :record="recordActive"
      :update="update"
      :refresh="refresh"
    />
  </a-card>
</template>

<script>

import { del, get, queryList, save, update, checkName, checkUrl } from '@/api/sys/api'
import { STable } from '@/components'
import Add from './components/Add'
import Edit from './components/Edit'

export default {
  name: 'ApiList',
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
      // 查询参数
      queryParam: {},
      /* 名称唯一性检测 */
      checkName: checkName,
      /* 路径唯一性校验 */
      checkUrl: checkUrl,
      // 列表表头
      columns: [
        {
          title: '编码',
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '路径',
          dataIndex: 'path',
          key: 'path'
        },
        {
          title: '请求方法',
          dataIndex: 'requestMethod',
          key: 'requestMethod',
          scopedSlots: { customRender: 'requestMethod' }
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
      recordActive: {}
    }
  },
  created () {
  },
  computed: {},
  methods: {

    getRequestMethodName (key) {
      let value = ''
      switch (key) {
        case 'GET':
          value = 'GET'
          break
        case 'POST':
          value = 'POST'
          break
        case 'PUT':
          value = 'PUT'
          break
        case 'DELETE':
          value = 'DELETE'
          break
      }
      return value
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.apiTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.apiTable.refresh()
    },
    // 打开新增
    handleAdd () {
      this.recordActive = {}
      this.$refs.apiAdd.show()
    },
    // 打开更新
    handleUpdate (record) {
      get(record).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.apiEdit.show()
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
