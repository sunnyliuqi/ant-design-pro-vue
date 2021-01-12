import { createElement, getPropertyValue } from '@/components/Activiti/Bpmn/PanelActiviti/helper/PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置Values
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setValues (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.values = null
    return
  }
  propertyValue.forEach(value => {
    _properties.values.push(createElementValue(value, element, factory))
  })
}

/**
 * 创建 Value 元素
 * @param field
 * @param parentElement
 * @param factory
 * @returns {djs.model.Base}
 */
function createElementValue (value, parentElement, factory) {
  const property = {}
  property.id = getPropertyValue(value.id)
  property.name = getPropertyValue(value.name)
  property.value = getPropertyValue(value.value)
  return createElement('activiti:Value', property, parentElement, factory)
}
/**
 * 获取
 * @param element
 */
export function getValues (element) {
  if (element && element.length > 0) {
    const values = []
    element.forEach(property => {
      const value = {}
      if (property.id) {
        value.id = property.id
      }
      if (property.name) {
        value.name = property.name
      }
      if (property.value) {
        value.value = property.value
      }
      values.push(value)
    })
    return values
  }
  return undefined
}
