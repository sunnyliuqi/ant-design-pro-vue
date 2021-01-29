import { isEmpty } from '@/utils/common'
import { setFormalExpression, getFormalExpression } from './FormalExpression'
import { getBpmnFactory, getBusinessObject, getConnectType } from '../PropertyHelper'

/**
 * 设置/创建 ConditionExpression 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setConditionExpression (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.conditionExpression = undefined
  } else {
    bo.conditionExpression = setFormalExpression(propertyValue, element, modeler, undefined)
  }
  if (updateProperties) {
    const _property = {}
    _property.conditionExpression = bo.conditionExpression
    updateProperties(modeler, element, _property)
  } else {
    return bo.conditionExpression
  }
}
/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getConditionExpression (element) {
  const conditionExpression = element.businessObject && element.businessObject.conditionExpression
  return getFormalExpression(conditionExpression)
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportConditionExpression (element) {
  return getConnectType(element)
}
