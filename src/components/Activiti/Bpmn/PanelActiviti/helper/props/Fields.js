import { createElement, getPropertyValue } from '@/components/Activiti/Bpmn/PanelActiviti/helper/PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置Fields
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export default function setFields (_properties, propertyValue, element, factory) {
  if (isEmpty(propertyValue)) {
    _properties.fields = null
    return
  }
  propertyValue.forEach(field => {
    _properties.fields.push(createElementField(field, element, factory))
  })
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
