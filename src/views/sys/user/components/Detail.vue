<template>
  <a-drawer
    wrapClassName="custom-drawer"
    title="详情"
    @close="onClose"
    :visible="detailVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-row :gutter="16">
      <a-col :lg="12" :md="24">
        <span class="detail-label">编码</span><span class="detail-content">{{ record.userCode }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">工号</span><span class="detail-content">{{ record.workNum }}</span>
      </a-col>
      <a-col :lg="12" :md="24" style="height: 100px">
        <span class="detail-label">员工头像</span><span class="detail-content"><img
          v-if="record.userHeader"
          :src="fileDisplayPrefix+record.userHeader"
          alt="员工头像"
          height="96"
          width="96"/>
        </span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">用户名</span><span class="detail-content">{{ record.userName }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">姓名</span><span class="detail-content">{{ record.fullName }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">身份证号</span><span class="detail-content">{{ record.idNum }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">手机号</span><span class="detail-content">{{ record.mobileNum }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">邮箱</span><span class="detail-content">{{ record.email }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">所属机构</span><span class="detail-content">{{ record.srcOrgName }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">岗位</span><span class="detail-content">{{ record.position }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">入职时间</span><span class="detail-content">{{ record.entryTime }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">状态</span><span class="detail-content">{{ record.enabled ? '正常' : '冻结' }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">超级管理员</span><span class="detail-content">{{ record.adminFlag === '1' ? '是' : '否' }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">用户角色</span><span class="detail-content">{{ record.rolesName }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">备注</span><span class="detail-content">{{ record.remark }}</span>
      </a-col>
    </a-row>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button
        :style="{marginRight: '8px'}"
        @click="onClose"
      >
        返回
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'UserDetail',
  props: {
    record: {
      type: [Object, String],
      default: ''
    },
    fileDisplayPrefix: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      detailVisible: false
    }
  },
  methods: {
    show () {
      this.detailVisible = true
    },
    onClose () {
      this.detailVisible = false
    }
  }
}
</script>

<style scoped>

</style>
