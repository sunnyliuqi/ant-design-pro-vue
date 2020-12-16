<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="流程名称">
                <a-input v-model="queryParam.nameLike" placeholder="请输入流程名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="key">
                <a-input v-model="queryParam.keyLike" placeholder="请输入key"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="版本">
                <a-input-number v-model="queryParam.version" placeholder="请输入版本"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="状态">
                <a-select :options="allStatus" v-model="queryParam.suspended" placeholder="全部"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="最新版本">
                <a-checkbox v-model="queryParam.latest"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.definitionTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-upload
          name="file"
          :showUploadList="false"
          :customRequest="handleImport"
        >
          <a-button :icon="fileLoading ? 'loading' : 'upload'">上传部署文件</a-button>
        </a-upload>
      </div>
    </div>
    <s-table
      ref="definitionTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="sequence" slot-scope="text, record, index">
        {{ index+1 }}
      </span>
      <span slot="suspended" slot-scope="text">
        {{ text?'挂起':'活动' }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-if="record.suspended" @click="handleSuspended(record)">激活</a>
          <a v-else @click="handleSuspended(record)">挂起</a>
          <a-divider type="vertical"/>
          <a @click="handleDelete(record)">删除部署</a>
          <a-divider type="vertical"/>
          <a @click="lookImg(record)">流程图</a>
          <a-divider type="vertical"/>
          <a @click="downBpmn(record)">流程文件下载</a>
        </template>
      </span>
    </s-table>
    <look-image ref="lookImage" :img="definitionImg" />
  </a-card>
</template>

<script>
import { queryList, executeProcessDefinitionAction, deleteDeployment, getProcessDefinitionResource, getProcessDefinitionImage, uploadDeployment } from '@/api/process/definition'
import { STable } from '@/components'
import LookImage from './components/LookImage'
import { formatDate, getMoment } from '@/utils/common'
export default {
  name: 'Definition',
  components: {
    STable, LookImage
  },
  data () {
    return {
      fileLoading: false,
      definitionImg: undefined,
      allStatus: [{ label: '全部', value: '' }, { label: '活动', value: 'false' }, { label: '挂起', value: 'true' }],
      // 查询参数
      queryParam: { suspended: '', latest: true },
      // 列表表头
      columns: [
        {
          title: '序列',
          dataIndex: 'sequence',
          key: 'sequence',
          scopedSlots: { customRender: 'sequence' }
        },
        {
          title: '流程名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '流程key',
          dataIndex: 'key',
          key: 'key'
        },
        {
          title: '部署id',
          dataIndex: 'deploymentId',
          key: 'deploymentId'
        },
        {
          title: '版本',
          dataIndex: 'version',
          key: 'version'
        },
        {
          title: '状态',
          dataIndex: 'suspended',
          key: 'suspended',
          scopedSlots: { customRender: 'suspended' }
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
    /**
     * 上传部署
     */
    handleImport (data) {
      this.fileLoading = true
      uploadDeployment(data.file).then(res => {
        if (res.code === 10000) {
          this.$message.info(this.createMsg(res.result))
        }
      }).finally(() => {
        this.fileLoading = false
        this.refresh()
      })
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.definitionTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.definitionTable.refresh()
    },
    getParams (record) {
      if (!record.suspended) {
        return {
          'id': record.id,
          'action': 'suspend',
          'includeProcessInstances': 'false',
          'date': formatDate(getMoment())
        }
      } else {
        return {
          'id': record.id,
          'action': 'activate',
          'includeProcessInstances': 'true',
          'date': formatDate(getMoment())
        }
      }
    },
    // 挂起和激活
    handleSuspended (record) {
      executeProcessDefinitionAction(this.getParams(record)).then(res => {
        if (res.code === 10000) {
          this.$message.info('处理成功')
          setTimeout(() => {
            this.refresh()
          }, 3000)
        }
      })
    },
    // 删除流程部署
    handleDelete (record) {
      deleteDeployment(record.deploymentId).then(res => {
        if (res.code === 10000) {
          this.$message.info('处理成功')
          this.refresh()
        }
      })
    },
    lookImg (record) {
      getProcessDefinitionImage(record.id).then(res => {
        if (res.code === 10000) {
          this.definitionImg = res.result
          this.$refs.lookImage.show()
        }
      })
    },
    downBpmn (record) {
      getProcessDefinitionResource(record.id).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
