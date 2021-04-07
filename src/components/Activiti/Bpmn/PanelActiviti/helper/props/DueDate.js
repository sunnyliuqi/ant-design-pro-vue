import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 DueDate 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setDueDate (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.dueDate = undefined
  } else {
    bo.dueDate = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.dueDate = bo.dueDate
    updateProperties(modeler, element, _property)
  } else {
    return bo.dueDate
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getDueDate (element) {
  return element.businessObject && element.businessObject.dueDate
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportDueDate (element) {
  if (element.type.includes('UserTask')) {
    return true
  }
  return false
}
