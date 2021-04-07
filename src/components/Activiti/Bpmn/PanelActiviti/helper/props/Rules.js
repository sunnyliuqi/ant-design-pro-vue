import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Rules 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setRules (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.rules = undefined
  } else {
    bo.rules = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.rules = bo.rules
    updateProperties(modeler, element, _property)
  } else {
    return bo.rules
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getRules (element) {
  return element.businessObject && element.businessObject.$attrs && element.businessObject.$attrs.rules
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportRules (element) {
  if (element.type.includes('BusinessRuleTask')) {
    return true
  }
  return false
}
