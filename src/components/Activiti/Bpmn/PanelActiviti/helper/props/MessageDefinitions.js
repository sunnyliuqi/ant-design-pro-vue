import { createElement, getBusinessObject, getPropertyValue } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 MessageDefinitions 元素
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setMessageDefinitions (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.messages = null
    return
  }
    try {
      if (!(propertyValue instanceof Array)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('消息定义内容格式不正确，请重新输入')
    }
    if (propertyValue && propertyValue.length > 0) {
      _properties.messages = []
      propertyValue.forEach(message => {
        _properties.messages.push(createElementSignal(message, element, factory))
      })
    } else {
      _properties.messages = null
    }
}
function createElementSignal (message, element, factory) {
  const property = {}
  property.id = getPropertyValue(message.id)
  property.name = getPropertyValue(message.name)
  property.itemRef = getPropertyValue(message.itemRef)
  return createElement('activiti:Message', property, element, factory)
}
/**
 * 获取
 * @param element
 */
export function getMessageDefinitions (element) {
  const messageElements = getBusinessObject(element).messages
  if (messageElements && messageElements.length > 0) {
    const messages = []
    messageElements.forEach(property => {
      const message = {}
      if (property.$attrs.id) {
        message.id = property.$attrs.id
      }
      if (property.$attrs.name) {
        message.name = property.$attrs.name
      }
      if (property.$attrs.itemRef) {
        message.itemRef = property.$attrs.itemRef
      }
      messages.push(message)
    })
    return JSON.stringify(messages)
  }

  return undefined
}
