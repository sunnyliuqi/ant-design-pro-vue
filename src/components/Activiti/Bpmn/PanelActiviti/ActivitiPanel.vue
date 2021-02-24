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
          <a-col :span="24" v-if="supportProperty('executionListeners', element)">
            <a-form-item
              label="执行监听器"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <execution-listeners
                v-model="executionListenersValues"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('messageEventDefinition',element)">
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
          <a-col :span="24" v-if="supportProperty('conditionalEventDefinition',element)">
            <a-form-item
              label="条件事件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'conditionalEventDefinition',
                  {initialValue: getValues('conditionalEventDefinition',element)}
                ]"
                placeholder="请输入条件事件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('signalEventDefinition',element)">
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
          <a-col :span="24" v-if="supportProperty('timeCycle',element)">
            <a-form-item
              label="定时周期"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'timeCycle',
                  {initialValue: getValues('timeCycle',element)}
                ]"
                placeholder="请输入定时周期"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('timeDate',element)">
            <a-form-item
              label="定时时间"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'timeDate',
                  {initialValue: getValues('timeDate',element)}
                ]"
                placeholder="请输入定时时间"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('timeDuration',element)">
            <a-form-item
              label="定时期间"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'timeDuration',
                  {initialValue: getValues('timeDuration',element)}
                ]"
                placeholder="请输入定时期间"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('errorEventDefinition',element)">
            <a-form-item
              label="错误事件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'errorEventDefinition',
                  {initialValue: getValues('errorEventDefinition',element)}
                ]"
                placeholder="请输入错误事件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('conditionExpression',element)">
            <a-form-item
              label="程条件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'conditionExpression',
                  {initialValue: getValues('conditionExpression',element)}
                ]"
                placeholder="请输入程条件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('defaultFlow',element)">
            <a-form-item
              label="设为默认"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-checkbox-group
                v-decorator="[
                  'defaultFlow',
                  {initialValue: getValues('defaultFlow',element)}
                ]">
                <a-checkbox :value="true" />
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('asynchronous',element)">
            <a-form-item
              label="设为异步"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-checkbox-group
                v-decorator="[
                  'asynchronous',
                  {initialValue: getValues('asynchronous',element)}
                ]">
                <a-checkbox :value="true" />
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('exclusive',element)">
            <a-form-item
              label="设为排他"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-checkbox-group
                v-decorator="[
                  'exclusive',
                  {initialValue: getValues('exclusive',element)}
                ]">
                <a-checkbox :value="true" />
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('isSequential',element)">
            <a-form-item
              label="是否有序[多]"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-checkbox-group
                v-decorator="[
                  'isSequential',
                  {initialValue: getValues('isSequential',element)}
                ]">
                <a-checkbox :value="true" />
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('loopCardinality',element)">
            <a-form-item
              label="循环基数[多]"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'loopCardinality',
                  {initialValue: getValues('loopCardinality',element)}
                ]"
                placeholder="请输入循环基数"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('collection',element)">
            <a-form-item
              label="集合[多]"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'collection',
                  {initialValue: getValues('collection',element)}
                ]"
                placeholder="请输入集合"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('elementVariable',element)">
            <a-form-item
              label="变量[多]"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'elementVariable',
                  {initialValue: getValues('elementVariable',element)}
                ]"
                placeholder="请输入变量"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('completionCondition',element)">
            <a-form-item
              label="完成条件[多]"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'completionCondition',
                  {initialValue: getValues('completionCondition',element)}
                ]"
                placeholder="请输入完成条件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('isForCompensation',element)">
            <a-form-item
              label="是否补偿"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-checkbox-group
                v-decorator="[
                  'isForCompensation',
                  {initialValue: getValues('isForCompensation',element)}
                ]">
                <a-checkbox :value="true" />
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('initiator',element)">
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
          <a-col :span="24" v-if="supportProperty('formKey',element)">
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
          <a-col :span="24" v-if="supportProperty('formProperties',element)">
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
          <a-col :span="24" v-if="supportProperty('assignments', element)">
            <a-form-item
              label="分配"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'assignments',
                  {initialValue: getValues('assignments',element)}
                ]"
                placeholder="请选择分配"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('initiatorCanComplete',element)">
            <a-form-item
              label="初始人完成"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-checkbox-group
                v-decorator="[
                  'initiatorCanComplete',
                  {initialValue: getValues('initiatorCanComplete',element)}
                ]">
                <a-checkbox :value="true" />
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('dueDate',element)">
            <a-form-item
              label="到期日"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-date-picker
                v-decorator="[
                  'dueDate',
                  {initialValue: getDueDate(getValues('dueDate',element))}
                ]"
                placeholder="请输入到期日"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('priority',element)">
            <a-form-item
              label="优先级"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'priority',
                  {initialValue: getValues('priority',element)}
                ]"
                placeholder="请输入优先级"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('taskListeners', element)">
            <a-form-item
              label="任务监听器"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'taskListeners',
                  {initialValue: getValues('taskListeners',element)}
                ]"
                placeholder="请选择任务监听器"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('rules', element)">
            <a-form-item
              label="规则"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'rules',
                  {initialValue: getValues('rules',element)}
                ]"
                placeholder="请输入规则"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('inputVariables', element)">
            <a-form-item
              label="输入变量"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'inputVariables',
                  {initialValue: getValues('inputVariables',element)}
                ]"
                placeholder="请输入输入变量"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('exclude',element)">
            <a-form-item
              label="排除"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-checkbox-group
                v-decorator="[
                  'exclude',
                  {initialValue: getValues('exclude',element)}
                ]">
                <a-checkbox :value="true" />
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('resultVariables', element)">
            <a-form-item
              label="结果变量"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'resultVariables',
                  {initialValue: getValues('resultVariables',element)}
                ]"
                placeholder="请输入结果变量"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('class', element)">
            <a-form-item
              label="类名"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'class',
                  {initialValue: getValues('class',element)}
                ]"
                placeholder="请输入类名"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('expression', element)">
            <a-form-item
              label="表达式"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'expression',
                  {initialValue: getValues('expression',element)}
                ]"
                placeholder="请输入表达式"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('delegateExpression', element)">
            <a-form-item
              label="代理表达式"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'delegateExpression',
                  {initialValue: getValues('delegateExpression',element)}
                ]"
                placeholder="请输入代理表达式"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('fields', element)">
            <a-form-item
              label="字段"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'fields',
                  {initialValue: getValues('fields',element)}
                ]"
                placeholder="请输入字段"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="supportProperty('resultVariableName', element)">
            <a-form-item
              label="结果变量名"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'resultVariableName',
                  {initialValue: getValues('resultVariableName',element)}
                ]"
                placeholder="请输入结果变量名"/>
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
                  'process-name',
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
                  'process-documentation',
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
                  'process-author',
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
                  'process-version',
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
              <execution-listeners
                v-model="processExecutionListenersValues"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程事件监听"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <event-listeners
                v-model="processEventListenersValues"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程信号定义"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
             <Signals v-model="signalsValues" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程消息定义"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'process-messageDefinitions',
                  {initialValue: getValues('messageDefinitions',processElement)}
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
  import { supportProperty } from './helper/PropertyHelper'
  import { getMoment, formatDate } from '@/utils/common'
  import ExecutionListeners from './components/ExecutionListeners'
  import EventListeners from './components/EventListeners'
  import Signals from './components/Signals'
  export default {
    name: 'ActivitiPanel',
    components: {
      ExecutionListeners,
      EventListeners,
      Signals
    },
    props: {
      updateBpmn: {
        type: Function,
        default: undefined
      },
      getValues: {
        type: Function,
        default: function (propertyName, element) {
          return undefined
        }
      },
      element: {
        type: Object,
        default: undefined
      }
    },
    data () {
      return {
        formPanel: this.$form.createForm(this, { onValuesChange: this.onPanelValuesChange }),
        tabKey: '2',
        getMoment,
        formatDate,
        processElement: {},
        supportProperty,
        executionListenersValues: undefined,
        processExecutionListenersValues: undefined,
        processEventListenersValues: undefined,
        signalsValues: undefined
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
        this.executionListenersValues = this.getValues('executionListeners', this.element)
        this.processExecutionListenersValues = this.getValues('executionListeners', this.processElement)
        this.processEventListenersValues = this.getValues('eventListeners', this.processElement)
        this.signalsValues = this.getValues('signalDefinitions', this.processElement)
      },
      executionListenersValues: function (val) {
        this.onPanelValuesChange(undefined, { 'executionListeners': val })
      },
      processExecutionListenersValues: function (val) {
        this.onPanelValuesChange(undefined, { 'process-executionListeners': val })
      },
      processEventListenersValues: function (val) {
        this.onPanelValuesChange(undefined, { 'process-eventListeners': val })
      },
      signalsValues: function (val) {
        this.onPanelValuesChange(undefined, { 'process-signalDefinitions': val })
      }
    },
    methods: {
      changeActiveTab (key) {
        /* if (this.element && this.element.type && this.element.type !== 'bpmn:Process') {
          this.tabKey = key
        } else {
          this.$message.info('没有选中的节点')
        } */
      },
      getDueDate (value) {
        if (value) {
          return getMoment(value, 'YYYY-MM-DD')
        }
        return value
      },
      onPanelValuesChange (fields, values) {
        if (this.updateBpmn) {
          const fieldKeys = Object.keys(values)
          if (fieldKeys && fieldKeys.length > 0) {
            const properties = {}
            fieldKeys.forEach(key => {
              if (key === 'dueDate') {
                properties[key] = formatDate(values[key], 'YYYY-MM-DD')
              } else {
                properties[key.replace('process-', '')] = values[key]
              }
            })
            this.updateBpmn(this.element, properties)
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .panelProperties {
    padding: 4px;
    /deep/ .ant-tabs-tabpane {
      max-height: 740px;
      overflow-x: hidden;
      overflow-y: auto;
    }

  }
</style>
