import { createElement, filterByType, getBusinessObject, getPropertyValue } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 SignalEventDefinition 元素
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setSignalEventDefinition (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.eventDefinitions = null
    return
  }
    try {
      if (!(propertyValue instanceof Object)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('信号事件选择内容格式不正确，请重新输入')
    }
    if (propertyValue) {
      _properties.eventDefinitions = []
      _properties.eventDefinitions.push(createElementSignalEventDefinition(propertyValue, element, factory))
    } else {
      _properties.eventDefinitions = null
    }
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
