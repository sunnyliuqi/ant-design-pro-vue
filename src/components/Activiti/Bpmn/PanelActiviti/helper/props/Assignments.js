import {
  getBpmnFactory, createElement,
  filterByType,
  getBusinessObject, removeByType, getEventDefinitionType,
  getIntermediateEventType,
  getStartEventType, getPropertyValue
} from '../PropertyHelper'
import { isEmpty } from '@/utils/common'
/**
 * 设置/创建 Assignments 元素
 * @param propertyValue
 * @param element
 * @param modeler
 * @param updateProperties
 */
export function setAssignments (propertyValue, element, modeler, updateProperties) {
  try {
    if (isEmpty(propertyValue)) {
      propertyValue = undefined
    } else if (!(propertyValue instanceof Object)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('分配内容格式不正确，请重新输入')
  }
  const assignments = createAssignments(propertyValue, element, modeler)
  if (updateProperties) {
    const _property = assignments
    updateProperties(modeler, element, _property)
  } else {
    return assignments
  }
}
function createAssignments (assignments, element, modeler) {
  const property = {}
  if (!assignments) {
    property.assignee = undefined
    property.candidateUsers = undefined
    property.candidateGroups = undefined
  } else {
    if (!assignments.assignee) {
      property.assignee = undefined
    } else {
      property.assignee = assignments.assignee
    }
    if (!assignments.candidateUsers) {
      property.candidateUsers = undefined
    } else {
      property.candidateUsers = assignments.candidateUsers
    }
    if (!assignments.candidateGroups) {
      property.candidateGroups = undefined
    } else {
      property.candidateGroups = assignments.candidateGroups
    }
  }

  return property
}
/**
 * 获取
 * @param element
 */
export function getAssignments (element) {
  const bo = getBusinessObject(element)
  if (bo) {
    const assignments = {}
    if (bo.assignee) {
      assignments.assignee = bo.assignee
    }
    if (bo.candidateUsers) {
      assignments.candidateUsers = bo.candidateUsers
    }
    if (bo.candidateGroups) {
      assignments.candidateGroups = bo.candidateGroups
    }
    return JSON.stringify(assignments)
  }
  return undefined
}

/**
 * 是否支持
 * @param element
 * @returns {boolean}
 */
export function isSupportAssignments (element) {
  if (element.type.includes('UserTask')) {
    return true
  }
  return false
}
