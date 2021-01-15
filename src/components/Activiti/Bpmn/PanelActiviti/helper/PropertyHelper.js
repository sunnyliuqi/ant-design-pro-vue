'use strict'
import { isEmpty } from '@/utils/common'
import { setDocumentation, getDocumentation } from './props/Documentation'
import { setExecutionListeners, getExecutionListeners } from './props/ExecutionListeners'
import { setEventListeners, getEventListeners } from './props/EventListeners'
import { setSignalDefinitions, getSignalDefinitions } from './props/SignalDefinitions'
import { setMessageDefinitions, getMessageDefinitions } from './props/MessageDefinitions'
import { setInitiator, getInitiator } from './props/Initiator'
import { getFormKey, setFormKey } from './props/FormKey'
import { setFormProperties, getFormProperties } from './props/FormProperties'
import { setMessageEventDefinition, getMessageEventDefinition } from './props/MessageEventDefinition'
import {
  getConditionalEventDefinition,
  setConditionalEventDefinition
} from './props/ConditionalEventDefinition'
import {
  getSignalEventDefinition,
  setSignalEventDefinition
} from './props/SignalEventDefinition'
import {
  getTimerEventDefinition,
  setTimerEventDefinition
} from './props/TimerEventDefinition'
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
export function getValues (type, element) {
  if (type === 'name') {
    return element.businessObject && element.businessObject.name
  } else if (type === 'author') {
    return element.businessObject && element.businessObject.$attrs && element.businessObject.$attrs.author
  } else if (type === 'version') {
    return element.businessObject && element.businessObject.$attrs && element.businessObject.$attrs.version
  } else if (type === 'executionlisteners') {
    return getExecutionListeners(element)
  } else if (type === 'eventlisteners') {
    return getEventListeners(element)
  } else if (type === 'signaldefinitions') {
    return getSignalDefinitions(element)
  } else if (type === 'messagedefinitions') {
    return getMessageDefinitions(element)
  } else if (type === 'initiator') {
    return getInitiator(element)
  } else if (type === 'formKey') {
    return getFormKey(element)
  } else if (type === 'formProperties') {
    return getFormProperties(element)
  } else if (type === 'messageEventDefinition') {
    return getMessageEventDefinition(element)
  } else if (type === 'conditionalEventDefinition') {
    return getConditionalEventDefinition(element)
  } else if (type === 'signalEventDefinition') {
    return getSignalEventDefinition(element)
  } else if (type === 'timeDate') {
    const timerEventDefinition = Parse(getTimerEventDefinition(element))
    return timerEventDefinition && timerEventDefinition.timeDate
  } else if (type === 'timeCycle') {
    const timerEventDefinition = Parse(getTimerEventDefinition(element))
    return timerEventDefinition && timerEventDefinition.timeCycle
  } else if (type === 'timeDuration') {
    const timerEventDefinition = Parse(getTimerEventDefinition(element))
    return timerEventDefinition && timerEventDefinition.timeDuration
  } else if (type === 'documentation') {
    return getDocumentation(element)
  }
  return undefined
}

/**
 * 字符串转对象
 * @param s
 * @returns {undefined|any}
 * @constructor
 */
function Parse (s) {
  if (!isEmpty(s)) {
    try {
      return JSON.parse(s)
    } catch (e) {
      console.warn('解析对象异常，请检查对象: ' + s)
    }
  }
  return undefined
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
  } else if (propertyName === 'initiator') {
    setInitiator(_properties, propertyValue, element, factory)
  } else if (propertyName === 'formKey') {
    setFormKey(_properties, propertyValue, element, factory)
  } else if (propertyName === 'formProperties') {
    setFormProperties(_properties, propertyValue, element, factory)
  } else if (propertyName === 'messageEventDefinition') {
    setMessageEventDefinition(_properties, propertyValue, element, factory)
  } else if (propertyName === 'conditionalEventDefinition') {
    setConditionalEventDefinition(_properties, propertyValue, element, factory)
  } else if (propertyName === 'signalEventDefinition') {
    setSignalEventDefinition(_properties, propertyValue, element, factory)
  } else if (propertyName === 'timeDate') {
    let propertyTimeDate
    if (!isEmpty(propertyValue)) {
      propertyTimeDate = { timeDate: propertyValue }
    }
    setTimerEventDefinition(_properties, propertyTimeDate, element, factory)
  } else if (propertyName === 'timeCycle') {
    let propertyTimeCycle
    if (!isEmpty(propertyValue)) {
      propertyTimeCycle = { timeCycle: propertyValue }
    }
    setTimerEventDefinition(_properties, propertyTimeCycle, element, factory)
  } else if (propertyName === 'timeDuration') {
    let propertyTimeDuration
    if (!isEmpty(propertyValue)) {
       propertyTimeDuration = { timeDuration: propertyValue }
    }
    setTimerEventDefinition(_properties, propertyTimeDuration, element, factory)
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
 * 过滤指定类型元素
 * @param values
 * @param type
 * @returns {*[]|*}
 */
export function filterByType (values, type) {
  if (values && values.length > 0) {
    return values.filter(c => type === c.$type)
  }
  return undefined
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
    const element = factory.create(elementType, properties)
    element.$parent = parent
    return element
}
