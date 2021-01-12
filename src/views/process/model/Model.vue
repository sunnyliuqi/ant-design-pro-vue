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
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:activiti="http://activiti.org/bpmn" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="process1567044459787" name="process15670444597879" author="111" version="1111">
    <bpmn2:documentation>663</bpmn2:documentation>
    <bpmn2:extensionElements>
      <activiti:executionListener expression="2" class="2" delegateExpression="2" event="start">
        <activiti:field name="1" stringValue="2">
          <activiti:expression>d</activiti:expression>
          <activiti:string>c</activiti:string>
        </activiti:field>
      </activiti:executionListener>
      <activiti:eventListener events="ENTITY_DELETE" throwEvent="signal" signalName="theSignal" errorCode="123" messageName="theMessage" class="org.test.TestClass" delegateExpression="myListener" entityType="job" />
    </bpmn2:extensionElements>
    <bpmn2:startEvent id="Event_12q4srm" name="开始" activiti:initiator="1121" activiti:formKey="2232">
      <bpmn2:documentation>77</bpmn2:documentation>
      <bpmn2:extensionElements>
      <activiti:executionListener expression="s2" class="s2" delegateExpression="s2" event="start">
        <activiti:field name="s1" stringValue="s2">
          <activiti:expression>sd</activiti:expression>
          <activiti:string>sc</activiti:string>
        </activiti:field>
      </activiti:executionListener>
      <activiti:formProperty id="fid" name="2" type="long" required="true" readable="true" writable="true" variable="fvariable" expression="fexpression" datePattern="yyyy-HH-mm" default="2021-01-12">
          <activiti:value id="v1" name="v11">v111</activiti:value>
          <activiti:value id="v2" name="v22">v222</activiti:value>
        </activiti:formProperty>
    </bpmn2:extensionElements>
    </bpmn2:startEvent>
    <activiti:signal id="theSignal" name="The Signal" scop="processInstance" />
    <activiti:signal id="theSignal2" name="The Signal2" scop="processInstance2" />
    <activiti:message id="theMessage" name="The Message" />
    <activiti:message id="theMessage2" name="The Message2" />
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
