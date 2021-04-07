<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="API名称">
                <a-input v-model="queryParam.name" placeholder="请输入API名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="操作人">
                <a-input v-model="queryParam.operationPerson" placeholder="请输入操作人"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="操作时间">
                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-model="queryParam.addTimeCondition"/>
              </a-form-item>
            </a-col>
            <a-col v-authorize:SYS_LOG_LIST :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.logTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

    </div>
    <s-table
      v-if="$authorize('SYS_LOG_LIST')"
      ref="logTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-authorize:SYS_LOG_DETAILS @click="handleDetail(record)">详情</a>
        </template>
      </span>
    </s-table>
    <detail
      ref="logDetail"
      :format-date="formatDate"
      :record="recordActive"/>
  </a-card>
</template>

<script>

import { formatDate, getMoment, offsetMoment } from '@/utils/common'
import { get, queryList } from '@/api/sys/log'
import { STable } from '@/components'
import Detail from './components/Detail'
export default {
  name: 'LogList',
  components: {
    STable,
    Detail
  },
  data () {
    return {
      // 查询参数
      queryParam: { addTimeCondition: [offsetMoment(undefined, undefined, 'week', -1), getMoment()] },
      // 列表表头
      columns: [
        {
          title: '操作时间',
          dataIndex: 'addTime',
          key: 'addTime'
        },
        {
          title: '操作人',
          dataIndex: 'operationPerson',
          key: 'operationPerson'
        },
        {
          title: 'API名称',
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
          key: 'requestMethod'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '320px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 日期工具类
      formatDate: formatDate,
      getMoment: getMoment,
      // 列表加载数据方法
      loadData: parameter => {
        if (this.queryParam.addTimeCondition) {
          this.queryParam.addTimeSearch = []
          this.queryParam.addTime = formatDate(this.queryParam.addTimeCondition[0], 'YYYY-MM-DD HH:mm:ss')
          this.queryParam.addEndTime = formatDate(this.queryParam.addTimeCondition[1], 'YYYY-MM-DD HH:mm:ss')
        }
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

    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.logTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.logTable.refresh()
    },
    // 打开详情
    handleDetail (record) {
      get(record).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.logDetail.show()
        }
      })
    }
  }
}
</script>
