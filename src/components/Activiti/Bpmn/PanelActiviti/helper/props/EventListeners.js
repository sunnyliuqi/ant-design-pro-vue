import {
  createElement,
  getExtensionElements,
  removeByType
} from '../PropertyHelper'

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
  pushElementEventListeners(propertyValue, extensionElements, factory)
  _properties.extensionElements = extensionElements
}

function pushElementEventListeners (propertyValue, extensionElements, factory) {
  if (typeof (propertyValue) === 'string' && (propertyValue === '' || propertyValue.trim() === '')) {
    return
  }
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
  if (event.events) {
    property.events = event.events
  }
  if (event.throwEvent) {
    property.throwEvent = event.throwEvent
  }
  if (event.signalName) {
    property.signalName = event.signalName
  }
  if (event.errorCode) {
    property.errorCode = event.errorCode
  }
  if (event.messageName) {
    property.messageName = event.messageName
  }
  if (event.class) {
    property.class = event.class
  }
  if (event.delegateExpression) {
    property.delegateExpression = event.delegateExpression
  }
  if (event.entityType) {
    property.entityType = event.entityType
  }
  return createElement('activiti:EventListener', property, element, factory)
}
