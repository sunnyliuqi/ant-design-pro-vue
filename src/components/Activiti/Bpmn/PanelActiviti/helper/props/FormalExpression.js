import { createElement, getPropertyValue } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置 FormalExpression
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setFormalExpression (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    return null
  }
  return createElementFormalExpression(propertyValue, element, factory)
}

/**
 * 创建 FormalExpression 元素
 * @param field
 * @param parentElement
 * @param factory
 * @returns {djs.model.Base}
 */
function createElementFormalExpression (value, parentElement, factory) {
  const property = {}
  property.body = getPropertyValue(value)
  return createElement('bpmn:FormalExpression', property, parentElement, factory)
}
/**
 * 获取
 * @param element
 */
export function getFormalExpression (element) {
  if (element) {
      return element.body
  }
  return undefined
}
