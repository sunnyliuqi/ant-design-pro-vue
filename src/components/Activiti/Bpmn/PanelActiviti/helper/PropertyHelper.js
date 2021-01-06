'use strict'

/**
 * 根据传入的表单properties获取对应bpmn properties
 * @param element
 * @param properties
 * @param factory
 */
export default function getProperties (element, properties, factory) {
  const propertyNames = properties && Object.keys(properties)
  const _properties = {}
  if (propertyNames && propertyNames.length > 0) {
      propertyNames.forEach(propertyName => {
        setProperty(_properties, propertyName, properties[propertyName], element, factory)
      })
  }
  return _properties
}
/**
 * 获取bpmn property
 * @param _properties
 * @param propertyName
 * @param propertyValue
 * @param element
 * @param factory
 */
function setProperty (_properties, propertyName, propertyValue, element, factory) {
  if (propertyName === 'documentation') {
    setPropertyDocumentation(_properties, propertyValue, element, factory)
  } else {
    _properties[propertyName] = propertyValue
  }
}

/**
 * 更新Documentation
 * @param text
 * @param parent
 * @param factory
 */
function setPropertyDocumentation (_properties, text, element, factory) {
  const documentations = getBusinessObject(element).documentation
  let documentation
  if (documentations && documentations.length > 0) {
    documentation = documentations[0]
    documentation.text = text
  } else {
    documentation = createElement('bpmn:Documentation', { text: text }, element, factory)
  }
   _properties.documentation = [documentation]
}

export function getBusinessObject (element) {
  return (element && element.businessObject) || element
}
/**
 * Creates a new element and set the parent to it
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
    var element = factory.create(elementType, properties)
    element.$parent = parent
    return element
}
