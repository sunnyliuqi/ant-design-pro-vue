import { getBpmnFactory, createElement, getBusinessObject, getPropertyValue } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 SignalDefinitions 元素
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setSignalDefinitions (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.signals = undefined
  } else {
    try {
      if (!(propertyValue instanceof Array)) {
        propertyValue = JSON.parse(propertyValue)
      }
    } catch (e) {
      throw new Error('信号定义内容格式不正确，请重新输入')
    }
    if (propertyValue && propertyValue.length > 0) {
      bo.signals = []
      propertyValue.forEach(signal => {
        bo.signals.push(createElementSignal(signal, element, modeler))
      })
    } else {
      bo.signals = undefined
    }
  }
  if (updateProperties) {
    const _property = {}
    _property.signals = bo.signals
    updateProperties(modeler, element, _property)
  } else {
    return bo.signals
  }
}
function createElementSignal (signal, element, modeler) {
  const property = {}
  property.id = getPropertyValue(signal.id)
  property.name = getPropertyValue(signal.name)
  property.scop = getPropertyValue(signal.scop)
  return createElement('activiti:Signal', property, element, getBpmnFactory(modeler))
}
/**
 * 获取
 * @param element
 */
export function getSignalDefinitions (element) {
  const signalElements = getBusinessObject(element).signals
  if (signalElements && signalElements.length > 0) {
    const signals = []
    signalElements.forEach(property => {
      const signal = {}
      if (property.$attrs.id) {
        signal.id = property.$attrs.id
      }
      if (property.$attrs.name) {
        signal.name = property.$attrs.name
      }
      if (property.$attrs.scop) {
        signal.scop = property.$attrs.scop
      }
      signals.push(signal)
    })
    return JSON.stringify(signals)
  }
  return undefined
}
