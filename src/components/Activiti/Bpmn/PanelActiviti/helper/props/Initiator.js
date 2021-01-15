import { isEmpty } from '@/utils/common'
import { getStartEventType } from '../SupportPropertyHelper'

/**
 * 设置/创建 Initiator 属性
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setInitiator (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.initiator = null
    return
  }
  _properties.initiator = propertyValue
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
