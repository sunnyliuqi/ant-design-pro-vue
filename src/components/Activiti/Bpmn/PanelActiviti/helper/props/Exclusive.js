import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Exclusive 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setExclusive (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (!propertyValue) {
    bo.exclusive = undefined
  } else if (!isEmpty(propertyValue) && propertyValue instanceof Array && propertyValue.length > 0 && propertyValue[0] === true) {
    bo.exclusive = undefined
  } else {
    bo.exclusive = false
  }
  if (updateProperties) {
    const _property = {}
    _property.exclusive = bo.exclusive
    updateProperties(modeler, element, _property)
  } else {
    return bo.exclusive
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getExclusive (element) {
  if (element.businessObject && element.businessObject.exclusive === true) {
    return [true]
  }
  return [false]
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportExclusive (element) {
  if (element.type.includes('Task')) {
    return true
  }
  return false
}
