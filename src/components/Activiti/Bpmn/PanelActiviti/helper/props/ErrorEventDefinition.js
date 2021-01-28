import { createElement, filterByType, getBusinessObject, getPropertyValue, removeByType } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import {
  getEndEventType,
  getEventDefinitionType
} from '../SupportPropertyHelper'
/**
 * 设置/创建 ErrorEventDefinition 元素
 * @param propertyValue
 * @param element
 * @param factory
 * @param updateProperties
 */
export function setErrorEventDefinition (propertyValue, element, factory, updateProperties) {
  const bo = getBusinessObject(element)
  bo.eventDefinitions = removeByType(bo.eventDefinitions, 'bpmn:ErrorEventDefinition')
  if (!isEmpty(propertyValue)) {
    try {
      if (!(propertyValue instanceof Object)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('错误事件输入内容格式不正确，请重新输入')
    }
    if (propertyValue) {
      bo.eventDefinitions = []
      bo.eventDefinitions.push(createElementErrorEventDefinition(propertyValue, element, factory))
    }
  }
  if (!bo.eventDefinitions || bo.eventDefinitions.length < 1) {
    bo.eventDefinitions = undefined
  }
  if (updateProperties) {
    const _property = {}
    _property.eventDefinitions = bo.eventDefinitions
    updateProperties(element, _property)
  } else {
    return bo.eventDefinitions
  }
}
function createElementErrorEventDefinition (message, element, factory) {
  const property = {}
  property.errorRef = getPropertyValue(message.errorRef)
  return createElement('bpmn:ErrorEventDefinition', property, element, factory)
}
/**
 * 获取
 * @param element
 */
export function getErrorEventDefinition (element) {
  const eventDefinitions = getBusinessObject(element).eventDefinitions
  if (eventDefinitions && eventDefinitions.length > 0) {
    const properties = filterByType(eventDefinitions, 'bpmn:ErrorEventDefinition')
    if (properties && properties.length > 0) {
      const property = properties[0]
      const errorRefEventDefinition = {}
      if (property.errorRef) {
        errorRefEventDefinition.errorRef = property.errorRef
      }
      return JSON.stringify(errorRefEventDefinition)
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportErrorEventDefinition (element) {
  if (getEndEventType(element) && getEventDefinitionType(element) === 'error') {
    return true
  }
  return false
}
