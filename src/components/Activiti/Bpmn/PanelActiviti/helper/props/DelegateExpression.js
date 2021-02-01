import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getStartEventType } from '../PropertyHelper'

/**
 * 设置/创建 DelegateExpression 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setDelegateExpression (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.delegateExpression = undefined
  } else {
    bo.delegateExpression = propertyValue
  }
  if (updateProperties) {
    const _property = {}
    _property.delegateExpression = bo.delegateExpression
    updateProperties(modeler, element, _property)
  } else {
    return bo.delegateExpression
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getDelegateExpression (element) {
  return element.businessObject && element.businessObject.delegateExpression
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportDelegateExpression (element) {
  if (element.type.includes('ServiceTask')) {
    return true
  }
  return false
}
