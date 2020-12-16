<template>
  <a-drawer
    wrapClassName="custom-drawer"
    title="详情"
    @close="onClose"
    :visible="detailVisible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-row :gutter="16">
      <a-col :span="24">
        <span class="detail-label">操作人</span><span class="detail-content">{{ record.operationPerson }}</span>
      </a-col>
      <a-col :span="24">
        <span class="detail-label">api请求数据</span><span class="detail-content">{{ record.requestData }}</span>
      </a-col>
      <a-col :span="24">
        <span class="detail-label">API名称</span><span class="detail-content">{{ record.name }}</span>
      </a-col>
      <a-col :span="24">
        <span class="detail-label">api响应数据</span><span class="detail-content" style="height: auto;">{{ record.responseData }}</span>
      </a-col>
      <a-col :span="24">
        <span class="detail-label">路径</span><span class="detail-content">{{ record.path }}</span>
      </a-col>
      <a-col :span="24">
        <span class="detail-label">请求方法</span><span class="detail-content">{{ record.requestMethod }}</span>
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
  name: 'LogDetail',
  props: {
    record: {
      type: [Object, String],
      default: ''
    },
    formatDate: {
      type: Function,
      default: undefined
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
