import { getBpmnFactory, createElement, filterByType, getBusinessObject, getPropertyValue, removeByType, getEndEventType,
  getEventDefinitionType,
  getIntermediateEventType,
  getStartEventType } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 SignalEventDefinition 元素
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setSignalEventDefinition (propertyValue, element, modeler, updateProperties) {
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
      bo.eventDefinitions.push(createElementSignalEventDefinition(propertyValue, element, modeler))
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
function createElementSignalEventDefinition (message, element, modeler) {
  const property = {}
  property.signalRef = getPropertyValue(message.signalRef)
  return createElement('bpmn:SignalEventDefinition', property, element, getBpmnFactory(modeler))
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
      if (Object.keys(signalRefEventDefinition).length > 0) {
        return JSON.stringify(signalRefEventDefinition)
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
export function isSupportSignalEventDefinition (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'signal') {
    return true
  }
  if ((getIntermediateEventType(element) || getEndEventType(element)) && getEventDefinitionType(element) === 'signal') {
    return true
  }
  return false
}
