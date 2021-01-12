import { createElement, getBusinessObject } from '../PropertyHelper'
import { isEmpty } from '@/utils/common'

/**
 * 设置/创建 Documentation 元素
 * @param _properties
 * @param text
 * @param element
 * @param factory
 */
export default function setDocumentation (_properties, text, element, factory) {
  if (isEmpty(text)) {
    _properties.documentation = null
    return
  }
  let documentations = getBusinessObject(element).documentation
  if (documentations && documentations.length > 0) {
    const documentation = documentations[0]
    documentation.text = text
  } else {
    documentations = []
    documentations.push(createElement('bpmn:Documentation', { text: text }, element, factory))
  }
  _properties.documentation = documentations
}
