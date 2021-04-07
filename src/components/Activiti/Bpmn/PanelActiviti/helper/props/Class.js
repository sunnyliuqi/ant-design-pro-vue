import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Class 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setClass (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.class = undefined
  } else {
    bo.class = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.class = bo.class
    updateProperties(modeler, element, _property)
  } else {
    return bo.class
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getClass (element) {
  return element.businessObject && element.businessObject.class
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportClass (element) {
  if (element.type.includes('ServiceTask')) {
    return true
  }
  return false
}
