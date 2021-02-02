import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Exclude 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setExclude (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.exclude = undefined
  } else {
    bo.exclude = propertyValue[0]
  }
  if (updateProperties) {
    const _property = {}
    _property.exclude = bo.exclude
    updateProperties(modeler, element, _property)
  } else {
    return bo.exclude
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getExclude (element) {
  if (element.businessObject && element.businessObject.$attrs && element.businessObject.$attrs.exclude === 'true') {
    return [true]
  }
  return [false]
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportExclude (element) {
  if (element.type.includes('BusinessRuleTask')) {
    return true
  }
  return false
}
