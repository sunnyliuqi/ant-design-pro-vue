import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 ResultVariableName 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setResultVariableName (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.resultVariableName = undefined
  } else {
    bo.resultVariableName = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.resultVariableName = bo.resultVariableName
    updateProperties(modeler, element, _property)
  } else {
    return bo.resultVariableName
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getResultVariableName (element) {
  return element.businessObject && element.businessObject.$attrs && element.businessObject.$attrs.resultVariableName
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportResultVariableName (element) {
  if (element.type.includes('ServiceTask')) {
    return true
  }
  return false
}
