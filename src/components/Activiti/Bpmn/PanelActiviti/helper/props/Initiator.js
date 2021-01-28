import { isEmpty } from '@/utils/common'
import { getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 Initiator 属性
 * @param propertyValue
 * @param element
 * @param factory
 * @param updateProperties
 */
export function setInitiator (propertyValue, element, factory, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.initiator = undefined
  } else {
    bo.initiator = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.initiator = bo.initiator
    updateProperties(element, _property)
  } else {
    return bo.initiator
  }
}

export function getInitiator (element) {
  return element.businessObject && element.businessObject.initiator
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportInitiator (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'none') {
    return true
  }
  return false
}
