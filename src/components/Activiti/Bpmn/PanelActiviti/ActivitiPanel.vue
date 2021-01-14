<template>
  <a-form :form="formPanel">
    <a-tabs :default-active-key="tabKey" :active-key="tabKey" @change="changeActiveTab" class="panelProperties">
      <a-tab-pane key="1" tab="节点属性">
        <a-row :gutter="16" v-if="element">
          <a-col :span="24">
            <a-form-item
              label="id"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                :disabled="true"
                v-decorator="[
                  'id',
                  {initialValue: element.id,}
                ]"
                placeholder="请输入id"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="名称"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'name',
                  {initialValue: getValues('name',element)}
                ]"
                placeholder="请输入名称"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="描述"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'documentation',
                  {initialValue: getValues('documentation',element)}
                ]"
                placeholder="请输入描述"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showExecutionListeners(element)">
            <a-form-item
              label="执行监听器"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'executionlisteners',
                  {initialValue: getValues('executionlisteners',element)}
                ]"
                placeholder="请选择执行监听器"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showInitiator(element)">
            <a-form-item
              label="发起人"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'initiator',
                  {initialValue: getValues('initiator',element)}
                ]"
                placeholder="请选择发起人"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showFormKey(element)">
            <a-form-item
              label="外置表单"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'formKey',
                  {initialValue: getValues('formKey',element)}
                ]"
                placeholder="请选择外置表单"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showFormProperties(element)">
            <a-form-item
              label="动态表单字段"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'formProperties',
                  {initialValue: getValues('formProperties',element)}
                ]"
                placeholder="请设置动态表单字段"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showMessageEventDefinition(element)">
            <a-form-item
              label="消息事件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'messageEventDefinition',
                  {initialValue: getValues('messageEventDefinition',element)}
                ]"
                placeholder="请选择消息事件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showConditionalEventDefinition(element)">
            <a-form-item
              label="条件事件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'conditionalEventDefinition',
                  {initialValue: getValues('conditionalEventDefinition',element)}
                ]"
                placeholder="请输入条件事件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showSignalEventDefinition(element)">
            <a-form-item
              label="信号事件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'signalEventDefinition',
                  {initialValue: getValues('signalEventDefinition',element)}
                ]"
                placeholder="请选择信号事件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showTimerEventDefinition(element)">
            <a-form-item
              label="定时周期"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'timeCycle',
                  {initialValue: getValues('timeCycle',element)}
                ]"
                placeholder="请输入定时周期"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showTimerEventDefinition(element)">
            <a-form-item
              label="定时时间"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'timeDate',
                  {initialValue: getValues('timeDate',element)}
                ]"
                placeholder="请输入定时时间"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showTimerEventDefinition(element)">
            <a-form-item
              label="定时期间"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'timeDuration',
                  {initialValue: getValues('timeDuration',element)}
                ]"
                placeholder="请输入定时期间"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="流程属性">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="流程id"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                :disabled="true"
                v-decorator="[
                  'processId',
                  {initialValue: processElement.id,}
                ]"
                placeholder="请输入流程id"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程名称"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'processname',
                  {initialValue: getValues('name',processElement)}
                ]"
                placeholder="请输入流程名称"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程描述"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'processdocumentation',
                  {initialValue: getValues('documentation',processElement)}
                ]"
                placeholder="请输入流程描述"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程作者"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'processauthor',
                  {initialValue: getValues('author',processElement)}
                ]"
                placeholder="请输入流程作者"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程版本"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'processversion',
                  {initialValue: getValues('version',processElement)}
                ]"
                placeholder="请输入流程版本"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程执行监听器"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'processexecutionlisteners',
                  {initialValue: getValues('executionlisteners',processElement)}
                ]"
                placeholder="请选择流程执行监听器"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程事件监听"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'processeventlisteners',
                  {initialValue: getValues('eventlisteners',processElement)}
                ]"
                placeholder="请选择流程事件监听"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程信号定义"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'processsignaldefinitions',
                  {initialValue: getValues('signaldefinitions',processElement)}
                ]"
                placeholder="请选择流程信号定义"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程消息定义"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'processmessagedefinitions',
                  {initialValue: getValues('messagedefinitions',processElement)}
                ]"
                placeholder="请选择流程消息定义"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </a-form>
</template>

<script>
  export default {
    name: 'ActivitiPanel',
    props: {
      updateBpmn: {
        type: Function,
        default: undefined
      },
      getValues: {
        type: Function,
        default: undefined
      },
      element: {
        type: Object,
        default: undefined
      }
    },
    data () {
      return {
        formPanel: this.$form.createForm(this, { onFieldsChange: this.onPanelFieldsChange }),
        tabKey: '2',
        processElement: { }
      }
    },
    mounted () {
    },
    computed: {
    },
    watch: {
      element: function (val) {
        if (val && val.type && val.type !== 'bpmn:Process') {
          this.tabKey = '1'
        } else {
          this.processElement = val
          this.tabKey = '2'
        }
        this.formPanel.resetFields()
      }
    },
    methods: {
      showInitiator (element) {
        if (element.type === 'bpmn:StartEvent' && this.getStartEventType(element) === 'none') {
          return true
        }
        return false
      },
      showFormKey (element) {
        if (element.type === 'bpmn:StartEvent' && this.getStartEventType(element) === 'none') {
          return true
        }
        return false
      },
      showFormProperties (element) {
        if (element.type === 'bpmn:StartEvent' && this.getStartEventType(element) === 'none') {
          return true
        }
        return false
      },
      showMessageEventDefinition (element) {
        if (element.type === 'bpmn:StartEvent' && this.getStartEventType(element) === 'message') {
          return true
        }
        return false
      },
      showConditionalEventDefinition (element) {
        if (element.type === 'bpmn:StartEvent' && this.getStartEventType(element) === 'conditional') {
          return true
        }
        return false
      },
      showSignalEventDefinition (element) {
        if (element.type === 'bpmn:StartEvent' && this.getStartEventType(element) === 'signal') {
          return true
        }
        return false
      },
      showTimerEventDefinition (element) {
        if (element.type === 'bpmn:StartEvent' && this.getStartEventType(element) === 'timer') {
          return true
        }
        return false
      },
      getStartEventType (element) {
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
      },
      showExecutionListeners (element) {
        if (element.type === 'bpmn:StartEvent') {
          return true
        }
        return false
      },
      changeActiveTab (key) {
        if (this.element && this.element.type && this.element.type !== 'bpmn:Process') {
            this.tabKey = key
        } else {
          this.$message.info('没有选中的节点')
        }
      },
      onPanelFieldsChange (props, fields) {
        if (this.updateBpmn) {
          const fieldKeys = Object.keys(fields)
          if (fieldKeys && fieldKeys.length > 0) {
            const properties = {}
            fieldKeys.forEach(key => {
              properties[key.replace('process', '')] = fields[key].value
            })
            this.updateBpmn(this.element, properties)
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
.panelProperties{
  padding: 4px;
}
</style>
