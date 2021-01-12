import { createElement, getExtensionElements, getPropertyValue, removeByType } from '../PropertyHelper'
import setFields from './Fields'
import { isEmpty } from '@/utils/common'

/**
 * 设置ExecutionListeners
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export default function setExecutionListeners (_properties, propertyValue, element, factory) {
  const extensionElements = getExtensionElements(element, factory)
  extensionElements.values = removeByType(extensionElements.values, 'activiti:ExecutionListener')
  if (!isEmpty(propertyValue)) {
    pushElementExecutionListeners(propertyValue, extensionElements, factory)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    _properties.extensionElements = null
  } else {
    _properties.extensionElements = extensionElements
  }
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
