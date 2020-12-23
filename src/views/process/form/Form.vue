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
                <a-button type="danger" style="margin-left: 8px" @click="add">新建</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
      </div>
    </div>
    <a-list
      class="formList"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4 }"
      :loading="loading"
      :pagination="pagination"
      :data-source="listData">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card hoverable :style="cardStyle(item)">
          <p slot="cover" style="height: 100px" @click="viewForm(item)">
            <a-badge
              :count="'v'+item.version"
              style="float: right; margin: 8px;"
              :number-style="badgeStyle()"
            />
          </p>
          <template slot="actions" class="ant-card-actions">
            <a-icon key="form" type="form" @click="editForm(item)"/>
            <a-icon key="copy" type="copy" @click="cloneForm(item)"/>
            <a-popconfirm title="你确定要删除该表单吗？" @confirm="deleteForm(item)">
              <a-icon key="delete" type="delete"/>
            </a-popconfirm>
            <a-icon v-if="item.version>1" key="history" type="history" @click="historyForm(item)"/>
          </template>
          <a-card-meta :title="item.name" @click="viewForm(item)">
            <div slot="description">
              <p style="margin-bottom: 0px;">{{ item.modelKey }}</p>
              <p style="margin-bottom: 0px;">{{ item.description }}</p>
              <p style="margin-bottom: 0px;">{{ item.lastUpdated }}</p>
            </div>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
    <add
      ref="addForm"
      :input-components="inputComponents"
      :select-components="selectComponents"
      :outcomes-components="outcomesComponents"
      :record="recordActive"
      :check-key="checkKey"
      :refresh="refresh"
      :save="save"
    />
    <edit
      ref="editForm"
      :input-components="inputComponents"
      :select-components="selectComponents"
      :outcomes-components="outcomesComponents"
      :record="recordActive"
      :check-key="checkKey"
      :refresh="refresh"
      :update="update"
    />
    <clone
      ref="cloneForm"
      :input-components="inputComponents"
      :select-components="selectComponents"
      :outcomes-components="outcomesComponents"
      :record="recordActive"
      :check-key="checkKey"
      :refresh="refresh"
      :save="save"
    />
    <detail
      ref="detailForm"
      :record="recordActive"
    />
    <form-history
      ref="historyForm"
      :refresh="refresh"
      :rollback="rollback"
      :record="historyForms"/>
  </a-card>
</template>

<script>
import { queryList, checkKey, save, get, update, del, histories, rollback } from '@/api/process/form'
import { mapGetters } from 'vuex'
import Add from './components/Add'
import Edit from './components/Edit'
import Clone from './components/Clone'
import Detail from './components/Detail'
import FormHistory from './components/Histories'
import { initSelects, initInputs, initOutcomes, initDrawingList, initDrawingButtonList, initialClone } from '@/components/Activiti/FormDesign/util'
import { input, textarea, number, radio, checkbox, select, datetime, date, outcomes } from '@/core/icons'
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
  name: 'Form',
  components: { Add, Edit, Clone, Detail, FormHistory },
  data () {
    return {
      historyForms: [],
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
      queryParam: {},
      /**
         * 输入性组件
         */
      inputComponents: initInputs,
      /**
         * 操作型组件
         */
      outcomesComponents: initOutcomes,
      /**
         * 选择型组件
         */
      selectComponents: initSelects
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    /**
       * 新建表单
       */
    add () {
      this.recordActive = { drawingList: initialClone(initDrawingList), drawingButtonList: initialClone(initDrawingButtonList) }
      this.$refs.addForm.show()
    },
    /**
     * 查看表单
     */
    viewForm (item) {
      get(item).then(res => {
        if (res.code === 10000) {
          this.recordActive = this.parseResult(res.result)
          this.$refs.detailForm.show()
        }
      })
    },
    /**
       *  修改表单
       */
    editForm (item) {
      get(item).then(res => {
        if (res.code === 10000) {
          this.recordActive = this.parseResult(res.result)
          this.$refs.editForm.show()
        }
      })
    },
    /**
     * 克隆表单
     */
    cloneForm (item) {
      get(item).then(res => {
        if (res.code === 10000) {
          this.recordActive = this.parseResult(res.result)
          this.$refs.cloneForm.show()
        }
      })
    },
    /**
     * 历史版本
     */
    historyForm (item) {
      histories(item).then(res => {
        if (res.code === 10000) {
          if (res.result instanceof Array) {
            res.result.forEach(item => {
                this.parseResult(item)
            })
            this.historyForms = res.result
          }
          this.$refs.historyForm.show()
        }
      })
    },
    /**
       * 删除表单
       */
    deleteForm (item) {
      del(item).then(res => {
        if (res.code && res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
        }
      })
    },
    /**
     * 服务端详情数据解析
     */
    parseResult (result) {
      if (result && result.modelEditorJson && result.modelEditorJson !== '') {
        const modelEditorJson = JSON.parse(result.modelEditorJson)
        if (modelEditorJson && modelEditorJson instanceof Array) {
          const _drawingList = []
          const _drawingButtonList = []
          modelEditorJson.forEach(f => {
            const _f = {}
            _f.fieldType = f.fieldType
            _f.id = f.id
            _f.name = f.name
            if (f.fieldType === 'outcomes') {
              _f.tagIcon = outcomes
              _drawingButtonList.push(_f)
            } else {
              switch (f.fieldType) {
                case 'textarea':
                  _f.tagIcon = textarea
                  _f.tag = 'a-textarea'
                  _f.autoSize = {
                    minRows: 4,
                    maxRows: 4
                  }
                  break
                case 'input-number':
                  _f.tagIcon = number
                  _f.tag = 'a-input-number'
                  break
                case 'radio':
                  _f.tagIcon = radio
                  _f.tag = 'a-radio-group'
                  _f.options = f.options
                  break
                case 'checkbox':
                  _f.tagIcon = checkbox
                  _f.tag = 'a-checkbox-group'
                  _f.options = f.options
                  break
                case 'select':
                  _f.tagIcon = select
                  _f.tag = 'a-select'
                  _f.options = f.options
                  break
                case 'date':
                  _f.tagIcon = date
                  _f.tag = 'a-date-picker'
                  break
                case 'datetime':
                  _f.tagIcon = datetime
                  _f.tag = 'a-date-picker'
                  break
                default:
                  _f.tagIcon = input
                  _f.tag = 'a-input'
              }
              if (f.value && f.value.length > 2 && f.value[0] === '[' && f.value[f.value.length - 1] === ']') {
                _f.value = JSON.parse(f.value)
              } else {
                _f.value = f.value
              }
              _f.required = f.required
              _f.placeholder = f.placeholder
              _f.disabled = f.disabled
              _drawingList.push(_f)
            }
          })
          result.modelEditorJson = {}
          result.drawingList = _drawingList
          result.drawingButtonList = _drawingButtonList
        }
      }
      return result
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

<style scoped lang="less">
  .formList /deep/ .ant-card-body {
    background-color: #e8edf1;
  }
</style>
