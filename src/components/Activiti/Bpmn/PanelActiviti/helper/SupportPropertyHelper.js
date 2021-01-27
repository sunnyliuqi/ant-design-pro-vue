/**
 *  是否支持
 * @param element
 * @returns {boolean}
 */
import { isSupportExecutionListeners } from './props/ExecutionListeners'
import { isSupportInitiator } from './props/Initiator'
import { isSupportFormKey } from './props/FormKey'
import { isSupportFormProperties } from './props/FormProperties'
import { isSupportMessageEventDefinition } from './props/MessageEventDefinition'
import { isSupportConditionalEventDefinition } from './props/ConditionalEventDefinition'
import { isSupportSignalEventDefinition } from './props/SignalEventDefinition'
import { isSupportTimerEventDefinition } from './props/TimerEventDefinition'
import { isSupportErrorEventDefinition } from './props/ErrorEventDefinition'

export function supportExecutionListeners (element) {
  return isSupportExecutionListeners(element)
}

export function supportInitiator (element) {
  return isSupportInitiator(element)
}

export function supportFormKey (element) {
  return isSupportFormKey(element)
}

export function supportFormProperties (element) {
  return isSupportFormProperties(element)
}

export function supportMessageEventDefinition (element) {
  return isSupportMessageEventDefinition(element)
}

export function supportConditionalEventDefinition (element) {
  return isSupportConditionalEventDefinition(element)
}

export function supportSignalEventDefinition (element) {
  return isSupportSignalEventDefinition(element)
}

export function supportTimerEventDefinition (element) {
  return isSupportTimerEventDefinition(element)
}

export function supportErrorEventDefinition (element) {
  return isSupportErrorEventDefinition(element)
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

export function getEventDefinitionType (element) {
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
      } else if (moddleElement.$type === 'bpmn:ErrorEventDefinition') {
        return 'error'
      }
    }
  }
  return 'none'
}

export function getEndEventType (element) {
  if (element.type === 'bpmn:EndEvent') {
    return true
  }
  return false
}
