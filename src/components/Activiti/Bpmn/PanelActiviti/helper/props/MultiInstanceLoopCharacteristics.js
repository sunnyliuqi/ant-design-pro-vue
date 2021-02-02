import {
  getBpmnFactory, createElement,
  filterByType,
  getBusinessObject, removeByType, getEventDefinitionType,
  getIntermediateEventType,
  getStartEventType, getPropertyValue,
  getEventSubProcessType
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 MultiInstanceLoopCharacteristics 元素
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setMultiInstanceLoopCharacteristics (propertyValue, element, modeler, updateProperties) {
  let oldMultiInstanceLoopCharacteristics = getMultiInstanceLoopCharacteristics(element)
  if (isEmpty(oldMultiInstanceLoopCharacteristics)) {
    const key = propertyValue && Object.keys(propertyValue)[0]
    if (!key || !propertyValue[key]) {
      oldMultiInstanceLoopCharacteristics = undefined
    } else {
      oldMultiInstanceLoopCharacteristics = createElementMultiInstanceLoopCharacteristics(propertyValue, element, modeler)
    }
  } else {
    propertyValue = Object.assign({}, JSON.parse(oldMultiInstanceLoopCharacteristics), propertyValue)
    oldMultiInstanceLoopCharacteristics = createElementMultiInstanceLoopCharacteristics(propertyValue, element, modeler)
}
  if (updateProperties) {
    const _property = {}
    _property.loopCharacteristics = oldMultiInstanceLoopCharacteristics
    updateProperties(modeler, element, _property)
  } else {
    return oldMultiInstanceLoopCharacteristics
  }
}
function createElementMultiInstanceLoopCharacteristics (multiInstanceLoopCharacteristics, element, modeler) {
  const property = {}
  if (multiInstanceLoopCharacteristics.isSequential) {
    property.isSequential = multiInstanceLoopCharacteristics.isSequential
  }
  if (multiInstanceLoopCharacteristics.collection) {
    property.collection = multiInstanceLoopCharacteristics.collection
  }
  if (multiInstanceLoopCharacteristics.elementVariable) {
    property.elementVariable = multiInstanceLoopCharacteristics.elementVariable
  }
  if (multiInstanceLoopCharacteristics.loopCardinality) {
    property.loopCardinality = {}
  }
  if (multiInstanceLoopCharacteristics.completionCondition) {
    property.completionCondition = {}
  }
  if (Object.keys(property).length < 1) {
    return undefined
  }
  const MultiInstanceLoopCharacteristicsElement = createElement('bpmn:MultiInstanceLoopCharacteristics', property, element, getBpmnFactory(modeler))
  if (multiInstanceLoopCharacteristics.loopCardinality) {
    MultiInstanceLoopCharacteristicsElement.loopCardinality = createElementExpression(multiInstanceLoopCharacteristics.loopCardinality, MultiInstanceLoopCharacteristicsElement, modeler, undefined)
  }
  if (multiInstanceLoopCharacteristics.completionCondition) {
    MultiInstanceLoopCharacteristicsElement.completionCondition = createElementExpression(multiInstanceLoopCharacteristics.completionCondition, MultiInstanceLoopCharacteristicsElement, modeler, undefined)
  }
  return MultiInstanceLoopCharacteristicsElement
}
/**
 * 获取
 * @param element
 */
export function getMultiInstanceLoopCharacteristics (element) {
  const multiInstanceLoopCharacteristics = getBusinessObject(element).loopCharacteristics
  if (multiInstanceLoopCharacteristics) {
    const loopCharacteristics = {}
    if (multiInstanceLoopCharacteristics.isSequential) {
      loopCharacteristics.isSequential = multiInstanceLoopCharacteristics.isSequential
    }
    if (multiInstanceLoopCharacteristics.collection) {
      loopCharacteristics.collection = multiInstanceLoopCharacteristics.collection
    }
    if (multiInstanceLoopCharacteristics.elementVariable) {
      loopCharacteristics.elementVariable = multiInstanceLoopCharacteristics.elementVariable
    }
    if (multiInstanceLoopCharacteristics.loopCardinality) {
      loopCharacteristics.loopCardinality = getElementExpression(multiInstanceLoopCharacteristics.loopCardinality)
    }
    if (multiInstanceLoopCharacteristics.completionCondition) {
      loopCharacteristics.completionCondition = getElementExpression(multiInstanceLoopCharacteristics.completionCondition)
    }
    return JSON.stringify(loopCharacteristics)
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportMultiInstanceLoopCharacteristics (element) {
  if (element.type.includes('Task')) {
    return true
  }
  if (getEventSubProcessType(element)) {
    return true
  }
  return false
}
function createElementExpression (value, parentElement, modeler) {
  const property = {}
  property.body = getPropertyValue(value)
  return createElement('bpmn:Expression', property, parentElement, getBpmnFactory(modeler))
}
function getElementExpression (element) {
  if (element) {
    return element.body
  }
  return undefined
}
