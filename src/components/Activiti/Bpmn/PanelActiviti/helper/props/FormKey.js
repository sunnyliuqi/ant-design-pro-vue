import { isEmpty } from '@/utils/common'
import { getStartEventType } from '../SupportPropertyHelper'

/**
 * 设置/创建 FormKey 属性
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setFormKey (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.formKey = undefined
    return
  }
  _properties.formKey = propertyValue
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getFormKey (element) {
  return element.businessObject && element.businessObject.formKey
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportFormKey (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'none') {
    return true
  }
  return false
}
