<template>
  <a-drawer
    wrapClassName="custom-drawer"
    :maskClosable="false"
    title="查看表单"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-divider orientation="left">
      基础信息
    </a-divider>
    <a-row :gutter="16">
      <a-col :lg="12" :md="24">
        <span class="detail-label">表单名称</span><span class="detail-content">{{ record.name }}</span>
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
      表单信息
    </a-divider>
    <view-form-design
      ref="vformDesign"
      :drawing-list="record.drawingList"
      :drawing-button-list="record.drawingButtonList"
    />
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
import { ViewFormDesign } from '@/components/Activiti/FormDesign'
export default {
  name: 'FormDetail',
  components: { ACol, ViewFormDesign },
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
      customActiveKey: '1',
      visible: false
    }
  },
  computed: {
  },
  methods: {
    callback (key) {
      this.customActiveKey = key
    },
    show () {
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.customActiveKey = '1'
    }
  }
}
</script>

<style scoped>

</style>
