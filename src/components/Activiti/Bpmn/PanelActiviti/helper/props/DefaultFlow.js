import { isEmpty } from '@/utils/common'
import {
  getBpmnFactory,
  getBusinessObject,
  getConnectType,
  getElementRegistry,
  getStartEventType
} from '../PropertyHelper'

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
    const sourceElement = getElementRegistry(modeler).get(sourceRef.id)
    const sourceBo = getBusinessObject(sourceElement)
    if (!isEmpty(propertyValue) && propertyValue instanceof Array && propertyValue.length > 0 && propertyValue[0] === true) {
      sourceBo.default = element
    } else {
      sourceBo.default = undefined
    }
    if (updateProperties) {
      const _property = {}
      _property.default = sourceBo.default
      updateProperties(modeler, sourceElement, _property)
    } else {
      return sourceBo.default
    }
  }
}

/**
 * 获取
 * @param element
 * @returns {*|null}
 */
export function getDefaultFlow (element) {
  if (element.businessObject && element.businessObject.sourceRef && element.businessObject.sourceRef.default && element.businessObject.sourceRef.default.id === element.id) {
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
  if (getConnectType(element)) {
    const bo = getBusinessObject(element)
    const sourceRef = bo.sourceRef
    if (sourceRef && sourceRef.$type !== 'bpmn:StartEvent') {
      return true
    }
  }
  return false
}
