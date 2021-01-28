'use strict'
import { isEmpty } from '@/utils/common'
import { setDocumentation, getDocumentation } from './props/Documentation'
import { setExecutionListeners, getExecutionListeners, isSupportExecutionListeners } from './props/ExecutionListeners'
import { setEventListeners, getEventListeners } from './props/EventListeners'
import { setSignalDefinitions, getSignalDefinitions } from './props/SignalDefinitions'
import { setMessageDefinitions, getMessageDefinitions } from './props/MessageDefinitions'
import { setInitiator, getInitiator, isSupportInitiator } from './props/Initiator'
import { getFormKey, isSupportFormKey, setFormKey } from './props/FormKey'
import { setFormProperties, getFormProperties, isSupportFormProperties } from './props/FormProperties'
import {
  setMessageEventDefinition,
  getMessageEventDefinition,
  isSupportMessageEventDefinition
} from './props/MessageEventDefinition'
import {
  getConditionalEventDefinition, isSupportConditionalEventDefinition,
  setConditionalEventDefinition
} from './props/ConditionalEventDefinition'
import {
  getSignalEventDefinition, isSupportSignalEventDefinition,
  setSignalEventDefinition
} from './props/SignalEventDefinition'
import {
  getTimerEventDefinition, isSupportTimerEventDefinition,
  setTimerEventDefinition
} from './props/TimerEventDefinition'
import {
  getErrorEventDefinition, isSupportErrorEventDefinition,
  setErrorEventDefinition
} from './props/ErrorEventDefinition'
import {
  getConditionExpression, isSupportConditionExpression,
  setConditionExpression
} from './props/ConditionExpression'

/**
 * 设置element properties
 * @param element
 * @param properties
 * @param factory
 * @param updateProperties
 * @returns {Promise<unknown>}
 */
export function setProperties (element, properties, factory, updateProperties) {
  return new Promise((resolve, reject) => {
    try {
      const propertyNames = properties && Object.keys(properties)
      if (propertyNames && propertyNames.length > 0) {
        propertyNames.forEach(propertyName => {
          setProperty(propertyName, properties[propertyName], element, factory, updateProperties)
        })
      }
      return resolve(element)
    } catch (e) {
      return reject(e.message)
    }
  })
}
/**
 * 获取bpmn property
 * @param propertyName
 * @param propertyValue
 * @param element
 * @param factory
 * @param updateProperties
 */
function setProperty (propertyName, propertyValue, element, factory, updateProperties) {
  if (propertyName === 'documentation') {
    setDocumentation(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'executionlisteners') {
    setExecutionListeners(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'eventlisteners') {
    setEventListeners(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'signaldefinitions') {
    setSignalDefinitions(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'messagedefinitions') {
    setMessageDefinitions(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'initiator') {
    setInitiator(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'formKey') {
    setFormKey(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'formProperties') {
    setFormProperties(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'messageEventDefinition') {
    setMessageEventDefinition(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'conditionalEventDefinition') {
    setConditionalEventDefinition(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'signalEventDefinition') {
    setSignalEventDefinition(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'timeDate') {
    let propertyTimeDate
    if (!isEmpty(propertyValue)) {
      propertyTimeDate = { timeDate: propertyValue }
    } else {
      propertyTimeDate = { timeDate: undefined }
    }
    setTimerEventDefinition(propertyTimeDate, element, factory, updateProperties)
  } else if (propertyName === 'timeCycle') {
    let propertyTimeCycle
    if (!isEmpty(propertyValue)) {
      propertyTimeCycle = { timeCycle: propertyValue }
    } else {
      propertyTimeCycle = { timeCycle: undefined }
    }
    setTimerEventDefinition(propertyTimeCycle, element, factory, updateProperties)
  } else if (propertyName === 'timeDuration') {
    let propertyTimeDuration
    if (!isEmpty(propertyValue)) {
      propertyTimeDuration = { timeDuration: propertyValue }
    } else {
      propertyTimeDuration = { timeDuration: undefined }
    }
    setTimerEventDefinition(propertyTimeDuration, element, factory, updateProperties)
  } else if (propertyName === 'errorEventDefinition') {
    setErrorEventDefinition(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'conditionExpression') {
    setConditionExpression(propertyValue, element, factory, updateProperties)
  } else if (propertyName === 'defaultFlow') {
    setConditionExpression(propertyValue, element, factory, updateProperties)
  } else {
    const _property = {}
    _property[propertyName] = getPropertyValue(propertyValue)
    updateProperties(element, _property)
  }
}

/**
 * 节点转字符串值
 * @param type
 * @param element
 * @returns {string|null|*|Record<string, string>|{handler(*=): void, deep: boolean}|{handler: function(*=): void, deep: boolean}|{handler: function(*=): void, deep: boolean}|undefined}
 */
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
  } else if (type === 'errorEventDefinition') {
    return getErrorEventDefinition(element)
  } else if (type === 'conditionExpression') {
    return getConditionExpression(element)
  }
  return undefined
}

/**
 * 移除节点多余的bo
 * @param element
 * @returns {*}
 */
export function removeBusinessObject (element, factory, updateProperties) {
  if (element) {
    if (!isSupportExecutionListeners(element)) {
      setExecutionListeners(undefined, element, factory, updateProperties)
    }
    if (!isSupportInitiator(element)) {
      setInitiator(undefined, element, factory, updateProperties)
    }
    if (!isSupportFormKey(element)) {
      setFormKey(undefined, element, factory, updateProperties)
    }
    if (!isSupportFormProperties(element)) {
     setFormProperties(undefined, element, factory, updateProperties)
   }
    if (!isSupportMessageEventDefinition(element)) {
      setMessageEventDefinition(undefined, element, factory, updateProperties)
    }
    if (!isSupportConditionalEventDefinition(element)) {
      setConditionalEventDefinition(undefined, element, factory, updateProperties)
    }
    if (!isSupportSignalEventDefinition(element)) {
      setSignalEventDefinition(undefined, element, factory, updateProperties)
    }
    if (!isSupportTimerEventDefinition(element)) {
      setTimerEventDefinition(undefined, element, factory, updateProperties)
    }
    if (!isSupportErrorEventDefinition(element)) {
      setErrorEventDefinition(undefined, element, factory, updateProperties)
    }
    if (!isSupportConditionExpression(element)) {
      setConditionExpression(undefined, element, factory, updateProperties)
    }
  }
  return element
}

/**
 * 是否支持
 * @param type
 * @param element
 * @constructor
 */
export function supportProperty (type, element) {
  if (type === 'executionlisteners') {
    return isSupportExecutionListeners(element)
  } else if (type === 'initiator') {
    return isSupportInitiator(element)
  } else if (type === 'formKey') {
    return isSupportFormKey(element)
  } else if (type === 'formProperties') {
    return isSupportFormProperties(element)
  } else if (type === 'messageEventDefinition') {
    return isSupportMessageEventDefinition(element)
  } else if (type === 'conditionalEventDefinition') {
    return isSupportConditionalEventDefinition(element)
  } else if (type === 'signalEventDefinition') {
    return isSupportSignalEventDefinition(element)
  } else if (type === 'timeDate') {
    return isSupportTimerEventDefinition(element)
  } else if (type === 'timeCycle') {
    return isSupportTimerEventDefinition(element)
  } else if (type === 'timeDuration') {
    return isSupportTimerEventDefinition(element)
  } else if (type === 'errorEventDefinition') {
    return isSupportErrorEventDefinition(element)
  } else if (type === 'conditionExpression') {
    return isSupportConditionExpression(element)
  }
  return false
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

export function getStartEventType (element) {
  if (element.businessObject && element.businessObject.eventDefinitions && element.businessObject.eventDefinitions.length > 0) {
    const moddleElement = element.businessObject.eventDefinitions[0]
    if (moddleElement) {
      if (moddleElement.$type === 'bpmn:MessageEventDefinition') {
        return 'message'
      } else if (moddleElement.$type === 'bpmn:TimerEventDefinition') {
        return 'timer'
      } else if (moddleElement.$type === 'bpmn:ConditionalEventDefinition') {
        return 'conditional'
      } else if (moddleElement.$type === 'bpmn:SignalEventDefinition') {
        return 'signal'
      }
    }
  }
  return 'none'
}

export function getIntermediateEventType (element) {
  if (element.type === 'bpmn:IntermediateThrowEvent' || element.type === 'bpmn:IntermediateCatchEvent') {
    return true
  }
  return false
}

export function getEventDefinitionType (element) {
  if (element.businessObject && element.businessObject.eventDefinitions && element.businessObject.eventDefinitions.length > 0) {
    const moddleElement = element.businessObject.eventDefinitions[0]
    if (moddleElement) {
      if (moddleElement.$type === 'bpmn:MessageEventDefinition') {
        return 'message'
      } else if (moddleElement.$type === 'bpmn:TimerEventDefinition') {
        return 'timer'
      } else if (moddleElement.$type === 'bpmn:EscalationEventDefinition') {
        return 'escalation'
      } else if (moddleElement.$type === 'bpmn:ConditionalEventDefinition') {
        return 'conditional'
      } else if (moddleElement.$type === 'bpmn:LinkEventDefinition') {
        return 'link'
      } else if (moddleElement.$type === 'bpmn:SignalEventDefinition') {
        return 'signal'
      } else if (moddleElement.$type === 'bpmn:CompensateEventDefinition') {
        return 'compensate'
      } else if (moddleElement.$type === 'bpmn:ErrorEventDefinition') {
        return 'error'
      }
    }
  }
  return 'none'
}

export function getEndEventType (element) {
  if (element.type === 'bpmn:EndEvent') {
    return true
  }
  return false
}
export function getConnectType (element) {
  if (element.type === 'bpmn:SequenceFlow') {
    return true
  }
  return false
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
