import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Expression 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setExpression (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.expression = undefined
  } else {
    bo.expression = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.expression = bo.expression
    updateProperties(modeler, element, _property)
  } else {
    return bo.expression
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getExpression (element) {
  return element.businessObject && element.businessObject.expression
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportExpression (element) {
  if (element.type.includes('ServiceTask')) {
    return true
  }
  return false
}
