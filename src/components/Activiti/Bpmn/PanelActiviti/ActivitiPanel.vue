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
          <a-col :span="24" v-show="supportProperty('executionlisteners', element)">
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
          <a-col :span="24" v-show="supportProperty('initiator',element)">
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
          <a-col :span="24" v-show="supportProperty('formKey',element)">
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
          <a-col :span="24" v-show="supportProperty('formProperties',element)">
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
          <a-col :span="24" v-show="supportProperty('messageEventDefinition',element)">
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
          <a-col :span="24" v-show="supportProperty('conditionalEventDefinition',element)">
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
          <a-col :span="24" v-show="supportProperty('signalEventDefinition',element)">
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
          <a-col :span="24" v-show="supportProperty('timeCycle',element)">
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
          <a-col :span="24" v-show="supportProperty('timeDate',element)">
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
          <a-col :span="24" v-show="supportProperty('timeDuration',element)">
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
          <a-col :span="24" v-show="supportProperty('errorEventDefinition',element)">
            <a-form-item
              label="错误事件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'errorEventDefinition',
                  {initialValue: getValues('errorEventDefinition',element)}
                ]"
                placeholder="请输入错误事件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-show="supportProperty('conditionExpression',element)">
            <a-form-item
              label="程条件"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'conditionExpression',
                  {initialValue: getValues('conditionExpression',element)}
                ]"
                placeholder="请输入程条件"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-show="supportProperty('defaultFlow',element)">
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
          <a-col :span="24" v-show="supportProperty('asynchronous',element)">
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
          <a-col :span="24" v-show="supportProperty('exclusive',element)">
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
  import { supportProperty } from './helper/PropertyHelper'
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
        formPanel: this.$form.createForm(this, { onValuesChange: this.onPanelValuesChange }),
        tabKey: '2',
        processElement: {},
        supportProperty
      }
    },
    mounted () {
    },
    computed: {},
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
      changeActiveTab (key) {
        /* if (this.element && this.element.type && this.element.type !== 'bpmn:Process') {
          this.tabKey = key
        } else {
          this.$message.info('没有选中的节点')
        } */
      },
      onPanelValuesChange (fields, values) {
        if (this.updateBpmn) {
          const fieldKeys = Object.keys(values)
          if (fieldKeys && fieldKeys.length > 0) {
            const properties = {}
            fieldKeys.forEach(key => {
              properties[key.replace('process', '')] = values[key]
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
  }
</style>
