import {
  createElement,
  filterByType,
  getBusinessObject, removeByType
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
import { setFormalExpression, getFormalExpression } from './FormalExpression'
import {
  getIntermediateEventDefinitionType,
  getIntermediateEventType,
  getStartEventType
} from '../SupportPropertyHelper'
/**
 * 设置/创建 TimerEventDefinition 元素
 * @param _properties
 * @param propertyValue
 * @param element
 * @param factory
 */
export function setTimerEventDefinition (_properties, propertyValue, element, factory) {
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
  _properties.eventDefinitions = oldTimerEventDefinition
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
    timerElement.timeDate = setFormalExpression(timerElement, timer.timeDate, timerElement, factory)
  }
  if (timer.timeCycle) {
    timerElement.timeCycle = setFormalExpression(timerElement, timer.timeCycle, timerElement, factory)
  }
  if (timer.timeDuration) {
    timerElement.timeDuration = setFormalExpression(timerElement, timer.timeDuration, timerElement, factory)
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
  if (getIntermediateEventType(element) && getIntermediateEventDefinitionType(element) === 'timer') {
    return true
  }
  return false
}
