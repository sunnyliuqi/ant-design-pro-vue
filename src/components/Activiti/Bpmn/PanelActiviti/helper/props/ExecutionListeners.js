import { createElement, getExtensionElements, removeByType } from '../PropertyHelper'
import setFields from './Fields'

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
  pushElementExecutionListeners(propertyValue, extensionElements, factory)
  _properties.extensionElements = extensionElements
}

/**
 *
 * @param propertyValue [{event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }]
 * @param element
 * @param factory
 */
function pushElementExecutionListeners (propertyValue, element, factory) {
  if (typeof (propertyValue) === 'string' && (propertyValue === '' || propertyValue.trim() === '')) {
    return
  }
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
  if (execution.event) {
    property.event = execution.event
  }
  if (execution.class) {
    property.class = execution.class
  }
  if (execution.expression) {
    property.expression = execution.expression
  }
  if (execution.delegateExpression) {
    property.delegateExpression = execution.delegateExpression
  }
  if (execution.fields && execution.fields.length > 0) {
    property.fields = []
  }
  const executionListenerElement = createElement('activiti:ExecutionListener', property, element, factory)
  if (execution.fields && execution.fields.length > 0) {
    setFields(executionListenerElement, execution.fields, executionListenerElement, factory)
  }
  return executionListenerElement
}
