import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 FormKey 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setFormKey (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.formKey = undefined
  } else {
    bo.formKey = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.formKey = bo.formKey
    updateProperties(modeler, element, _property)
  } else {
    return bo.formKey
  }
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
  if (element.type.includes('UserTask')) {
    return true
  }
  return false
}
