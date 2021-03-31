<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="关键字">
                <a-input v-model="queryParam.key" placeholder="请输入关键字"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="refresh">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery">重置</a-button>
                <a-button v-authorize:PROCESS_MODEL_ADD type="danger" style="margin-left: 8px" @click="add">新建</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
      </div>
    </div>
    <a-list
      v-if="$authorize('PROCESS_MODEL_LIST')"
      class="modelList"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4 }"
      :loading="loading"
      :pagination="pagination"
      :data-source="listData">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card hoverable :style="cardStyle(item)">
          <p v-authorize:PROCESS_MODEL_DETAILS slot="cover" style="height: 100px" @click="viewModel(item)">
            <a-badge
              :count="'v'+item.version"
              style="float: right; margin: 8px;"
              :number-style="badgeStyle()"
            />
          </p>
          <template slot="actions" class="ant-card-actions">
            <a-icon v-if="$authorize('PROCESS_MODEL_EDIT')" title="编辑" key="form" type="form" @click="editModel(item)"/>
            <a-icon v-if="$authorize('PROCESS_MODEL_CLONE')" title="复制" key="copy" type="copy" @click="cloneModel(item)"/>
            <a-popconfirm v-if="$authorize('PROCESS_MODEL_DEL')" title="你确定要删除该模型吗？" @confirm="deleteModel(item)">
              <a-icon title="删除" key="delete" type="delete"/>
            </a-popconfirm>
            <a-icon
              title="历史"
              v-if="$authorize('PROCESS_MODEL_HISTORIES') && item.version>1"
              key="history"
              type="history"
              @click="historyModel(item)"/>
            <a-popconfirm v-if="$authorize('PROCESS_MODEL_PUBLISH')" title="你确定要发布该模型吗？" @confirm="publishModel(item)">
              <a-icon title="发布" key="publish" type="deployment-unit"/>
            </a-popconfirm>
          </template>
          <a-card-meta v-authorize:PROCESS_MODEL_DETAILS :title="item.name" @click="viewModel(item)">
            <div slot="description">
              <p class="oneLine">{{ item.modelKey }}</p>
              <p class="oneLine">{{ item.description || '' }}</p>
              <p class="oneLine">{{ item.lastUpdated }}</p>
            </div>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
    <add
      ref="addModel"
      :record="recordActive"
      :check-key="checkKey"
      :refresh="refresh"
      :form-lists="formLists"
      :assignee-opts="assigneeOpts"
      :initiator-opts="initiatorOpts"
      :group-lists="groupLists"
      :save="save"
    />
    <detail
      ref="detailModel"
      :record="recordActive"
    />
    <edit
      ref="editModel"
      :record="recordActive"
      :check-key="checkKey"
      :refresh="refresh"
      :form-lists="formLists"
      :assignee-opts="assigneeOpts"
      :initiator-opts="initiatorOpts"
      :group-lists="groupLists"
      :update="update"
    />
    <clone
      ref="cloneModel"
      :record="recordActive"
      :check-key="checkKey"
      :refresh="refresh"
      :form-lists="formLists"
      :assignee-opts="assigneeOpts"
      :initiator-opts="initiatorOpts"
      :group-lists="groupLists"
      :save="save"
    />
    <model-history
      ref="historyModel"
      :refresh="refresh"
      :rollback="rollback"
      :record="historyModels"/>
  </a-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { list } from '@/api/process/form'
  import { users, groups, queryList, checkKey, save, get, update, del, histories, rollback, publish } from '@/api/process/model'
  import Add from './components/Add'
  import Detail from './components/Detail'
  import Edit from './components/Edit'
  import Clone from './components/Clone'
  import ModelHistory from './components/Histories'
  /**
   * 初始化分页
   * @type {{current: number, total: number, pageSize: number}}
   */
  const initPagination = {
    pageSize: 12,
    current: 1,
    total: 0
  }
  export default {
  name: 'Model',
  components: { ModelHistory, Add, Detail, Edit, Clone },
  data () {
    return {
      formLists: [],
      initiatorOpts: [{ label: '发起人', value: 'initiator' }],
      // eslint-disable-next-line no-template-curly-in-string
      assigneeOpts: [{ label: '发起人', value: '#{initiator}' }],
      groupLists: [],
      historyModels: [],
      recordActive: {},
      checkKey: checkKey,
      save: save,
      update: update,
      rollback: rollback,
      loading: true,
      listData: [],
      loadData: params => {
        queryList(Object.assign({}, params, {
          'size': this.pagination.pageSize,
          'current': this.pagination.current
        })).then(res => {
          if (res.code === 10000) {
            this.loading = false
            const result = res.result
            this.pagination = Object.assign({}, this.pagination, {
              total: result.total
            })
            this.listData = result.records
          }
        })
      },
      pagination: {
        onChange: page => {
          this.pagination.current = page
          this.loadData(this.queryParam)
        },
        ...initPagination
      },
      queryParam: {}
    }
  },
  mounted () {
    this.loadData()
  },
  created () {
    list({}).then((res) => {
      if (res.code === 10000) {
        const result = res.result
        if (result && result.length && result.length > 0) {
           result.forEach(item => {
             this.formLists.push({ label: `${item.name}`, value: `${item.modelKey}` })
          })
        }
      }
    })
    users().then((res) => {
      if (res.code === 10000) {
        const result = res.result
        if (result && result.length && result.length > 0) {
          result.forEach(item => {
            this.assigneeOpts.push({ label: `${item.id}`, value: `${item.id}` })
            this.initiatorOpts.push({ label: `${item.id}`, value: `${item.id}` })
          })
        }
      }
    })
    groups().then((res) => {
      if (res.code === 10000) {
        const result = res.result
        if (result && result.length && result.length > 0) {
          result.forEach(item => {
            this.groupLists.push({ label: `${item.name}`, value: `${item.id}` })
          })
        }
      }
    })
  },
    methods: {
      /**
       * 新建
       */
      add () {
        this.recordActive = { }
        this.$refs.addModel.show()
      },
      /**
       * 查看
       */
      viewModel (item) {
        get(item).then(res => {
          if (res.code === 10000) {
            this.recordActive = res.result
            this.$refs.detailModel.show()
          }
        })
      },
      /**
       *  修改
       */
      editModel (item) {
        get(item).then(res => {
          if (res.code === 10000) {
            this.recordActive = res.result
            this.$refs.editModel.show()
          }
        })
      },
      /**
       * 克隆表单
       */
      cloneModel (item) {
        get(item).then(res => {
          if (res.code === 10000) {
            this.recordActive = res.result
            this.recordActive.modelKey = undefined
            this.$refs.cloneModel.show()
          }
        })
      },
      /**
       * 历史版本
       */
      historyModel (item) {
        histories(item).then(res => {
          if (res.code === 10000) {
            if (res.result instanceof Array) {
              this.historyModels = res.result
            }
            this.$refs.historyModel.show()
          }
        })
      },
      /**
       * 删除
       */
      deleteModel (item) {
        del(item).then(res => {
          if (res.code && res.code === 10000) {
            this.$message.info(res.msg)
            this.refresh()
          }
        })
      },
      /**
       * 部署模型
       */
      publishModel (item) {
        publish(item).then(res => {
          if (res.code && res.code === 10000) {
            this.$message.info(res.msg)
            this.refresh()
          }
        })
      },
      ...mapGetters(['color']),
      /**
       * 采用主题色
       * @returns {{backgroundColor: *}}
       */
      badgeStyle () {
        return { backgroundColor: this.color() }
      },
      /**
       *  背景图样式
       **/
      cardStyle (item) {
        if (item.thumbnail) {
          return {
            backgroundImage: 'url(data:image/png;base64,' + item.thumbnail + ')',
            backgroundRepeat: 'no-repeat'
          }
        }
        return {}
      },
      // 重置查询
      restQuery () {
        this.queryParam = {}
        this.pagination = Object.assign(this.pagination, initPagination)
        this.loadData(this.queryParam)
      },
      // 刷新列表
      refresh () {
        this.pagination = Object.assign(this.pagination, initPagination)
        this.loadData(this.queryParam)
      }
    }
}
</script>

<style lang="less" scoped>
  .modelList {
    /deep/ .ant-card-body {
      background-color: #e8edf1;
    }
    /deep/ .oneLine{
      margin-bottom: 0px;
      height: 21px;
      display: inline-block;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow:ellipsis;
    }
  }
</style>
