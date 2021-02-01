import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 ResultVariables 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setResultVariables (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.resultVariables = undefined
  } else {
    bo.resultVariables = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.resultVariables = bo.resultVariables
    updateProperties(modeler, element, _property)
  } else {
    return bo.resultVariables
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getResultVariables (element) {
  return element.businessObject && element.businessObject.$attrs && element.businessObject.$attrs.resultVariables
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportResultVariables (element) {
  if (element.type.includes('BusinessRuleTask')) {
    return true
  }
  return false
}
