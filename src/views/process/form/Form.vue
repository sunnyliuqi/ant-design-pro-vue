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
          <p slot="cover" style="height: 100px">
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
          <a-card-meta :title="item.name">
            <div slot="description">
              <p style="margin-bottom: 0px;">{{ item.description }}</p>
              <p style="margin-bottom: 0px;">{{ item.lastUpdated }}</p>
            </div>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
    <add
      ref="addForm"
      :init-design="initDesign"
      :clear-design="clearDesign"
      :input-components="inputComponents"
      :select-components="selectComponents"
      :outcomes-components="outcomesComponents"
      :drawing-list="drawingList"
      :drawing-button-list="drawingButtonList"
      :record="recordActive"
      :check-key="checkKey"
      :refresh="refresh"
      :save="save"
    />
  </a-card>
</template>

<script>
import { queryList, checkKey, save, get, update, del } from '@/api/process/form'
import { mapGetters } from 'vuex'
import Add from './components/Add'
import { initSelects, initInputs, initOutcomes, initDrawingList, initDrawingButtonList, initialClone } from '@/components/Activiti/FormDesign/util'

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
  components: { Add },
  data () {
    return {
      recordActive: {},
      checkKey: checkKey,
      save: save,
      update: update,
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
      selectComponents: initSelects,
      /**
         * 默认展示的表单
         */
      drawingList: initialClone(initDrawingList),
      /**
         * 默认展示的操作
         */
      drawingButtonList: initialClone(initDrawingButtonList)
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
      this.$refs.addForm.show()
    },
    /**
       *  修改表单
       */
    editForm (item) {
      console.info('edit：' + item.id)
    },
    /**
     * 克隆表单
     */
    cloneForm (item) {
      console.info('clone：' + item.id)
    },
    /**
     * 历史版本
     */
    historyForm (item) {
      console.info('history：' + item.id)
    },
    /**
       * 删除表单
       */
    deleteForm (item) {
      console.info('delete：' + item.id)
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
    },
    /**
       * 初始化设计器
       */
    initDesign () {
      this.inputComponents = initInputs
      this.selectComponents = initSelects
      this.outcomesComponents = initOutcomes
      this.drawingList = initialClone(initDrawingList)
      this.drawingButtonList = initialClone(initDrawingButtonList)
    },
    /**
     * 清空设计器
     */
    clearDesign () {
      this.inputComponents = []
      this.selectComponents = []
      this.outcomesComponents = []
      this.drawingList = []
      this.drawingButtonList = []
    }
  }

}
</script>

<style scoped lang="less">
  .formList /deep/ .ant-card-body {
    background-color: #e8edf1;
  }
</style>
