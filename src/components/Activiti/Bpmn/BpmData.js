/**
 * 存储流程设计相关参数
 */
export default class BpmData {
  constructor () {
    this.controls = [] // 设计器控件
    this.defaultXml = ''// 默认xml
    this.init()
  }

  init () {
    this.controls = [
      {
        action: 'hand-tool',
        title: '选择'
      },
      {
        action: 'lasso-tool',
        title: '套索'
      },
      {
        action: 'space-tool',
        title: '空间'
      },
      {
        action: 'global-connect-tool',
        title: '全选'
      },
      {
        action: 'create.start-event',
        title: '开始'
      },
      {
        action: 'create.intermediate-event',
        title: '中间/边界'
      },
      {
        action: 'create.end-event',
        title: '结束'
      },
      {
        action: 'create.exclusive-gateway',
        title: '网关'
      },
      {
        action: 'create.task',
        title: '任务'
      },
      {
        action: 'create.subprocess-expanded',
        title: '子流程'
      },
      {
        action: 'create.data-object',
        title: '数据对象'
      },
      {
        action: 'create.data-store',
        title: '数据存储'
      },
      {
        action: 'create.participant-expanded',
        title: '泳池泳道'
      },
      {
        action: 'create.group',
        title: '分组'
      }
    ]
    this.defaultXml = `
    <?xml version="1.0" encoding="UTF-8"?>
      <bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
        <bpmn2:process id="process1567044459787" name="process1567044459787">
          <bpmn2:documentation>描述</bpmn2:documentation>
          <bpmn2:startEvent id="StartEvent_1" name="开始"/>
        </bpmn2:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process1567044459787">
            <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
              <dc:Bounds x="184" y="64" width="36" height="36"/>
              <bpmndi:BPMNLabel>
                <dc:Bounds x="191" y="40" width="22" height="14"/>
              </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn2:definitions>
    `
  }
  //  获取控件配置信息
  getControl (action) {
    const result = this.controls.filter(item => item.action === action)
    return result[0] || {}
  }
}
