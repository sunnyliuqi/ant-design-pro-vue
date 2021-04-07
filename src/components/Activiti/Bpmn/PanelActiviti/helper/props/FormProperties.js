import {
  getBpmnFactory, createElement,
  getExtensionElements,
  removeByType, filterByType,
  getPropertyValue, getBusinessObject, getStartEventType
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import { setValues, getValues } from './Values'
/**
 * 设置 FormProperties
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setFormProperties (propertyValue, element, modeler, updateProperties) {
  let extensionElements = getExtensionElements(element, getBpmnFactory(modeler))
  extensionElements.values = removeByType(extensionElements.values, 'activiti:FormProperty')
  if (!isEmpty(propertyValue)) {
    pushElementFormProperties(propertyValue, extensionElements, modeler)
  }
  if (!extensionElements.values || extensionElements.values.length < 1) {
    extensionElements = null
  }
  if (updateProperties) {
    const _property = {}
    _property.extensionElements = extensionElements
    updateProperties(modeler, element, _property)
  } else {
    return extensionElements
  }
}
function pushElementFormProperties (propertyValue, extensionElements, modeler) {
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('动态表单内容格式不正确，请重新输入')
  }
  if (propertyValue && propertyValue.length > 0) {
    propertyValue.forEach(formProperty => {
      extensionElements.values.push(createElementFormProperty(formProperty, extensionElements, modeler))
    })
  }
}

/**
 * 创建 ElementFormProperty 元素
 * @param formProperty
 * @param element
 * @param modeler
 * @returns {djs.model.Base}
 */
function createElementFormProperty (formProperty, element, modeler) {
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
  const formPropertyElement = createElement('activiti:FormProperty', property, element, getBpmnFactory(modeler))
  if (formProperty.values && formProperty.values.length > 0) {
    formPropertyElement.values = setValues(formProperty.values, formPropertyElement, modeler, undefined)
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
  if (element.type.includes('UserTask')) {
    return true
  }
  return false
}
