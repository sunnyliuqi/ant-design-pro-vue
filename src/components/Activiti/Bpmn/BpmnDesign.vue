<template>
  <a-layout class="bpmnDesign">
    <a-layout-content>
      <div class="canvas" ref="canvas"></div>
      <div class="toolbar">
        <a style="color: #3b4249;cursor: default;" title="下载">下载</a>
        <a @click="saveDiagram" title="download BPMN diagram">BPMN</a>
        <a @click="saveSVG" title="download as SVG image">SVG</a>
      </div>
    </a-layout-content>
    <a-layout-sider style="min-height: 300px; overflow-x: hidden;">
      <div class="propertiesPanel" ref="propertiesPanel"></div>
    </a-layout-sider>
  </a-layout>
</template>

<script>
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import customTranslate from './i18n/customTranslate'
  import propertiesPanelModule from 'bpmn-js-properties-panel-activiti'
  import propertiesProviderModule from 'bpmn-js-properties-panel-activiti/lib/provider/activiti'
  import camundaModdleDescriptor from 'activiti-bpmn-moddle/resources/activiti'
  import { emptyBpmn } from './store/defaultBpmn'
  export default {
    name: 'BpmnDesign',
    props: {
      xml: {
        type: String,
        default: undefined
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
        defaultXml: emptyBpmn
      }
    },
    mounted () {
      this.initModeler()
    },
    methods: {
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveSVG (e) {
        const link = e.target
        this.bpmnModeler.saveSVG({}).then(result => {
          const { svg } = result
          if (svg) {
            const encodedData = encodeURIComponent(svg)
            link.className = 'active'
            link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
            link.download = 'diagram.svg'
          }
        }).catch(err => {
          this.$message.error('保存svg错误：' + err)
        })
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveDiagram (e) {
        const link = e.target
        this.bpmnModeler.saveXML({ format: true }).then(result => {
          const { xml } = result
          if (xml) {
            const encodedData = encodeURIComponent(xml)
            link.className = 'active'
            link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
            link.download = 'diagram.bpmn'
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
          if (warnings && warnings instanceof Array && warnings.less > 0) {
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
       * 初始化modeler
       */
      initModeler () {
        const canvas = this.$refs.canvas
        const propertiesPanel = this.$refs.propertiesPanel
        // 实例化
        this.bpmnModeler = new BpmnModeler({
          container: canvas,
          propertiesPanel: {
            parent: propertiesPanel
          },
          additionalModules: [
            propertiesPanelModule,
            propertiesProviderModule,
            {
              translate: ['value', customTranslate]
            }],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
        })
        /**
         * 添加事件监听
         */
        this.addEventListener()
        /**
         * 导入流程图
         */
        this.importDiagram(this.xml || this.defaultXml)
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
              this.$message.error('更新xml错误：' + err)
            })
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
  @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

  .bpmnDesign {
    width: 100%;

    /deep/ .ant-layout-sider {
      background-color: white;
      padding: 8px;
      flex: 0 0 340px !important;
      max-width: 340px !important;
      min-height: 300px;
    }

    /deep/ .ant-layout-content {
      background-color: white;
      padding: 8px;
      border-left: 1px solid #f1e8e8;
      border-right: 1px solid #f1e8e8;
      min-height: 300px;
    }

    .canvas {
      width: 100%;
      height: 100%;
    }

    /deep/ .bjs-powered-by {
      display: none;
    }

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

    .toolbar {
      position: absolute;
      top: 20px;
      right: 374px;

      a {
        text-decoration: none;
        margin: 5px;
        color: #409eff;
      }
    }
  }
</style>
