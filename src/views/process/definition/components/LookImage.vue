<template>
  <a-drawer
    wrapClassName="custom-drawer custom-drawer-8"
    title="流程定义图"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-row :gutter="16">
      <a-col :span="24">
        <view-bpmn-design
          v-if="xml"
          ref="viewBpmnDesign"
          :xml="xml"
        />
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
  import { ViewBpmnDesign } from '@/components/Activiti/Bpmn'
export default {
  name: 'LookImage',
  components: {
    ViewBpmnDesign
  },
  props: {
    xml: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      visible: false
    }
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
