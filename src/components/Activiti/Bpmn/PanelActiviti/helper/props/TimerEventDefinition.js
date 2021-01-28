import {
  createElement,
  filterByType,
  getBusinessObject, removeByType
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import { setFormalExpression, getFormalExpression } from './FormalExpression'
import {
  getEventDefinitionType,
  getIntermediateEventType,
  getStartEventType
} from '../SupportPropertyHelper'
/**
 * 设置/创建 TimerEventDefinition 元素
 * @param propertyValue
 * @param element
 * @param factory
 * @param updateProperties
 */
export function setTimerEventDefinition (propertyValue, element, factory, updateProperties) {
  let oldTimerEventDefinition = getTimerEventDefinition(element)
  if (isEmpty(oldTimerEventDefinition)) {
    const key = propertyValue && Object.keys(propertyValue)[0]
    if (!key || !propertyValue[key]) {
      oldTimerEventDefinition = removeByType(getBusinessObject(element).eventDefinitions, 'bpmn:TimerEventDefinition')
    } else {
      oldTimerEventDefinition = []
      oldTimerEventDefinition.push(createElementTimerEventDefinition(propertyValue, element, factory))
    }
  } else {
    propertyValue = Object.assign({}, JSON.parse(oldTimerEventDefinition), propertyValue)
    oldTimerEventDefinition = []
    oldTimerEventDefinition.push(createElementTimerEventDefinition(propertyValue, element, factory))
}
  if (updateProperties) {
    const _property = {}
    _property.eventDefinitions = oldTimerEventDefinition
    updateProperties(element, _property)
  } else {
    return oldTimerEventDefinition
  }
}
function createElementTimerEventDefinition (timer, element, factory) {
  const property = {}
  if (timer.timeDate) {
    property.timeDate = {}
  }
  if (timer.timeCycle) {
    property.timeCycle = {}
  }
  if (timer.timeDuration) {
    property.timeDuration = {}
  }
  const timerElement = createElement('bpmn:TimerEventDefinition', property, element, factory)
  if (timer.timeDate) {
    timerElement.timeDate = setFormalExpression(timer.timeDate, timerElement, factory, undefined)
  }
  if (timer.timeCycle) {
    timerElement.timeCycle = setFormalExpression(timer.timeCycle, timerElement, factory, undefined)
  }
  if (timer.timeDuration) {
    timerElement.timeDuration = setFormalExpression(timer.timeDuration, timerElement, factory, undefined)
  }
  return timerElement
}
/**
 * 获取
 * @param element
 */
export function getTimerEventDefinition (element) {
  const eventDefinitions = getBusinessObject(element).eventDefinitions
  if (eventDefinitions && eventDefinitions.length > 0) {
    const properties = filterByType(eventDefinitions, 'bpmn:TimerEventDefinition')
    if (properties && properties.length > 0) {
      const property = properties[0]
      const timerEventDefinition = {}
      if (property.timeDate) {
        timerEventDefinition.timeDate = getFormalExpression(property.timeDate)
      }
      if (property.timeCycle) {
        timerEventDefinition.timeCycle = getFormalExpression(property.timeCycle)
      }
      if (property.timeDuration) {
        timerEventDefinition.timeDuration = getFormalExpression(property.timeDuration)
      }
      return JSON.stringify(timerEventDefinition)
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportTimerEventDefinition (element) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'timer') {
    return true
  }
  if (getIntermediateEventType(element) && getEventDefinitionType(element) === 'timer') {
    return true
  }
  return false
}
