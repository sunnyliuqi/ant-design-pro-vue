import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Priority 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setPriority (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.priority = undefined
  } else {
    bo.priority = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.priority = bo.priority
    updateProperties(modeler, element, _property)
  } else {
    return bo.priority
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getPriority (element) {
  return element.businessObject && element.businessObject.priority
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportPriority (element) {
  if (element.type.includes('UserTask')) {
    return true
  }
  return false
}
