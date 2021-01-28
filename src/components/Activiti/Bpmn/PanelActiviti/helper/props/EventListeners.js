import {
  createElement,
  getExtensionElements,
  removeByType, filterByType,
  getPropertyValue, getBusinessObject
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置EventListeners
 * @param propertyValue
 * @param element
 * @param factory
 * @param updateProperties
 */
export function setEventListeners (propertyValue, element, factory, updateProperties) {
  let extensionElements = getExtensionElements(element, factory)
  extensionElements.values = removeByType(extensionElements.values, 'activiti:EventListener')
  if (!isEmpty(propertyValue)) {
    pushElementEventListeners(propertyValue, extensionElements, factory)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    extensionElements = null
  }
  if (updateProperties) {
    const _property = {}
    _property.extensionElements = extensionElements
    updateProperties(element, _property)
  } else {
    return extensionElements
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
/**
 * 获取
 * @param element
 */
export function getEventListeners (element) {
  const extensionElements = getBusinessObject(element).extensionElements
  if (extensionElements) {
    const eventListenerElements = filterByType(extensionElements.values, 'activiti:EventListener')
    if (eventListenerElements && eventListenerElements.length > 0) {
      const eventListeners = []
      eventListenerElements.forEach(property => {
        const event = {}
        if (property.events) {
          event.events = property.events
        }
        if (property.throwEvent) {
          event.throwEvent = property.throwEvent
        }
        if (property.signalName) {
          event.signalName = property.signalName
        }
        if (property.errorCode) {
          event.errorCode = property.errorCode
        }
        if (property.messageName) {
          event.messageName = property.messageName
        }
        if (property.class) {
          event.class = property.class
        }
        if (property.delegateExpression) {
          event.delegateExpression = property.delegateExpression
        }
        if (property.entityType) {
          event.entityType = property.entityType
        }
        eventListeners.push(event)
      })
      return JSON.stringify(eventListeners)
    }
  }
  return undefined
}
