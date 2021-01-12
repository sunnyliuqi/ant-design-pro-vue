import { isEmpty } from '@/utils/common'

/**
 * 设置/创建 FormKey 属性
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setFormKey (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.formKey = null
    return
  }
  _properties.formKey = propertyValue
}

export function getFormKey (element) {
  return element.businessObject && element.businessObject.formKey
}
