import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getEventSubProcessType, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 IsForCompensation 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setIsForCompensation (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.isForCompensation = undefined
  } else {
    bo.isForCompensation = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.isForCompensation = bo.isForCompensation
    updateProperties(modeler, element, _property)
  } else {
    return bo.isForCompensation
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getIsForCompensation (element) {
  if (element.businessObject && element.businessObject.isForCompensation === true) {
    return [true]
  }
  return [false]
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportIsForCompensation (element) {
  if (element.type.includes('Task')) {
    return true
  }
  if (getEventSubProcessType(element)) {
    return true
  }
  return false
}
