import {
  getBpmnFactory, createElement,
  getExtensionElements,
  getPropertyValue,
  removeByType,
  filterByType,
  getBusinessObject,
  getConnectType,
  getEventDefinitionType,
  getIntermediateEventType
} from '../PropertyHelper'
import { setFields, getFields } from './Fields'
import { isEmpty } from '@/utils/common'

/**
 * 设置 TaskListeners
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setTaskListeners (propertyValue, element, modeler, updateProperties) {
  let extensionElements = getExtensionElements(element, getBpmnFactory(modeler))
  extensionElements.values = removeByType(extensionElements.values, 'activiti:TaskListener')
  if (!isEmpty(propertyValue)) {
    pushElementTaskListeners(propertyValue, extensionElements, modeler)
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

/**
 *
 * @param propertyValue [{event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }]
 * @param element
 * @param modeler
 */
function pushElementTaskListeners (propertyValue, element, modeler) {
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('任务监听器内容格式不正确，请重新输入')
  }
  if (propertyValue && propertyValue.length > 0) {
    propertyValue.forEach(task => {
      element.values.push(createElementTaskListener(task, element, modeler))
    })
  }
}

/**
 * @param task
 * @param element
 * @param modeler
 */
function createElementTaskListener (task, element, modeler) {
  const property = {}
  property.event = getPropertyValue(task.event)
  property.class = getPropertyValue(task.class)
  property.expression = getPropertyValue(task.expression)
  property.delegateExpression = getPropertyValue(task.delegateExpression)
  if (task.fields && task.fields.length > 0) {
    property.fields = []
  } else {
    property.fields = null
  }
  const taskListenerElement = createElement('activiti:TaskListener', property, element, getBpmnFactory(modeler))
  if (task.fields && task.fields.length > 0) {
    taskListenerElement.fields = setFields(task.fields, taskListenerElement, modeler, undefined)
  }
  return taskListenerElement
}
/**
 * 获取
 * @param element
 */
export function getTaskListeners (element) {
  const extensionElements = getBusinessObject(element).extensionElements
  if (extensionElements) {
    const taskListenerElements = filterByType(extensionElements.values, 'activiti:TaskListener')
    if (taskListenerElements && taskListenerElements.length > 0) {
      const taskListeners = []
      taskListenerElements.forEach(property => {
        const task = {}
        if (property.event) {
          task.event = property.event
        }
        if (property.class) {
          task.class = property.class
        }
        if (property.expression) {
          task.expression = property.expression
        }
        if (property.delegateExpression) {
          task.delegateExpression = property.delegateExpression
        }
        if (property.fields && property.fields.length > 0) {
          task.fields = getFields(property.fields)
        }
        taskListeners.push(task)
      })
      return JSON.stringify(taskListeners)
    }
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportTaskListeners (element) {
  if (element.type.includes('UserTask')) {
    return true
  }
  return false
}
