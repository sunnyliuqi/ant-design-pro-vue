<template>
  <a-layout class="bpmnDesign">
    <a-layout>
      <a-layout-header>
        <a-row :gutter="16">
          <a-col :span="24" class="bpmn-header">
            <a-button icon="export" @click="saveSVG">svg</a-button>
            <a-button icon="download" @click="saveDiagram">bpmn</a-button>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <div class="canvas" ref="canvas"></div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider style="min-height: 300px; overflow-x: hidden;">
      <activiti-panel
        :element="current"
        :update-bpmn="updateBpmn"
        :get-values="getValues"
        :form-lists="formLists"
        :user-lists="userLists"
        :group-lists="groupLists"
      />
    </a-layout-sider>

  </a-layout>
</template>

<script>
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import customTranslate from './i18n/customTranslate'
  import ActivitiPanel from './PanelActiviti/ActivitiPanel'
  import activitiDescriptor from './PanelActiviti/lib/moddle/activiti'
  import activitiModelerDescriptor from './PanelActiviti/lib/moddle/modeler'
  import { setProperties, getValues, removeBusinessObject } from './PanelActiviti/helper/PropertyHelper'
  import { emptyBpmn } from './store/defaultBpmn'
  export default {
    name: 'BpmnDesign',
    components: { ActivitiPanel },
    compents: {
      ActivitiPanel
    },
    props: {
      xml: {
        type: String,
        default: undefined
      },
      modelKey: {
        type: String,
        default: undefined
      },
      description: {
        type: String,
        default: undefined
      },
      formLists: {
        type: Array,
        default: () => {
          return []
        }
      },
      userLists: {
        type: Array,
        default: () => {
          return []
        }
      },
      groupLists: {
        type: Array,
        default: () => {
          return []
        }
      },
      change: {
        type: Function,
        default: function (xml) {
          console.info(xml)
        }
      }
    },
    data () {
      return {
        bpmnModeler: null,
        getValues: getValues,
        current: undefined
      }
    },
    mounted () {
      this.initModeler()
    },
    methods: {
      /**
       * 初始化modeler
       */
      initModeler () {
        const canvas = this.$refs.canvas
        // 实例化
        this.bpmnModeler = new BpmnModeler({
          container: canvas,
          additionalModules: [
            {
              translate: ['value', customTranslate]
            }],
          moddleExtensions: {
            activiti: activitiDescriptor,
            modeler: activitiModelerDescriptor
          }
        })
        /**
         * 添加事件监听
         */
        this.addEventListener()
        /**
         * 导入流程图
         */
        this.importDiagram(this.xml || emptyBpmn(this.modelKey, this.description))
      },
      /**
       * 操作bpmn动态激活panel
       */
      ActivePanel (element) {
        const current = this.current
        if (typeof element === 'undefined') {
          element = this.getCanvas().getRootElement()
        }
        if (current !== element) {
          this.current = element
        }
      },
      /**
       * 从panel修改值更新到bpmn
       */
      updateBpmn (element, properties) {
        if (properties && Object.keys(properties).length > 0) {
          setProperties(element, properties, this.bpmnModeler).catch(msg => {
            console.warn(msg)
          })
        }
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveSVG (e) {
        this.bpmnModeler.saveSVG({}).then(result => {
          const { svg } = result
          if (svg) {
            const encodedData = encodeURIComponent(svg)
            const link = document.createElement('a')
            link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
            link.download = 'diagram.svg'
            link.click()
          }
        }).catch(err => {
          this.$message.error('保存svg错误：' + err)
        })
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveDiagram (e) {
        this.bpmnModeler.saveXML({ format: true }).then(result => {
          const { xml } = result
          if (xml) {
            const encodedData = encodeURIComponent(xml)
            const link = document.createElement('a')
            link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
            link.download = 'diagram.bpmn'
            link.click()
          }
        }).catch(err => {
          this.$message.error('保存xml错误：' + err)
        })
      },
      /**
       * 导入xml流程定义
       */
      importDiagram (_xml) {
        this.bpmnModeler.importXML(_xml).then((result) => {
          const { warnings } = result
          if (warnings && warnings instanceof Array && warnings.length > 0) {
            console.warn(warnings)
          }
          this.adjustPalette()
        }).catch(err => {
          this.$message.error('流程文件错误：' + err.message)
        })
      },
      /**
       * 调整左侧调色板布局和样式
       */
      adjustPalette () {
        const paletteDom = this.$refs.canvas.getElementsByClassName('djs-palette')[0]
        if (paletteDom) {
          paletteDom.classList.replace('two-column', 'one-column')
          this.resetEntry(paletteDom)
        } else {
          this.$message.error('没有找到调色板,请刷新页面')
        }
      },
      /**
       * 重置entry布局
       * @param paletteDom
       */
      resetEntry (paletteDom) {
        const entriesDom = paletteDom.getElementsByClassName('entry')
        if (entriesDom && entriesDom.length > 0) {
          for (let i = 0; i < entriesDom.length; i++) {
            entriesDom[i].classList.add('custom-entry')
            entriesDom[i].innerHTML = `<div class="custom-entry-content">${entriesDom[i].title}</div>`
          }
        }
      },
      /**
       * 画布
       */
      getCanvas () {
        return this.bpmnModeler.get('canvas')
      },
      isImplicitRoot (element) {
        return element.id === '__implicitroot'
      },
      addEventListener () {
        const that = this
        const eventBus = this.bpmnModeler.get('eventBus')
        const events = [
          {
          'name': 'commandStack.changed',
          'priority': 1000,
          'callback': e => {
            that.bpmnModeler.saveXML({ format: true }).then(result => {
              const { xml } = result
              that.change(xml)
            }).catch(err => {
              that.$message.error('更新xml错误：' + err)
            })
            }
          },
          {
            'name': 'root.added',
            'priority': 1000,
            'callback': e => {
              const element = e.element
              if (that.isImplicitRoot(element)) {
                return
              }
              that.ActivePanel(element)
            }
          },
          {
            'name': 'selection.changed',
            'priority': 1000,
            'callback': e => {
              const newElement = e.newSelection[0]

              const rootElement = that.getCanvas() && that.getCanvas().getRootElement()

              if (that.isImplicitRoot(rootElement)) {
                return
              }

              that.ActivePanel(removeBusinessObject(newElement, that.bpmnModeler))
            }
          },
          {
            'name': 'elements.changed',
            'priority': 1000,
            'callback': e => {
              const element = that.current
              if (element) {
                if (e.elements.indexOf(element) !== -1) {
                  that.ActivePanel(element)
                }
              }
            }
          },
          {
            'name': 'elementTemplates.changed',
            'priority': 1000,
            'callback': e => {
              const element = that.current
              if (element) {
                that.ActivePanel(element)
              }
            }
          },
          {
            'name': 'diagram.destroy',
            'priority': 1000,
            'callback': e => {
              console.info('diagram.destroy->')
              console.info(e)
            }
          }
          ]
        events.forEach(e => {
          eventBus.on(e.name, e.priority, e.callback)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  .bpmnDesign {
    width: 100%;
    /deep/ .ant-layout-header{
      padding: 0px;
      line-height:48px;
      height: 48px;
      border-bottom: 2px solid #e4e7ed;
      .bpmn-header{
        display: -webkit-flex;
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        button {
          margin: 4px 0px 0px 8px;
          i svg{
            min-height: 12px;
          }
        }
      }
    }
    /deep/ .ant-layout-content {
      background-color: white;
      padding: 8px;
      border-left: 1px solid #f1e8e8;
      border-right: 1px solid #f1e8e8;
      min-height: 300px;
      .canvas {
        width: 100%;
        height: 100%;
        /deep/ svg {
          min-height: 700px;
        }

        /deep/ .djs-palette {
          width: 130px;

          .djs-palette-entries {
            width: 128px;
          }

          .entry {
            width: 128px;
          }

          .custom-entry {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            padding: 5px;
          }

          .custom-entry-content {
            font-size: 14px;
            font-weight: 500;
            margin-left: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    /deep/ .ant-layout-sider {
      background-color: white;
      padding: 0px;
      flex: 0 0 340px !important;
      max-width: 340px !important;
      min-height: 300px;
    }
    /deep/ .bjs-powered-by {
      display: none;
    }
  }
</style>
