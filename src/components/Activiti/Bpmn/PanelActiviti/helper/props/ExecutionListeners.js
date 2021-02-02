import {
  getBpmnFactory, createElement,
  getExtensionElements,
  getPropertyValue,
  removeByType,
  filterByType,
  getBusinessObject,
  getConnectType,
  getEventDefinitionType,
  getIntermediateEventType
} from '../PropertyHelper'
import { setFields, getFields } from './Fields'
import { isEmpty } from '@/utils/common'

/**
 * 设置ExecutionListeners
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setExecutionListeners (propertyValue, element, modeler, updateProperties) {
  let extensionElements = getExtensionElements(element, getBpmnFactory(modeler))
  extensionElements.values = removeByType(extensionElements.values, 'activiti:ExecutionListener')
  if (!isEmpty(propertyValue)) {
    pushElementExecutionListeners(propertyValue, extensionElements, modeler)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    extensionElements = null
  }
  if (updateProperties) {
   const _property = {}
    _property.extensionElements = extensionElements
    updateProperties(modeler, element, _property)
  } else {
    return extensionElements
  }
}

/**
 *
 * @param propertyValue [{event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }]
 * @param element
 * @param modeler
 */
function pushElementExecutionListeners (propertyValue, element, modeler) {
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('执行监听器内容格式不正确，请重新输入')
  }
  if (propertyValue && propertyValue.length > 0) {
    propertyValue.forEach(execution => {
      element.values.push(createElementExecutionListener(execution, element, modeler))
    })
  }
}

/**
 * 创建ExecutionListener 元素
 * @param execution {event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }
 * @param element
 * @param modeler
 */
function createElementExecutionListener (execution, element, modeler) {
  const property = {}
  property.event = getPropertyValue(execution.event)
  property.class = getPropertyValue(execution.class)
  property.expression = getPropertyValue(execution.expression)
  property.delegateExpression = getPropertyValue(execution.delegateExpression)
  if (execution.fields && execution.fields.length > 0) {
    property.fields = []
  } else {
    property.fields = null
  }
  const executionListenerElement = createElement('activiti:ExecutionListener', property, element, getBpmnFactory(modeler))
  if (execution.fields && execution.fields.length > 0) {
    executionListenerElement.fields = setFields(execution.fields, executionListenerElement, modeler, undefined)
  }
  return executionListenerElement
}
/**
 * 获取
 * @param element
 */
export function getExecutionListeners (element) {
  const extensionElements = getBusinessObject(element).extensionElements
  if (extensionElements) {
    const executionListenerElements = filterByType(extensionElements.values, 'activiti:ExecutionListener')
    if (executionListenerElements && executionListenerElements.length > 0) {
      const executionListeners = []
      executionListenerElements.forEach(property => {
        const execution = {}
        if (property.event) {
          execution.event = property.event
        }
        if (property.class) {
          execution.class = property.class
        }
        if (property.expression) {
          execution.expression = property.expression
        }
        if (property.delegateExpression) {
          execution.delegateExpression = property.delegateExpression
        }
        if (property.fields && property.fields.length > 0) {
          execution.fields = getFields(property.fields)
        }
        executionListeners.push(execution)
      })
      return JSON.stringify(executionListeners)
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportExecutionListeners (element) {
  if (element.type === 'bpmn:StartEvent') {
    return true
  }
  const intermediateCatchEventType = getEventDefinitionType(element)
  if (getIntermediateEventType(element) && intermediateCatchEventType === 'none' || intermediateCatchEventType === 'message' || intermediateCatchEventType === 'timer') {
    return true
  }
  if (getConnectType(element)) {
    return true
  }
  if (element.type.includes('Task')) {
    return true
  }
  if (element.type === 'bpmn:SubProcess') {
    return true
  }
  return false
}
