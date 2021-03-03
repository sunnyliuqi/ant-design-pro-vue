<template>
  <a-drawer
    wrapClassName="custom-drawer"
    :maskClosable="false"
    title="查看模型"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-divider orientation="left">
      基础信息
    </a-divider>
    <a-row :gutter="16">
      <a-col :lg="12" :md="24">
        <span class="detail-label">模型名称</span><span class="detail-content">{{ record.name }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">key</span><span class="detail-content">{{ record.modelKey }}</span>
      </a-col>
      <a-col :lg="12" :md="24">
        <span class="detail-label">版本</span><span class="detail-content">{{ record.version }}</span>
      </a-col>
      <a-col :span="24">
        <span class="detail-label">描述</span><span class="detail-content" style="height: auto;vertical-align: text-top;">{{ record.description }}</span>
      </a-col>
      <a-col :span="24">
        <span class="detail-label">备注</span><span class="detail-content" style="height: auto;vertical-align: text-top;">{{ record.modelComment }}</span>
      </a-col>
    </a-row>
    <a-divider orientation="left">
      模型信息
    </a-divider>
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
import ACol from 'ant-design-vue/es/grid/Col'
export default {
  name: 'ModelDetail',
  components: { ACol },
  props: {
    record: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
  },
  methods: {
    show () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
