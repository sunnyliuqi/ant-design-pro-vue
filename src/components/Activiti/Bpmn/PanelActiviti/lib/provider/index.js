import ActivitiPropertiesProvider from './ActivitiPropertiesProvider.js'
import elementTemplates from 'bpmn-js-properties-panel-activiti/lib/provider/activiti/element-templates'
import translate from 'diagram-js/lib/i18n/translate'
export default {
  __depends__: [
    elementTemplates,
    translate
  ],
  __init__: [ 'propertiesProvider' ],
  propertiesProvider: [ 'type', ActivitiPropertiesProvider ]
}
