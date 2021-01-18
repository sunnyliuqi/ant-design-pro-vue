import { createElement, filterByType, getBusinessObject, getPropertyValue, removeByType } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import {
  getIntermediateEventDefinitionType,
  getIntermediateEventType,
  getStartEventType
} from '../SupportPropertyHelper'
/**
 * 设置/创建 SignalEventDefinition 元素
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setSignalEventDefinition (_properties, propertyValue, element, factory) {
  const bo = getBusinessObject(element)
  bo.eventDefinitions = removeByType(bo.eventDefinitions, 'bpmn:SignalEventDefinition')
  if (!isEmpty(propertyValue)) {
    try {
      if (!(propertyValue instanceof Object)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('信号事件选择内容格式不正确，请重新输入')
    }
    if (propertyValue) {
      bo.eventDefinitions = []
      bo.eventDefinitions.push(createElementSignalEventDefinition(propertyValue, element, factory))
    }
  }
   _properties.eventDefinitions = bo.eventDefinitions
}
function createElementSignalEventDefinition (message, element, factory) {
  const property = {}
  property.signalRef = getPropertyValue(message.signalRef)
  return createElement('bpmn:SignalEventDefinition', property, element, factory)
}
/**
 * 获取
 * @param element
 */
export function getSignalEventDefinition (element) {
  const eventDefinitions = getBusinessObject(element).eventDefinitions
  if (eventDefinitions && eventDefinitions.length > 0) {
    const properties = filterByType(eventDefinitions, 'bpmn:SignalEventDefinition')
    if (properties && properties.length > 0) {
      const property = properties[0]
      const signalRefEventDefinition = {}
      if (property.signalRef) {
        signalRefEventDefinition.signalRef = property.signalRef
      }
      return JSON.stringify(signalRefEventDefinition)
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportSignalEventDefinition (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'signal') {
    return true
  }
  if (getIntermediateEventType(element) && getIntermediateEventDefinitionType(element) === 'signal') {
    return true
  }
  return false
}
