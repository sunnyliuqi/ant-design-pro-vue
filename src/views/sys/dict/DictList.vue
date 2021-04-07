<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="字典类型">
                <a-select :options="allDict" v-model="queryParam.type" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="字典标签">
                <a-input v-model="queryParam.dictKey" placeholder="请输入字典标签"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="字典值">
                <a-input v-model="queryParam.dictValue" placeholder="请输入字典值"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="备注">
                <a-input v-model="queryParam.remark" placeholder="请输入备注"/>
              </a-form-item>
            </a-col>
            <a-col v-authorize:SYS_DICT_LIST :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.dictTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-authorize:SYS_DICT_ADD type="primary" icon="plus" @click="handleAdd()">新建</a-button>
        <a-button v-authorize:SYS_DICT_EXPORT icon="download" @click="handleExport()">导出</a-button>
        <a-button v-authorize:SYS_DICT_IMPORT icon="cloud-download" @click="handleTemplate()">模板下载</a-button>
        <a-upload
          v-authorize:SYS_DICT_IMPORT
          name="file"
          :showUploadList="false"
          :customRequest="handleImport"
        >
          <a-button :icon="fileLoading ? 'loading' : 'upload'">导入</a-button>
        </a-upload>
      </div>
    </div>
    <s-table
      v-if="$authorize('SYS_DICT_LIST')"
      ref="dictTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-authorize:SYS_DICT_UPDATE @click="handleUpdate(record)">修改</a>
          <a-divider v-authorize:SYS_DICT_UPDATE type="vertical"/>
          <a-popconfirm v-authorize:SYS_DICT_DELETE title="您确认删除吗?" @confirm="handleDelete([record])" okText="确认" cancelText="取消">
            <a href="javascript:void(0)">删除</a>
          </a-popconfirm>
          <a-divider v-authorize:SYS_DICT_DELETE type="vertical"/>
          <a v-authorize:SYS_DICT_ADD @click="handleAdd(record.type,true)">添加键值</a>
        </template>
      </span>
    </s-table>
    <add
      ref="dictAdd"
      :record="recordActive"
      :save="save"
      :refresh="refresh"
    />
    <edit
      ref="dictEdit"
      :record="recordActive"
      :update="update"
      :refresh="refresh"
    />
  </a-card>
</template>

<script>

import { del, get, queryList, save, update, getAllDict, exportExcel, template, importExcel } from '@/api/sys/dict'
import { STable } from '@/components'
import Add from './components/Add'
import Edit from './components/Edit'
export default {
  name: 'DictList',
  components: {
    STable,
    Add,
    Edit
  },
  data () {
    return {
      /* 导入加载状态 */
      fileLoading: false,
      allDict: [{ label: '全部', value: '' }],
      // 保存方法
      save: save,
      // 修改方法
      update: update,
      // 查询参数
      queryParam: {},
      // 列表表头
      columns: [
        {
          title: '字典类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '字典标签',
          dataIndex: 'dictKey',
          key: 'dictKey'
        },
        {
          title: '字典值',
          dataIndex: 'dictValue',
          key: 'dictValue'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort'
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
    getAllDict().then(res => {
      if (res.code === 10000) {
        this.allDict = [...this.allDict, ...res.result.map(item => {
          return { label: `${item}`, value: `${item}` }
        })]
      }
    })
  },
  computed: {},
  methods: {
    /**
     * 导出
     */
    handleExport () {
      exportExcel(this.queryParam).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
        }
      })
    },
    /**
     * 模板下载
     */
    handleTemplate () {
      template().then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
        }
      })
    },
    /**
     * 导入
     */
    handleImport (data) {
      this.fileLoading = true
      importExcel(data.file).then(res => {
        if (res.code === 10000) {
          this.$message.info(this.createMsg(res.result))
        }
      }).finally(() => {
        this.fileLoading = false
        this.refresh()
      })
    },
    /* 创建多行vnode */
    createMsg (messages) {
      const msgNodes = messages.map(msg => {
        return this.$createElement('p', msg)
      })
      const multiMsg = this.$createElement('p', { style: { textAlign: 'left' } }, msgNodes)
      return multiMsg
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.dictTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.dictTable.refresh()
    },
    // 打开新增
    handleAdd (type, disabled) {
      this.recordActive = { type: type || '', disabled: disabled || false }
      this.$refs.dictAdd.show()
    },
    // 打开更新
    handleUpdate (record) {
      get(record).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.dictEdit.show()
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
