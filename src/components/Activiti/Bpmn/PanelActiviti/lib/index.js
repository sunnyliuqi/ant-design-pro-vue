import PropertiesPanel from './PropertiesPanel'
import cmd from 'bpmn-js-properties-panel-activiti/lib/cmd'
import translate from 'diagram-js/lib/i18n/translate'
export default {
  __depends__: [
    cmd,
    translate
  ],
  __init__: [ 'propertiesPanel' ],
  propertiesPanel: ['type', PropertiesPanel]
}
