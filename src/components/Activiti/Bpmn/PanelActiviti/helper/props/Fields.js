import {
  createElement,
  getBusinessObject,
  getPropertyValue
} from '@/components/Activiti/Bpmn/PanelActiviti/helper/PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置Fields
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setFields (_properties, propertyValue, element, factory) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.fields = null
  }
  propertyValue.forEach(field => {
    bo.fields.push(createElementField(field, element, factory))
  })
  _properties.fields = bo.fields
}

/**
 * 创建 Field 元素
 * @param field
 * @param parentElement
 * @param factory
 * @returns {djs.model.Base}
 */
function createElementField (field, parentElement, factory) {
  const property = {}
  property.name = getPropertyValue(field.name)
  property.stringValue = getPropertyValue(field.stringValue)
  property.string = getPropertyValue(field.string)
  property.expression = getPropertyValue(field.expression)
  return createElement('activiti:Field', property, parentElement, factory)
}
/**
 * 获取
 * @param element
 */
export function getFields (element) {
  if (element && element.length > 0) {
    const fields = []
    element.forEach(property => {
      const field = {}
      if (property.name) {
        field.name = property.name
      }
      if (property.stringValue) {
        field.stringValue = property.stringValue
      }
      if (property.string) {
        field.string = property.string
      }
      if (property.expression) {
        field.expression = property.expression
      }
      fields.push(field)
    })
    return fields
  }
  return undefined
}
