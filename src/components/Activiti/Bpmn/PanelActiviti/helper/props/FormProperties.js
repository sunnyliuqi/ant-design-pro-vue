import {
  createElement,
  getExtensionElements,
  removeByType, filterByType,
  getPropertyValue, getBusinessObject
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import { setValues, getValues } from './Values'
import { getStartEventType } from '../SupportPropertyHelper'
/**
 * 设置 FormProperties
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setFormProperties (_properties, propertyValue, element, factory) {
  const extensionElements = getExtensionElements(element, factory)
  extensionElements.values = removeByType(extensionElements.values, 'activiti:FormProperty')
  if (!isEmpty(propertyValue)) {
    pushElementFormProperties(propertyValue, extensionElements, factory)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    _properties.extensionElements = null
  } else {
    _properties.extensionElements = extensionElements
  }
}
function pushElementFormProperties (propertyValue, extensionElements, factory) {
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('动态表单内容格式不正确，请重新输入')
  }
  if (propertyValue && propertyValue.length > 0) {
    propertyValue.forEach(formProperty => {
      extensionElements.values.push(createElementFormProperty(formProperty, extensionElements, factory))
    })
  }
}

/**
 * 创建 ElementFormProperty 元素
 * @param formProperty
 * @param element
 * @param factory
 * @returns {djs.model.Base}
 */
function createElementFormProperty (formProperty, element, factory) {
  const property = {}
  property.id = getPropertyValue(formProperty.id)
  property.name = getPropertyValue(formProperty.name)
  property.type = getPropertyValue(formProperty.type)
  property.required = getPropertyValue(formProperty.required)
  property.readable = getPropertyValue(formProperty.readable)
  property.writable = getPropertyValue(formProperty.writable)
  property.datePattern = getPropertyValue(formProperty.datePattern)
  property.default = getPropertyValue(formProperty.default)
  property.expression = getPropertyValue(formProperty.expression)
  property.variable = getPropertyValue(formProperty.variable)
  if (formProperty.values && formProperty.values.length > 0) {
    property.values = []
  } else {
    property.values = null
  }
  const formPropertyElement = createElement('activiti:FormProperty', property, element, factory)
  if (formProperty.values && formProperty.values.length > 0) {
    setValues(formPropertyElement, formProperty.values, formPropertyElement, factory)
  }
  return formPropertyElement
}
/**
 * 获取
 * @param element
 */
export function getFormProperties (element) {
  const extensionElements = getBusinessObject(element).extensionElements
  if (extensionElements) {
    const formPropertyElements = filterByType(extensionElements.values, 'activiti:FormProperty')
    if (formPropertyElements && formPropertyElements.length > 0) {
      const formProperties = []
      formPropertyElements.forEach(property => {
        const formProperty = {}
        if (property.id) {
          formProperty.id = property.id
        }
        if (property.name) {
          formProperty.name = property.name
        }
        if (property.type) {
          formProperty.type = property.type
        }
        if (property.required) {
          formProperty.required = property.required
        }
        if (property.readable) {
          formProperty.readable = property.readable
        }
        if (property.writable) {
          formProperty.writable = property.writable
        }
        if (property.datePattern) {
          formProperty.datePattern = property.datePattern
        }
        if (property.default) {
          formProperty.default = property.default
        }
        if (property.expression) {
          formProperty.expression = property.expression
        }
        if (property.variable) {
          formProperty.variable = property.variable
        }
        if (property.values && property.values.length > 1) {
          formProperty.values = getValues(property.values)
        }
        formProperties.push(formProperty)
      })
      return JSON.stringify(formProperties)
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportFormProperties (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'none') {
    return true
  }
  return false
}
