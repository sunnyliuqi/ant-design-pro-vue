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
                  {initialValue: element.businessObject&&element.businessObject.name,}
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
                  {initialValue: getDocumentation(element)}
                ]"
                placeholder="描述"/>
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
                  {initialValue: processElement.businessObject&&processElement.businessObject.name,}
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
                  {initialValue: getDocumentation(processElement)}
                ]"
                placeholder="请输入流程描述"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程命名空间"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-input
                v-decorator="[
                  'processnamespace',
                  {initialValue: processElement.namespace||'http://www.activiti.org/processdef',}
                ]"
                placeholder="请输入流程命名空间"/>
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
                  {initialValue: processElement.author,}
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
                  {initialValue: processElement.version,}
                ]"
                placeholder="请输入流程版本"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="流程执行监听"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }">
              <a-textarea
                v-decorator="[
                  'processexecutionlisteners',
                  {initialValue: processElement.executionlisteners,}
                ]"
                placeholder="请选择流程执行监听todo"/>
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
                  {initialValue: processElement.eventlisteners,}
                ]"
                placeholder="请选择流程事件监听todo"/>
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
                  {initialValue: processElement.signaldefinitions,}
                ]"
                placeholder="请选择流程信号定义todo"/>
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
                  {initialValue: processElement.messagedefinitions,}
                ]"
                placeholder="请选择流程消息定义todo"/>
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
      getDocumentation (element) {
        return element.businessObject && element.businessObject.documentation && element.businessObject.documentation[0] && element.businessObject.documentation[0].text
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
