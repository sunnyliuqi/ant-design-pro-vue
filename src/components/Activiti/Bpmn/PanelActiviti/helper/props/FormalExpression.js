import { getBpmnFactory, createElement, getPropertyValue } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置 FormalExpression
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setFormalExpression (propertyValue, element, modeler, updateProperties) {
    if (isEmpty(propertyValue)) {
      return null
    }
    return createElementFormalExpression(propertyValue, element, modeler)
}

/**
 * 创建 FormalExpression 元素
 * @param field
 * @param parentElement
 * @param modeler
 * @returns {djs.model.Base}
 */
function createElementFormalExpression (value, parentElement, modeler) {
  const property = {}
  property.body = getPropertyValue(value)
  return createElement('bpmn:FormalExpression', property, parentElement, getBpmnFactory(modeler))
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
