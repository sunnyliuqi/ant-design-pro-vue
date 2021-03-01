export function emptyBpmn (key, name, description) {
    const _key = getKey(key)
    const _name = getName(name)
    const _description = getDescription(description)
    return `
    <?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="${_key}" ${_name}/>
  ${_description}
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${_key}" />
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
    `
}
function getKey (key) {
    if (!key) {
        return `process${Date.parse(new Date()).toString()}`
    }
    return key
}
function getName (name) {
    if (!name) {
        return ''
    }
    return `name="${name}"`
}
function getDescription (description) {
    if (!description) {
        return ''
    }
    return `<bpmn2:documentation>${description}</bpmn2:documentation>`
}
