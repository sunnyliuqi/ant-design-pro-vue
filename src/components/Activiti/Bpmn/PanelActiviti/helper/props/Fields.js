import {
  getBpmnFactory, createElement,
  getBusinessObject,
  getPropertyValue
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置Fields
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setFields (propertyValue, element, modeler, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(propertyValue)) {
    bo.fields = null
  }
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('字段内容格式不正确，请重新输入')
  }
  if (!bo.fields) {
    bo.fields = []
  }
  propertyValue.forEach(field => {
    bo.fields.push(createElementField(field, element, modeler))
  })
  if (updateProperties) {
    const _property = {}
    _property.fields = bo.fields
    updateProperties(modeler, element, _property)
  } else {
    return bo.fields
  }
}

/**
 * 创建 Field 元素
 * @param field
 * @param parentElement
 * @param modeler
 * @returns {djs.model.Base}
 */
function createElementField (field, parentElement, modeler) {
  const property = {}
  property.name = getPropertyValue(field.name)
  property.stringValue = getPropertyValue(field.stringValue)
  property.string = getPropertyValue(field.string)
  property.expression = getPropertyValue(field.expression)
  return createElement('activiti:Field', property, parentElement, getBpmnFactory(modeler))
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
