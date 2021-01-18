import { isEmpty } from '@/utils/common'
import { getStartEventType } from '../SupportPropertyHelper'
import { getBusinessObject } from '../PropertyHelper'

/**
 * 设置/创建 Initiator 属性
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setInitiator (_properties, propertyValue, element, factory) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.initiator = undefined
    _properties.initiator = bo.initiator
    return
  }
  bo.initiator = propertyValue
  _properties.initiator = bo.initiator
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
