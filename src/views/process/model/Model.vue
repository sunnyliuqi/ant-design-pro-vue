<template>
  <a-card :bordered="false">
    <bpmn-design
      :xml="xml"
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
      xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="process1567044459787" name="process15670444597879">
    <bpmn2:documentation>66</bpmn2:documentation>
    <bpmn2:startEvent id="Event_12q4srm">
      <bpmn2:documentation>s66</bpmn2:documentation>
    </bpmn2:startEvent>
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process1567044459787">
      <bpmndi:BPMNShape id="Event_12q4srm_di" bpmnElement="Event_12q4srm">
        <dc:Bounds x="522" y="332" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`
    }
  }
}
</script>

<style scoped>

</style>
