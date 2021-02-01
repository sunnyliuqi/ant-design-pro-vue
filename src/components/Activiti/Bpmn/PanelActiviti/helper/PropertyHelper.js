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
import {
  getDefaultFlow, isSupportDefaultFlow,
  setDefaultFlow
} from './props/DefaultFlow'
import {
  getAsync, isSupportAsync,
  setAsync
} from './props/Async'
import {
  getExclusive, isSupportExclusive,
  setExclusive
} from './props/Exclusive'
import {
  getMultiInstanceLoopCharacteristics, isSupportMultiInstanceLoopCharacteristics,
  setMultiInstanceLoopCharacteristics
} from './props/MultiInstanceLoopCharacteristics'
import {
  getIsForCompensation, isSupportIsForCompensation,
  setIsForCompensation
} from './props/IsForCompensation'
import {
  getAssignments, isSupportAssignments,
  setAssignments
} from './props/Assignments'
/**
 * 设置element properties
 * @param element
 * @param properties
 * @param modeler
 * @returns {Promise<unknown>}
 */
export function setProperties (element, properties, modeler) {
  return new Promise((resolve, reject) => {
    try {
      const propertyNames = properties && Object.keys(properties)
      if (propertyNames && propertyNames.length > 0) {
        propertyNames.forEach(propertyName => {
          setProperty(propertyName, properties[propertyName], element, modeler)
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
 * @param modeler
 */
function setProperty (propertyName, propertyValue, element, modeler) {
  if (propertyName === 'documentation') {
    setDocumentation(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'executionlisteners') {
    setExecutionListeners(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'eventlisteners') {
    setEventListeners(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'signaldefinitions') {
    setSignalDefinitions(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'messagedefinitions') {
    setMessageDefinitions(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'initiator') {
    setInitiator(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'formKey') {
    setFormKey(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'formProperties') {
    setFormProperties(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'messageEventDefinition') {
    setMessageEventDefinition(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'conditionalEventDefinition') {
    setConditionalEventDefinition(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'signalEventDefinition') {
    setSignalEventDefinition(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'timeDate') {
    let propertyTimeDate
    if (!isEmpty(propertyValue)) {
      propertyTimeDate = { timeDate: propertyValue }
    } else {
      propertyTimeDate = { timeDate: undefined }
    }
    setTimerEventDefinition(propertyTimeDate, element, modeler, updateProperties)
  } else if (propertyName === 'timeCycle') {
    let propertyTimeCycle
    if (!isEmpty(propertyValue)) {
      propertyTimeCycle = { timeCycle: propertyValue }
    } else {
      propertyTimeCycle = { timeCycle: undefined }
    }
    setTimerEventDefinition(propertyTimeCycle, element, modeler, updateProperties)
  } else if (propertyName === 'timeDuration') {
    let propertyTimeDuration
    if (!isEmpty(propertyValue)) {
      propertyTimeDuration = { timeDuration: propertyValue }
    } else {
      propertyTimeDuration = { timeDuration: undefined }
    }
    setTimerEventDefinition(propertyTimeDuration, element, modeler, updateProperties)
  } else if (propertyName === 'errorEventDefinition') {
    setErrorEventDefinition(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'conditionExpression') {
    setConditionExpression(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'defaultFlow') {
    setDefaultFlow(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'asynchronous') {
    setAsync(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'exclusive') {
    setExclusive(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'isSequential') {
    let property
    if (!isEmpty(propertyValue)) {
      property = { isSequential: propertyValue[0] }
    } else {
      property = { isSequential: undefined }
    }
    setMultiInstanceLoopCharacteristics(property, element, modeler, updateProperties)
  } else if (propertyName === 'loopCardinality') {
    let property
    if (!isEmpty(propertyValue)) {
      property = { loopCardinality: propertyValue }
    } else {
      property = { loopCardinality: undefined }
    }
    setMultiInstanceLoopCharacteristics(property, element, modeler, updateProperties)
  } else if (propertyName === 'collection') {
    let property
    if (!isEmpty(propertyValue)) {
      property = { collection: propertyValue }
    } else {
      property = { collection: undefined }
    }
    setMultiInstanceLoopCharacteristics(property, element, modeler, updateProperties)
  } else if (propertyName === 'elementVariable') {
    let property
    if (!isEmpty(propertyValue)) {
      property = { elementVariable: propertyValue }
    } else {
      property = { elementVariable: undefined }
    }
    setMultiInstanceLoopCharacteristics(property, element, modeler, updateProperties)
  } else if (propertyName === 'completionCondition') {
    let property
    if (!isEmpty(propertyValue)) {
      property = { completionCondition: propertyValue }
    } else {
      property = { completionCondition: undefined }
    }
    setMultiInstanceLoopCharacteristics(property, element, modeler, updateProperties)
  } else if (propertyName === 'isForCompensation') {
    setIsForCompensation(propertyValue, element, modeler, updateProperties)
  } else if (propertyName === 'assignments') {
    setAssignments(propertyValue, element, modeler, updateProperties)
  } else {
    const _property = {}
    _property[propertyName] = getPropertyValue(propertyValue)
    updateProperties(modeler, element, _property)
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
  } else if (type === 'defaultFlow') {
    return getDefaultFlow(element)
  } else if (type === 'asynchronous') {
    return getAsync(element)
  } else if (type === 'exclusive') {
    return getExclusive(element)
  } else if (type === 'isSequential') {
    const multiInstanceLoopCharacteristics = Parse(getMultiInstanceLoopCharacteristics(element))
    if (multiInstanceLoopCharacteristics && multiInstanceLoopCharacteristics.isSequential === true) {
      return [true]
    }
  return [false]
  } else if (type === 'loopCardinality') {
    const multiInstanceLoopCharacteristics = Parse(getMultiInstanceLoopCharacteristics(element))
    return multiInstanceLoopCharacteristics && multiInstanceLoopCharacteristics.loopCardinality
  } else if (type === 'collection') {
    const multiInstanceLoopCharacteristics = Parse(getMultiInstanceLoopCharacteristics(element))
    return multiInstanceLoopCharacteristics && multiInstanceLoopCharacteristics.collection
  } else if (type === 'elementVariable') {
    const multiInstanceLoopCharacteristics = Parse(getMultiInstanceLoopCharacteristics(element))
    return multiInstanceLoopCharacteristics && multiInstanceLoopCharacteristics.elementVariable
  } else if (type === 'completionCondition') {
    const multiInstanceLoopCharacteristics = Parse(getMultiInstanceLoopCharacteristics(element))
    return multiInstanceLoopCharacteristics && multiInstanceLoopCharacteristics.completionCondition
  } else if (type === 'isForCompensation') {
    return getIsForCompensation(element)
  } else if (type === 'assignments') {
    return getAssignments(element)
  }
  return undefined
}

/**
 * 移除节点多余的bo
 * @param element
 * @param modeler
 * @returns {*}
 */
export function removeBusinessObject (element, modeler) {
  if (element) {
    if (!isSupportExecutionListeners(element)) {
      setExecutionListeners(undefined, element, modeler, updateProperties)
    }
    if (!isSupportInitiator(element)) {
      setInitiator(undefined, element, modeler, updateProperties)
    }
    if (!isSupportFormKey(element)) {
      setFormKey(undefined, element, modeler, updateProperties)
    }
    if (!isSupportFormProperties(element)) {
     setFormProperties(undefined, element, modeler, updateProperties)
   }
    if (!isSupportMessageEventDefinition(element)) {
      setMessageEventDefinition(undefined, element, modeler, updateProperties)
    }
    if (!isSupportConditionalEventDefinition(element)) {
      setConditionalEventDefinition(undefined, element, modeler, updateProperties)
    }
    if (!isSupportSignalEventDefinition(element)) {
      setSignalEventDefinition(undefined, element, modeler, updateProperties)
    }
    if (!isSupportTimerEventDefinition(element)) {
      setTimerEventDefinition(undefined, element, modeler, updateProperties)
    }
    if (!isSupportErrorEventDefinition(element)) {
      setErrorEventDefinition(undefined, element, modeler, updateProperties)
    }
    if (!isSupportConditionExpression(element)) {
      setConditionExpression(undefined, element, modeler, updateProperties)
    }
    if (!isSupportDefaultFlow(element)) {
      setDefaultFlow(undefined, element, modeler, updateProperties)
    }
    if (!isSupportAsync(element)) {
      setAsync(undefined, element, modeler, updateProperties)
    }
    if (!isSupportExclusive(element)) {
      setExclusive(undefined, element, modeler, updateProperties)
    }
    if (!isSupportMultiInstanceLoopCharacteristics(element)) {
      setMultiInstanceLoopCharacteristics(undefined, element, modeler, updateProperties)
    }
    if (!isSupportIsForCompensation(element)) {
      setIsForCompensation(undefined, element, modeler, updateProperties)
    }
    if (!isSupportAssignments(element)) {
      setAssignments(undefined, element, modeler, updateProperties)
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
  } else if (type === 'defaultFlow') {
    return isSupportDefaultFlow(element)
  } else if (type === 'asynchronous') {
    return isSupportAsync(element)
  } else if (type === 'exclusive') {
    return isSupportExclusive(element)
  } else if (type === 'isSequential') {
    return isSupportMultiInstanceLoopCharacteristics(element)
  } else if (type === 'loopCardinality') {
    return isSupportMultiInstanceLoopCharacteristics(element)
  } else if (type === 'collection') {
    return isSupportMultiInstanceLoopCharacteristics(element)
  } else if (type === 'elementVariable') {
    return isSupportMultiInstanceLoopCharacteristics(element)
  } else if (type === 'completionCondition') {
    return isSupportMultiInstanceLoopCharacteristics(element)
  } else if (type === 'isForCompensation') {
    return isSupportIsForCompensation(element)
  } else if (type === 'assignments') {
    return isSupportAssignments(element)
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
 * 更新元素
 * @param modeler
 * @param element
 * @param props
 */
function updateProperties (modeler, element, props) {
  getModeling(modeler).updateProperties(element, props)
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
export function getElementRegistry (modeler) {
  return modeler.get('elementRegistry')
}
/**
 * 画布
 */
export function getCanvas (modeler) {
  return modeler.get('canvas')
}
/**
 * 消息中心
 */
export function getEventBus (modeler) {
  return modeler.get('eventBus')
}
/**
 * 模型
 */
export function getModeling (modeler) {
  return modeler.get('modeling')
}
/**
 * bpmn工厂
 */
export function getBpmnFactory (modeler) {
  return modeler.get('bpmnFactory')
}
/**
 * 命令栈
 */
export function getCommandStack (modeler) {
  return modeler.get('commandStack')
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
