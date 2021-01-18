import { isEmpty } from '@/utils/common'
import { getStartEventType } from '../SupportPropertyHelper'
import { getBusinessObject } from '@/components/Activiti/Bpmn/PanelActiviti/helper/PropertyHelper'

/**
 * 设置/创建 FormKey 属性
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setFormKey (_properties, propertyValue, element, factory) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.formKey = undefined
    _properties.formKey = bo.formKey
    return
  }
  bo.formKey = propertyValue
  _properties.formKey = bo.formKey
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
