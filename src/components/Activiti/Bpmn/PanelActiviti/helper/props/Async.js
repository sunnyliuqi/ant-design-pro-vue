import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Async 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setAsync (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.async = undefined
  } else {
    bo.async = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.async = bo.async
    updateProperties(modeler, element, _property)
  } else {
    return bo.async
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getAsync (element) {
  if (element.businessObject && element.businessObject.async === true) {
    return [true]
  }
  return [false]
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportAsync (element) {
  if (element.type.includes('Task')) {
    return true
  }
  return false
}
