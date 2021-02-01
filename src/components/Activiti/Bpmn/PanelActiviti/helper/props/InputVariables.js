import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 InputVariables 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setInputVariables (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.ruleVariablesInput = undefined
  } else {
    bo.ruleVariablesInput = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.ruleVariablesInput = bo.ruleVariablesInput
    updateProperties(modeler, element, _property)
  } else {
    return bo.ruleVariablesInput
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getInputVariables (element) {
  return element.businessObject && element.businessObject.$attrs && element.businessObject.$attrs.ruleVariablesInput
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportInputVariables (element) {
  if (element.type.includes('BusinessRuleTask')) {
    return true
  }
  return false
}
