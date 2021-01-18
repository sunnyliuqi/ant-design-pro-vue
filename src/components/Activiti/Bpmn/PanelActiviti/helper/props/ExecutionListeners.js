import {
  createElement,
  getExtensionElements,
  getPropertyValue,
  removeByType,
  filterByType,
  getBusinessObject
} from '../PropertyHelper'
import { setFields, getFields } from './Fields'
import { isEmpty } from '@/utils/common'
import {
  getIntermediateEventDefinitionType,
  getIntermediateEventType
} from '../SupportPropertyHelper'

/**
 * 设置ExecutionListeners
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setExecutionListeners (_properties, propertyValue, element, factory) {
  let extensionElements = getExtensionElements(element, factory)
  extensionElements.values = removeByType(extensionElements.values, 'activiti:ExecutionListener')
  if (!isEmpty(propertyValue)) {
    pushElementExecutionListeners(propertyValue, extensionElements, factory)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    extensionElements = null
  }
  _properties.extensionElements = extensionElements
}

/**
 *
 * @param propertyValue [{event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }]
 * @param element
 * @param factory
 */
function pushElementExecutionListeners (propertyValue, element, factory) {
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('执行监听器内容格式不正确，请重新输入')
  }
  if (propertyValue && propertyValue.length > 0) {
    propertyValue.forEach(execution => {
      element.values.push(createElementExecutionListener(execution, element, factory))
    })
  }
}

/**
 * 创建ExecutionListener 元素
 * @param execution {event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }
 * @param element
 * @param factory
 */
function createElementExecutionListener (execution, element, factory) {
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
  const executionListenerElement = createElement('activiti:ExecutionListener', property, element, factory)
  if (execution.fields && execution.fields.length > 0) {
    setFields(executionListenerElement, execution.fields, executionListenerElement, factory)
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
  const intermediateCatchEventType = getIntermediateEventDefinitionType(element)
  if (getIntermediateEventType(element) && intermediateCatchEventType === 'none' || intermediateCatchEventType === 'message' || intermediateCatchEventType === 'timer') {
    return true
  }
  return false
}
