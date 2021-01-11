'use strict'

/**
 * 根据传入的表单properties获取对应bpmn properties
 * @param element
 * @param properties
 * @param factory
 */
export default function getProperties (element, properties, factory) {
  return new Promise((resolve, reject) => {
    try {
      const propertyNames = properties && Object.keys(properties)
      const _properties = {}
      if (propertyNames && propertyNames.length > 0) {
        propertyNames.forEach(propertyName => {
          setProperty(_properties, propertyName, properties[propertyName], element, factory)
        })
      }
      return resolve(_properties)
    } catch (e) {
      return reject(e.message)
    }
  })
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
  } else if (propertyName === 'executionlisteners') {
      setExecutionListeners(_properties, propertyValue, element, factory)
  } else {
    _properties[propertyName] = propertyValue
  }
}

function setExecutionListeners (_properties, propertyValue, element, factory) {
  const extensionElements = getExtensionElements(element, factory)
  extensionElements.values = removeByType(extensionElements.values, 'activiti:ExecutionListener')
  pushElementExecutionListeners(extensionElements, propertyValue, element, factory)
  _properties.extensionElements = extensionElements
}

/**
 *
 * @param extensionElements
 * @param propertyValue [{event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }]
 * @param element
 * @param factory
 */
function pushElementExecutionListeners (extensionElements, propertyValue, element, factory) {
  if (typeof (propertyValue) === 'string' && (propertyValue === '' || propertyValue.trim() === '')) {
      return
  }
  try {
    if (!(propertyValue instanceof Array)) {
      propertyValue = JSON.parse(propertyValue)
    }
  } catch (e) {
    throw new Error('执行监听器内容格式不正确，请重新输入')
  }
    if (propertyValue && propertyValue.length > 0) {
      propertyValue.forEach(execution => {
        extensionElements.values.push(createElementExecutionListener(extensionElements, execution, element, factory))
      })
    }
}

/**
 *
 * @param execution {event:'start',delegateExpression:'${delegateExpression}',class:'',expression:'',fields:[{name:'',stringValue:'',string:'',expression:''}] }
 * @param element
 * @param factory
 */
function createElementExecutionListener (extensionElements, execution, element, factory) {
    const property = {}
    if (execution.event) {
      property.event = execution.event
    }
  if (execution.class) {
    property.class = execution.class
  }
  if (execution.expression) {
    property.expression = execution.expression
  }
  if (execution.delegateExpression) {
    property.delegateExpression = execution.delegateExpression
  }
  if (execution.fields && execution.fields.length > 0) {
    property.fields = []
  }
  const executionListenerElement = createElement('activiti:ExecutionListener', property, extensionElements, factory)
  if (execution.fields && execution.fields.length > 0) {
    createElementFields(execution.fields, executionListenerElement, factory)
  }
  return executionListenerElement
}
function createElementFields (fields, parentElement, factory) {
  fields.forEach(field => {
      parentElement.fields.push(createElementField(field, parentElement, factory))
    })
}

/**
 *
 * @param field {name:'',stringValue:'',string:'',expression:''}
 * @param parentElement
 * @param factory
 */
function createElementField (field, parentElement, factory) {
  const property = {}
  if (field.name) {
    property.name = field.name
  }
  if (field.stringValue) {
    property.stringValue = field.stringValue
  }
  if (field.string) {
    property.string = field.string
  }
  if (field.expression) {
    property.expression = field.expression
  }
  const fieldElement = createElement('activiti:Field', property, parentElement, factory)
  return fieldElement
}
function getExtensionElements (element, factory) {
  let extensionElements = getBusinessObject(element).extensionElements
  if (!extensionElements) {
    extensionElements = createElement('bpmn:ExtensionElements', { values: [] }, element, factory)
  }
  return extensionElements
}
function removeByType (values, type) {
  if (values && values.length > 0) {
    return values.filter(c => type !== c.$type)
  } else {
    return []
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
    documentations.values.push(createElement('bpmn:Documentation', { text: text }, element, factory))
  }
   _properties.documentation = documentations
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
