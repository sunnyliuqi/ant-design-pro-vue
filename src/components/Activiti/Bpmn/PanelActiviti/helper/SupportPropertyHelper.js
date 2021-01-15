import { isEmpty } from '@/utils/common'
import { setDocumentation } from './props/Documentation'
import { setExecutionListeners } from './props/ExecutionListeners'
import { setEventListeners } from './props/EventListeners'
import { setSignalDefinitions } from './props/SignalDefinitions'
import { setMessageDefinitions } from './props/MessageDefinitions'
import { setInitiator } from './props/Initiator'
import { getFormKey, setFormKey } from './props/FormKey'
import { setFormProperties } from './props/FormProperties'
import { setMessageEventDefinition } from './props/MessageEventDefinition'
import {
  getConditionalEventDefinition, setConditionalEventDefinition
} from './props/ConditionalEventDefinition'
import {
  getSignalEventDefinition
} from './props/SignalEventDefinition'
import {
  getTimerEventDefinition, setTimerEventDefinition
} from './props/TimerEventDefinition'
/**
 *  是否支持
 * @param element
 * @returns {boolean}
 */
export function supportExecutionListeners (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent') {
    return true
  }
  const intermediateCatchEventType = getIntermediateEventDefinitionType(element)
  if (getIntermediateEventType(element) && intermediateCatchEventType === 'none' || intermediateCatchEventType === 'message' || intermediateCatchEventType === 'timer') {
    return true
  }
  const _properties = {}
  setExecutionListeners(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function supportInitiator (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'none') {
    return true
  }
  const _properties = {}
  setInitiator(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function supportFormKey (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'none') {
    return true
  }
  const _properties = {}
  setFormKey(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function supportFormProperties (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'none') {
    return true
  }
  const _properties = {}
  setFormProperties(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function supportMessageEventDefinition (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'message') {
    return true
  }
  if (getIntermediateEventType(element) && getIntermediateEventDefinitionType(element) === 'message') {
    return true
  }
  const _properties = {}
  setMessageEventDefinition(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function supportConditionalEventDefinition (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'conditional') {
    return true
  }
  if (getIntermediateEventType(element) && getIntermediateEventDefinitionType(element) === 'conditional') {
    return true
  }
  const _properties = {}
  setConditionalEventDefinition(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function supportSignalEventDefinition (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'signal') {
    return true
  }
  if (getIntermediateEventType(element) && getIntermediateEventDefinitionType(element) === 'signal') {
    return true
  }
  const _properties = {}
  setSignalDefinitions(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function supportTimerEventDefinition (element, updateProperties, factory) {
  if (element.type === 'bpmn:StartEvent' && getStartEventType(element) === 'timer') {
    return true
  }
  if (getIntermediateEventType(element) && getIntermediateEventDefinitionType(element) === 'timer') {
    return true
  }
  const _properties = {}
  setTimerEventDefinition(_properties, null, element, factory)
  updateProperties(element, _properties)
  return false
}
export function getStartEventType (element) {
  if (element.businessObject && element.businessObject.eventDefinitions && element.businessObject.eventDefinitions.length > 0) {
    const moddleElement = element.businessObject.eventDefinitions[0]
    if (moddleElement) {
      if (moddleElement.$type === 'bpmn:MessageEventDefinition') {
        return 'message'
      } else if (moddleElement.$type === 'bpmn:TimerEventDefinition') {
        return 'timer'
      } else if (moddleElement.$type === 'bpmn:ConditionalEventDefinition') {
        return 'conditional'
      } else if (moddleElement.$type === 'bpmn:SignalEventDefinition') {
        return 'signal'
      }
    }
  }
  return 'none'
}
export function getIntermediateEventType (element) {
  if (element.type === 'bpmn:IntermediateThrowEvent' || element.type === 'bpmn:IntermediateCatchEvent') {
    return true
  }
  return false
}
export function getIntermediateEventDefinitionType (element) {
  if (element.businessObject && element.businessObject.eventDefinitions && element.businessObject.eventDefinitions.length > 0) {
    const moddleElement = element.businessObject.eventDefinitions[0]
    if (moddleElement) {
      if (moddleElement.$type === 'bpmn:MessageEventDefinition') {
        return 'message'
      } else if (moddleElement.$type === 'bpmn:TimerEventDefinition') {
        return 'timer'
      } else if (moddleElement.$type === 'bpmn:EscalationEventDefinition') {
        return 'escalation'
      } else if (moddleElement.$type === 'bpmn:ConditionalEventDefinition') {
        return 'conditional'
      } else if (moddleElement.$type === 'bpmn:LinkEventDefinition') {
        return 'link'
      } else if (moddleElement.$type === 'bpmn:SignalEventDefinition') {
        return 'signal'
      } else if (moddleElement.$type === 'bpmn:CompensateEventDefinition') {
        return 'compensate'
      }
    }
  }
  return 'none'
}
