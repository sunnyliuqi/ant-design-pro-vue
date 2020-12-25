<template>
  <a-card :bordered="false">
    <bpmn-design
    />
  </a-card>
</template>

<script>
  import BpmnDesign from '@/components/Activiti/Bpmn/BpmnDesign'
export default {
  name: 'Model',
  components: { BpmnDesign },
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
