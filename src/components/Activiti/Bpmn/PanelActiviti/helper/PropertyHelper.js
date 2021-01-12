'use strict'
import { isEmpty } from '@/utils/common'
import setDocumentation from './props/Documentation'
import setExecutionListeners from './props/ExecutionListeners'
import setEventListeners from './props/EventListeners'
import setSignalDefinitions from './props/SignalDefinitions'
import setMessageDefinitions from './props/MessageDefinitions'

/**
 * 根据传入的表单properties获取对应bpmn properties
 * @param element
 * @param properties
 * @param factory
 * @param updateProperties
 * @returns {Promise<unknown>}
 */
export function getProperties (element, properties, factory, updateProperties) {
  return new Promise((resolve, reject) => {
    try {
      const propertyNames = properties && Object.keys(properties)
      const _properties = {}
      if (propertyNames && propertyNames.length > 0) {
        propertyNames.forEach(propertyName => {
          setProperty(_properties, propertyName, properties[propertyName], element, factory)
        })
      }
      updateProperties(element, _properties)
      return resolve(_properties)
    } catch (e) {
      return reject(e.message)
    }
  })
}
/**
 * 获取bpmn property
 * @param _properties
 * @param propertyName
 * @param propertyValue
 * @param element
 * @param factory
 */
function setProperty (_properties, propertyName, propertyValue, element, factory) {
  if (propertyName === 'documentation') {
    setDocumentation(_properties, propertyValue, element, factory)
  } else if (propertyName === 'executionlisteners') {
    setExecutionListeners(_properties, propertyValue, element, factory)
  } else if (propertyName === 'eventlisteners') {
    setEventListeners(_properties, propertyValue, element, factory)
  } else if (propertyName === 'signaldefinitions') {
    setSignalDefinitions(_properties, propertyValue, element, factory)
  } else if (propertyName === 'messagedefinitions') {
    setMessageDefinitions(_properties, propertyValue, element, factory)
  } else {
    _properties[propertyName] = getPropertyValue(propertyValue)
  }
}

/**
 * 获取扩展标签
 * @param element
 * @param factory
 * @returns {djs.model.Base}
 */
export function getExtensionElements (element, factory) {
  let extensionElements = getBusinessObject(element).extensionElements
  if (!extensionElements) {
    extensionElements = createElement('bpmn:ExtensionElements', { values: [] }, element, factory)
  }
  return extensionElements
}

/**
 * 根据type移除元素
 * @param values
 * @param type
 * @returns {*[]|*}
 */
export function removeByType (values, type) {
  if (values && values.length > 0) {
    return values.filter(c => type !== c.$type)
  } else {
    return []
  }
}

/**
 * 获取业务节点
 * @param element
 * @returns {*}
 */
export function getBusinessObject (element) {
  return (element && element.businessObject) || element
}

/**
 * 获取属性值
 * @param property
 * @returns {undefined|*}
 */
export function getPropertyValue (property) {
  if (isEmpty(property)) {
    return undefined
  } else {
    return property
  }
}

/**
 * 获取到根节点
 * @param businessObject
 * @returns {*}
 */
export function getRoot (businessObject) {
  var parent = businessObject
  while (parent.$parent) {
    parent = parent.$parent
  }
  return parent
}
/**
 * 创建元素
 *
 * @method ElementHelper#createElement
 *
 * @param {String} elementType of the new element
 * @param {Object} properties of the new element in key-value pairs
 * @param {moddle.object} parent of the new element
 * @param {BpmnFactory} factory which creates the new element
 *
 * @returns {djs.model.Base} element which is created
 */
export function createElement (elementType, properties, parent, factory) {
    var element = factory.create(elementType, properties)
    element.$parent = parent
    return element
}
