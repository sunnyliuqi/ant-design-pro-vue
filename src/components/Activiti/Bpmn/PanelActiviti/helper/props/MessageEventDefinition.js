import { getBpmnFactory, createElement, filterByType, getBusinessObject, getPropertyValue, removeByType, getEventDefinitionType,
  getIntermediateEventType,
  getStartEventType,
  getEndEventType } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 MessageEventDefinition 元素
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setMessageEventDefinition (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  bo.eventDefinitions = removeByType(bo.eventDefinitions, 'bpmn:MessageEventDefinition')
  if (!isEmpty(propertyValue)) {
    try {
      if (!(propertyValue instanceof Object)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('消息事件选择内容格式不正确，请重新输入')
    }
    if (propertyValue) {
      bo.eventDefinitions = []
      bo.eventDefinitions.push(createElementMessageEventDefinition(propertyValue, element, modeler))
    }
  }
  if (!bo.eventDefinitions || bo.eventDefinitions.length < 1) {
    bo.eventDefinitions = undefined
  }
  if (updateProperties) {
    const _property = {}
    _property.eventDefinitions = bo.eventDefinitions
    updateProperties(modeler, element, _property)
  } else {
    return bo.eventDefinitions
  }
}
function createElementMessageEventDefinition (message, element, modeler) {
  const property = {}
  property.messageRef = getPropertyValue(message.messageRef)
  return createElement('bpmn:MessageEventDefinition', property, element, getBpmnFactory(modeler))
}
/**
 * 获取
 * @param element
 */
export function getMessageEventDefinition (element) {
  const eventDefinitions = getBusinessObject(element).eventDefinitions
  if (eventDefinitions && eventDefinitions.length > 0) {
    const properties = filterByType(eventDefinitions, 'bpmn:MessageEventDefinition')
    if (properties && properties.length > 0) {
      const property = properties[0]
      const messageEventDefinition = {}
      if (property.messageRef) {
        messageEventDefinition.messageRef = property.messageRef
      }
      if (Object.keys(messageEventDefinition).length > 0) {
        return JSON.stringify(messageEventDefinition)
      }
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportMessageEventDefinition (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'message') {
    return true
  }
  if ((getIntermediateEventType(element) || getEndEventType(element)) && getEventDefinitionType(element) === 'message') {
    return true
  }
  return false
}
