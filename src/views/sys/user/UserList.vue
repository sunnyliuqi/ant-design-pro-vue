<template>
  <a-card :bordered="false">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.userName" placeholder="请输入用户名"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.fullName" placeholder="请输入姓名"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="工号">
                <a-input v-model="queryParam.workNum" placeholder="请输入工号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.mobileNum" placeholder="请输入手机号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="邮箱">
                <a-input v-model="queryParam.email" placeholder="请输入邮箱"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="角色">
                <a-select
                  mode="multiple"
                  :options="rolesCondition"
                  v-model="queryParam.roleIds"
                  placeholder="全部">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="所属机构">
                <a-tree-select
                  allowClear
                  showSearch
                  :treeData="treeData"
                  :filterTreeNode="filterTreeNode"
                  v-model="queryParam.srcOrgId"
                  placeholder="全部">
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="入职时间">
                <a-range-picker v-model="queryParam.enterDate"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.enabled" placeholder="全部">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="true">正常</a-select-option>
                  <a-select-option value="false">冻结</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-authorize:SYS_USER_LIST :md="8" :sm="12" :xs="24">
              <span
                class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.userTable.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="restQuery()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-authorize:SYS_USER_ADD type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      </div>
    </div>
    <s-table
      v-if="$authorize('SYS_USER_LIST')"
      ref="userTable"
      size="default"
      :rowKey="(recordActive) => recordActive.id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="enabled" slot-scope="text">
        {{ getEnableName(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-authorize:SYS_USER_DETAILS @click="handleDetail(record)">详情</a>
          <a-divider v-authorize:SYS_USER_DETAILS type="vertical"/>
          <a v-authorize:SYS_USER_UPDATE @click="handleUpdate(record)">修改</a>
          <a-divider v-authorize:SYS_USER_UPDATE type="vertical"/>
          <a-popconfirm v-authorize:SYS_USER_DELETE title="您确认删除吗?" @confirm="handleDelete(record)" okText="确认" cancelText="取消">
            <a href="javascript:void(0)">删除</a>
          </a-popconfirm>
          <a-divider v-authorize:SYS_USER_DELETE type="vertical"/>
          <a-popconfirm v-authorize:SYS_USER_ENABLED title="确认冻结该用户吗?" @confirm="handleDisabled(record)" okText="确认" cancelText="取消">
            <a v-if="record.enabled" href="javascript:void(0)">冻结</a>
          </a-popconfirm>
          <a-popconfirm v-authorize:SYS_USER_ENABLED title="确认解冻该用户吗?" @confirm="handleEnabled(record)" okText="确认" cancelText="取消">
            <a v-if="!record.enabled" href="javascript:void(0)">解冻</a>
          </a-popconfirm>
          <a-divider v-authorize:SYS_USER_ENABLED type="vertical"/>
          <a-popconfirm v-authorize:SYS_USER_RESETPASSWORD title="确认要重置该用户的密码吗?" @confirm="handleRestPassword(record)" okText="确认" cancelText="取消">
            <a href="javascript:void(0)">重置密码</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <detail ref="userDetail" :file-display-prefix="fileDisplayPrefix" :record="recordActive"/>
    <add
      ref="userAdd"
      :file-display-prefix="fileDisplayPrefix"
      :parse-file-respon="parseFileRespon"
      :upload-url="uploadUrl"
      :record="recordActive"
      :roles="roles"
      :save="save"
      :refresh="refresh"
      :check-user-name="checkUserName"
      :check-work-num="checkWorkNum"
      :tree-data="treeData"
      :filter-tree-node="filterTreeNode"/>
    <edit
      ref="userEdit"
      :file-display-prefix="fileDisplayPrefix"
      :parse-file-respon="parseFileRespon"
      :upload-url="uploadUrl"
      :record="recordActive"
      :roles="roles"
      :update="update"
      :refresh="refresh"
      :check-user-name="checkUserName"
      :check-work-num="checkWorkNum"
      :tree-data="treeData"
      :moment="moment"
      :filter-tree-node="filterTreeNode"/>
  </a-card>
</template>

<script>
import moment from 'moment'
import { isEmpty } from '@/utils/common'
import { FILE_DISPLAY_PREFIX, parseFileRespon, UPLOAD_URL } from '@/api/upload'
import {
  checkUserName,
  checkWorkNum,
  del,
  enabled,
  get,
  queryList,
  resetPassword,
  save,
  update
} from '@/api/sys/user'
import { treeList } from '@/api/sys/organization'
import { roleList } from '@/api/sys/role'
import { STable } from '@/components'
import Detail from './components/Detail'
import Add from './components/Add'
import Edit from './components/Edit'

/**
   * 格式化所属机构树
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
  name: 'UserList',
  components: { STable, Detail, Add, Edit },
  data () {
    return {
      // 文件显示前缀
      fileDisplayPrefix: FILE_DISPLAY_PREFIX,
      // 文件上传地址
      uploadUrl: UPLOAD_URL + '/files',
      // 解析文件上传响应函数
      parseFileRespon: parseFileRespon,
      // 检查用户名唯一性
      checkUserName: checkUserName,
      // 检查工号唯一性
      checkWorkNum: checkWorkNum,
      // 保存方法
      save: save,
      // 修改方法
      update: update,
      // 日期工具类
      moment: moment,
      // 查询参数
      queryParam: {
        searchBeginTime: '',
        searchEndTime: ''
      },
      // 列表表头
      columns: [
        {
          title: '编码',
          dataIndex: 'userCode',
          key: 'userCode'
        }, {
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName'
        }, {
          title: '姓名',
          dataIndex: 'fullName',
          key: 'fullName'
        }, {
          title: '手机号',
          dataIndex: 'mobileNum',
          key: 'mobileNum'
        }, {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email'
        }, {
          title: '工号',
          dataIndex: 'workNum',
          key: 'workNum'
        }, {
          title: '角色',
          dataIndex: 'rolesName',
          key: 'rolesName'
        }, {
          title: '所属机构',
          dataIndex: 'srcOrgName',
          key: 'srcOrgName'
        }, {
          title: '状态',
          dataIndex: 'enabled',
          key: 'enabled',
          scopedSlots: { customRender: 'enabled' }
        }, {
          title: '入职时间',
          dataIndex: 'entryTime',
          key: 'entryTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '320px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 单个记录行
      recordActive: {},
      // 列表加载数据方法
      loadData: parameter => {
        if (!isEmpty(this.queryParam.enterDate) && Object.keys(this.queryParam.enterDate).length === 2) {
          this.queryParam.searchBeginTime = moment(this.queryParam.enterDate[0]).format('YYYY-MM-DD')
          this.queryParam.searchEndTime = moment(this.queryParam.enterDate[1]).format('YYYY-MM-DD')
        } else {
          this.queryParam.searchBeginTime = ''
          this.queryParam.searchEndTime = ''
        }
        return queryList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      },
      // 所属机构
      treeData: [],
      // 角色集合
      roles: [],
      rolesCondition: [{ value: '', label: '全部' }]
    }
  },
  created () {
    treeList().then((res) => {
      if (res.code === 10000) {
        formatTree(res.result)
        this.treeData = res.result
      }
    })
    roleList().then(res => {
      if (res.code === 10000) {
        const roles = res.result
        const _roleCondition = []
        if (roles.length > 0) {
          roles.forEach(r => {
            _roleCondition.push({ label: r.name, value: r.id })
          })
          this.rolesCondition = [...this.rolesCondition, ..._roleCondition]
        }
      }
    })
  },
  methods: {
    // 所属机构树过滤
    filterTreeNode (inputValue, treeNode) {
      return treeNode.data.props.title.indexOf(inputValue) > -1
    },
    // 启用 禁用 名称回显
    getEnableName (enableKey) {
      if (!isEmpty(enableKey)) {
        return enableKey ? '正常' : '禁用'
      }
      return ''
    },
    // 重置查询
    restQuery () {
      this.queryParam = {}
      this.$refs.userTable.refresh(true)
    },
    // 刷新列表
    refresh () {
      this.$refs.userTable.refresh()
    },
    // 打开详情
    handleDetail (record) {
      get(record).then(res => {
        if (res.code === 10000) {
          this.recordActive = res.result
          this.$refs.userDetail.show()
        }
      })
    },
    // 打开新增
    handleAdd () {
      this.recordActive = { userHeader: '' }
      roleList().then(res => {
        if (res.code === 10000) {
          this.roles = res.result
          this.$refs.userAdd.show()
        }
      })
    },
    // 打开更新
    handleUpdate (record) {
      get(record).then(res => {
        if (res.code === 10000) {
          this.recordActive = Object.assign({ userHeader: '' }, res.result)
          roleList().then(res => {
            if (res.code === 10000) {
              this.roles = res.result
              this.$refs.userEdit.show()
            }
          })
        }
      })
    },
    // 删除记录
    handleDelete (record) {
      const param = { id: record.id }
      del(param).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
        }
      })
    },
    // 禁用
    handleDisabled (record) {
      const param = { id: record.id, enabled: false }
      enabled(param).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
        }
      })
    },
    // 启用
    handleEnabled (record) {
      const param = { id: record.id, enabled: true }
      enabled(param).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
          this.refresh()
        }
      })
    },
    // 重置密码
    handleRestPassword (record) {
      const param = { id: record.id }
      resetPassword(param).then(res => {
        if (res.code === 10000) {
          this.$message.info(res.msg)
        }
      })
    }
  }
}
</script>
