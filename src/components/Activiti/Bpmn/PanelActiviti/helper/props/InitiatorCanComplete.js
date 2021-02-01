import {
  getBpmnFactory, createElement,
  getExtensionElements,
  removeByType, filterByType,
  getPropertyValue, getBusinessObject
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置InitiatorCanComplete
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setInitiatorCanComplete (propertyValue, element, modeler, updateProperties) {
  let extensionElements = getExtensionElements(element, getBpmnFactory(modeler))
  extensionElements.values = removeByType(extensionElements.values, 'modeler:InitiatorCanComplete')
  if (!isEmpty(propertyValue)) {
    pushElementInitiatorCanComplete(propertyValue, extensionElements, modeler)
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
function pushElementInitiatorCanComplete (propertyValue, extensionElements, modeler) {
  if (propertyValue) {
    extensionElements.values.push(createElementInitiatorCanComplete(propertyValue, extensionElements, modeler))
  }
}

/**
 * 创建 InitiatorCanComplete 元素
 * @param event
 * @param element
 * @param modeler
 * @returns {djs.model.Base}
 */
function createElementInitiatorCanComplete (initiatorCanComplete, element, modeler) {
  return createElement('modeler:InitiatorCanComplete', { body: initiatorCanComplete }, element, getBpmnFactory(modeler))
}
/**
 * 获取
 * @param element
 */
export function getInitiatorCanComplete (element) {
  const extensionElements = getBusinessObject(element).extensionElements
  if (extensionElements) {
    const initiatorCanCompleteElement = filterByType(extensionElements.values, 'modeler:InitiatorCanComplete')
    if (initiatorCanCompleteElement && initiatorCanCompleteElement.length > 0) {
      return [initiatorCanCompleteElement[0].body]
    }
  }
  return undefined
}
export function isSupportInitiatorCanComplete (element) {
  if (element.type.includes('UserTask')) {
    return true
  }
  return false
}
