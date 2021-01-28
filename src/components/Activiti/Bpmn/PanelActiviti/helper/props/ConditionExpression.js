import { isEmpty } from '@/utils/common'
import { setFormalExpression, getFormalExpression } from './FormalExpression'
import { createElement, getBusinessObject, getPropertyValue } from '../PropertyHelper'

/**
 * 设置/创建 ConditionExpression 属性
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setConditionExpression (_properties, propertyValue, element, factory) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.conditionExpression = undefined
  } else {
  bo.conditionExpression = setFormalExpression(element, propertyValue, element, factory)
  }
  _properties.conditionExpression = bo.conditionExpression
}
/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getConditionExpression (element) {
  const conditionExpression = element.businessObject && element.businessObject.conditionExpression
  return getFormalExpression(conditionExpression)
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportConditionExpression (element) {
  if (element.type === 'bpmn:SequenceFlow') {
    return true
  }
  return false
}
