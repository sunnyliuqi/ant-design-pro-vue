import { isEmpty } from '@/utils/common'

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
