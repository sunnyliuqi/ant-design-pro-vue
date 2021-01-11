import { createElement, getBusinessObject } from '../PropertyHelper'

/**
 * 设置/创建 Documentation 元素
 * @param _properties
 * @param text
 * @param element
 * @param factory
 */
export default function setDocumentation (_properties, text, element, factory) {
  const documentations = getBusinessObject(element).documentation
  let documentation
  if (documentations && documentations.length > 0) {
    documentation = documentations[0]
    documentation.text = text
  } else {
    documentations.values.push(createElement('bpmn:Documentation', { text: text }, element, factory))
  }
  _properties.documentation = documentations
}
