import { createElement } from '@/components/Activiti/Bpmn/PanelActiviti/helper/PropertyHelper'

/**
 * 设置Fields
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export default function setFields (_properties, propertyValue, element, factory) {
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
  if (field.name) {
    property.name = field.name
  }
  if (field.stringValue) {
    property.stringValue = field.stringValue
  }
  if (field.string) {
    property.string = field.string
  }
  if (field.expression) {
    property.expression = field.expression
  }
  return createElement('activiti:Field', property, parentElement, factory)
}
