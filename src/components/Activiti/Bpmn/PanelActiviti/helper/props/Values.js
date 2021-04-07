import {
  getBpmnFactory, createElement,
  getBusinessObject,
  getPropertyValue
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置Values
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setValues (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.values = null
  } else {
    propertyValue.forEach(value => {
      bo.values.push(createElementValue(value, element, modeler))
    })
  }
  if (updateProperties) {
    const _property = {}
    _property.values = bo.values
    updateProperties(modeler, element, _property)
  } else {
    return bo.values
  }
}

/**
 * 创建 Value 元素
 * @param field
 * @param parentElement
 * @param modeler
 * @returns {djs.model.Base}
 */
function createElementValue (value, parentElement, modeler) {
  const property = {}
  property.id = getPropertyValue(value.id)
  property.name = getPropertyValue(value.name)
  property.value = getPropertyValue(value.value)
  return createElement('activiti:Value', property, parentElement, getBpmnFactory(modeler))
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
