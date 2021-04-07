import {
  getBpmnFactory, createElement,
  getExtensionElements,
  removeByType, filterByType,
  getPropertyValue, getBusinessObject
} from '../PropertyHelper'
import { setFields, getFields } from './Fields'
import { isEmpty } from '@/utils/common'
/**
 * 设置 ServiceFields
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setServiceFields (propertyValue, element, modeler, updateProperties) {
  let extensionElements = getExtensionElements(element, getBpmnFactory(modeler))
  extensionElements.values = removeByType(extensionElements.values, 'activiti:Field')
  if (!isEmpty(propertyValue)) {
    pushElementServiceFields(propertyValue, extensionElements, modeler)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    extensionElements = null
  }
  if (updateProperties) {
    const _property = {}
    _property.extensionElements = extensionElements
    updateProperties(modeler, element, _property)
  } else {
    return extensionElements
  }
}
function pushElementServiceFields (propertyValue, extensionElements, modeler) {
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('事件监听器内容格式不正确，请重新输入')
  }
  if (propertyValue && propertyValue.length > 0) {
    extensionElements.values = [...extensionElements.values, ...setFields(propertyValue, extensionElements, modeler, undefined)]
  }
}

/**
 * 获取
 * @param element
 */
export function getServiceFields (element) {
  const extensionElements = getBusinessObject(element).extensionElements
  if (extensionElements) {
    const fieldElements = filterByType(extensionElements.values, 'activiti:Field')
    if (fieldElements && fieldElements.length > 0) {
      const fields = getFields(fieldElements)
      return JSON.stringify(fields)
    }
  }
  return undefined
}
/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportServiceFields (element) {
  if (element.type.includes('ServiceTask')) {
    return true
  }
  return false
}
