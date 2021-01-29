import { isEmpty } from '@/utils/common'
import { getBpmnFactory, getBusinessObject, getConnectType } from '../PropertyHelper'

/**
 * 设置/创建 DefaultFlow 属性
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setDefaultFlow (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  const sourceRef = bo.sourceRef
  if (sourceRef) {
    if (!isEmpty(propertyValue) && propertyValue instanceof Array && propertyValue.length > 0 && propertyValue[0] === true) {
      sourceRef.default = element.id
    } else {
      sourceRef.default = undefined
    }
    if (updateProperties) {
      const _property = {}
      _property.default = sourceRef.default
      updateProperties(modeler, sourceRef, _property)
    } else {
      return sourceRef.default
    }
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getDefaultFlow (element) {
  if (element.businessObject && element.businessObject.sourceRef && element.businessObject.sourceRef.default && element.businessObject.sourceRef.default === element.id) {
    return [true]
  } else {
    return [false]
  }
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportDefaultFlow (element) {
  return getConnectType(element)
}
