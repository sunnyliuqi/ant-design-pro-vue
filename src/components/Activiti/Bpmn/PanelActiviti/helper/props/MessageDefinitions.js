import { getBpmnFactory, createElement, getBusinessObject, getPropertyValue } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 MessageDefinitions 元素
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setMessageDefinitions (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.messages = null
  } else {
    try {
      if (!(propertyValue instanceof Array)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('消息定义内容格式不正确，请重新输入')
    }
    if (propertyValue && propertyValue.length > 0) {
      bo.messages = []
      propertyValue.forEach(message => {
        bo.messages.push(createElementSignal(message, element, modeler))
      })
    } else {
      bo.messages = null
    }
  }
  if (updateProperties) {
    const _property = {}
    _property.messages = bo.messages
    updateProperties(modeler, element, _property)
  } else {
    return bo.messages
  }
}
function createElementSignal (message, element, modeler) {
  const property = {}
  property.id = getPropertyValue(message.id)
  property.name = getPropertyValue(message.name)
  property.itemRef = getPropertyValue(message.itemRef)
  return createElement('activiti:Message', property, element, getBpmnFactory(modeler))
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
