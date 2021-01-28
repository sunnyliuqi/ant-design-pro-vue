import { createElement, filterByType, getBusinessObject, removeByType } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import { setFormalExpression, getFormalExpression } from './FormalExpression'
import {
  getEventDefinitionType,
  getIntermediateEventType,
  getStartEventType
} from '../SupportPropertyHelper'
/**
 * 设置/创建 ConditionalEventDefinition 元素
 * @param propertyValue
 * @param element
 * @param factory
 * @param updateProperties
 */
export function setConditionalEventDefinition (propertyValue, element, factory, updateProperties) {
  const bo = getBusinessObject(element)
  bo.eventDefinitions = removeByType(bo.eventDefinitions, 'bpmn:ConditionalEventDefinition')
  if (!isEmpty(propertyValue)) {
    try {
      if (!(propertyValue instanceof Object)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('条件事件输入内容格式不正确，请重新输入')
    }
    if (propertyValue) {
      bo.eventDefinitions = []
      bo.eventDefinitions.push(createElementConditionalEventDefinition(propertyValue, element, factory))
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
function createElementConditionalEventDefinition (conditional, element, factory) {
  const property = {}
  if (conditional.condition) {
    property.condition = {}
  }

  const conditionElement = createElement('bpmn:ConditionalEventDefinition', property, element, factory)
  conditionElement.condition = setFormalExpression(conditional.condition, conditionElement, factory, undefined)
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
  if (getIntermediateEventType(element) && getEventDefinitionType(element) === 'conditional') {
    return true
  }
  return false
}
