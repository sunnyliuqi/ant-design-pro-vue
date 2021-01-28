import { isEmpty } from '@/utils/common'
import { getBusinessObject, getConnectType } from '../PropertyHelper'

/**
 * 设置/创建 DefaultFlow 属性
 * @param propertyValue
 * @param element
 * @param factory
 * @param updateProperties
 */
export function setDefaultFlow (propertyValue, element, factory, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.default = undefined
  } else {
    bo.default = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.default = bo.default
    // updateProperties(element, _property)
  } else {
    return bo.default
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getDefaultFlow (element) {
  if (element.businessObject && element.businessObject.default) {
    return true
  } else {
    return false
  }
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportDefaultFlow (element) {
  return getConnectType(element)
}
