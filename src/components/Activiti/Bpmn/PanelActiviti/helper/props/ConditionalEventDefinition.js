import { createElement, filterByType, getBusinessObject, getPropertyValue } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import { setFormalExpression, getFormalExpression } from './FormalExpression'
import {
  getIntermediateEventDefinitionType,
  getIntermediateEventType,
  getStartEventType
} from '../SupportPropertyHelper'
/**
 * 设置/创建 ConditionalEventDefinition 元素
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setConditionalEventDefinition (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.eventDefinitions = null
    _properties.documentation = null
    return
  }
    try {
      if (!(propertyValue instanceof Object)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('条件事件输入内容格式不正确，请重新输入')
    }
    if (propertyValue) {
      _properties.eventDefinitions = []
      _properties.eventDefinitions.push(createElementConditionalEventDefinition(propertyValue, element, factory))
    } else {
      _properties.eventDefinitions = null
    }
}
function createElementConditionalEventDefinition (conditional, element, factory) {
  const property = {}
  if (conditional.condition) {
    property.condition = {}
  }

  const conditionElement = createElement('bpmn:ConditionalEventDefinition', property, element, factory)
  property.condition = setFormalExpression(conditionElement, conditional.condition, conditionElement, factory)
  return conditionElement
}
/**
 * 获取
 * @param element
 */
export function getConditionalEventDefinition (element) {
  const eventDefinitions = getBusinessObject(element).eventDefinitions
  if (eventDefinitions && eventDefinitions.length > 0) {
    const properties = filterByType(eventDefinitions, 'bpmn:ConditionalEventDefinition')
    if (properties && properties.length > 0) {
      const property = properties[0]
      const conditionalEventDefinition = {}
      if (property.condition) {
        conditionalEventDefinition.condition = getFormalExpression(property.condition)
      }
      return JSON.stringify(conditionalEventDefinition)
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportConditionalEventDefinition (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'conditional') {
    return true
  }
  if (getIntermediateEventType(element) && getIntermediateEventDefinitionType(element) === 'conditional') {
    return true
  }
  return false
}
