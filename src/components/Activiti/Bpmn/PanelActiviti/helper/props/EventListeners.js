import {
  createElement,
  getExtensionElements,
  removeByType,
  getPropertyValue
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置EventListeners
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export default function setEventListeners (_properties, propertyValue, element, factory) {
  const extensionElements = getExtensionElements(element, factory)
  extensionElements.values = removeByType(extensionElements.values, 'activiti:EventListener')
  if (!isEmpty(propertyValue)) {
    pushElementEventListeners(propertyValue, extensionElements, factory)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    _properties.extensionElements = null
  } else {
    _properties.extensionElements = extensionElements
  }
}

function pushElementEventListeners (propertyValue, extensionElements, factory) {
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('事件监听器内容格式不正确，请重新输入')
  }
  if (propertyValue && propertyValue.length > 0) {
    propertyValue.forEach(event => {
      extensionElements.values.push(createElementEventListener(event, extensionElements, factory))
    })
  }
}

/**
 * 创建 EventListener 元素
 * @param event
 * @param element
 * @param factory
 * @returns {djs.model.Base}
 */
function createElementEventListener (event, element, factory) {
  const property = {}
  property.events = getPropertyValue(event.events)
  property.throwEvent = getPropertyValue(event.throwEvent)
  property.signalName = getPropertyValue(event.signalName)
  property.errorCode = getPropertyValue(event.errorCode)
  property.messageName = getPropertyValue(event.messageName)
  property.class = getPropertyValue(event.class)
  property.delegateExpression = getPropertyValue(event.delegateExpression)
  property.entityType = getPropertyValue(event.entityType)
  return createElement('activiti:EventListener', property, element, factory)
}
