import { createElement, getBusinessObject } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置/创建 Documentation 元素
 * @param text
 * @param element
 * @param factory
 * @param updateProperties
 */
export function setDocumentation (text, element, factory, updateProperties) {
  const bo = getBusinessObject(element)
  if (isEmpty(text)) {
    bo.documentation = null
  } else {
    let documentations = bo.documentation
    if (documentations && documentations.length > 0) {
      const documentation = documentations[0]
      documentation.text = text
    } else {
      documentations = []
      documentations.push(createElement('bpmn:Documentation', { text: text }, element, factory))
    }
    bo.documentation = documentations
  }
  if (updateProperties) {
    const _property = {}
    _property.documentation = bo.documentation
    updateProperties(element, _property)
  } else {
    return bo.documentation
  }
}

export function getDocumentation (element) {
  return element.businessObject && element.businessObject.documentation && element.businessObject.documentation[0] && element.businessObject.documentation[0].text
}
