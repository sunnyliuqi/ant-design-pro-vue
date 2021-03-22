<template>
  <a-layout class="bpmnDesign">
    <a-layout>
      <a-layout-content>
        <div class="canvas" ref="canvas"></div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import BpmnViewer from 'bpmn-js/lib/Viewer'
  import customTranslate from './i18n/customTranslate'
 import { emptyBpmn } from './store/defaultBpmn'
  import html2canvas from 'html2canvas'

  export default {
    name: 'BpmnDesign',
    components: { },
    props: {
      xml: {
        type: String,
        default: undefined
      },
      modelKey: {
        type: String,
        default: undefined
      },
      modelName: {
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
        bpmnViewer: null,
        current: undefined
      }
    },
    watch: {
      xml (val, oldVal) {
        /**
         * 导入流程图
         */
        this.importDiagram(this.xml || emptyBpmn(this.modelKey, this.modelName, this.description))
      }

    },
    mounted () {
      this.initViewer()
      this.importDiagram(this.xml || emptyBpmn(this.modelKey, this.modelName, this.description))
    },
    methods: {
      /**
       * 页面内容生成base64图片
       */
      generatePicture (callback) {
        const canvasDom = this.$refs.canvas
        html2canvas(canvasDom).then(canvas => {
          /**
           * 以下是尺寸压缩处理，会降低图片质量
           * @type {number}
           * @private
           */
          const _width = 240
          const scale = canvas.width / _width
          const _heigth = (canvas.height / scale) + 60
          const extraCanvas = document.createElement('canvas')
          extraCanvas.setAttribute('width', _width)
          extraCanvas.setAttribute('height', _heigth)
          const ctx = extraCanvas.getContext('2d')
          ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, _width, _heigth)
          callback(extraCanvas.toDataURL('image/png'))
        })
      },
      /**
       * 初始化modeler
       */
      initViewer () {
        const canvas = this.$refs.canvas
        // 实例化
        this.bpmnViewer = new BpmnViewer({
          container: canvas,
          additionalModules: [
            {
              translate: ['value', customTranslate]
            }]
        })
      },
      /**
       * 导入xml流程定义
       */
      importDiagram (_xml) {
        this.bpmnViewer.importXML(_xml).then((result) => {
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
          paletteDom.style.display = 'none'
        }
      },
      /**
       * 画布
       */
      getCanvas () {
        return this.bpmnViewer.get('canvas')
      },
      isImplicitRoot (element) {
        return element.id === '__implicitroot'
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

    /deep/ .ant-layout-header {
      padding: 0px;
      line-height: 48px;
      height: 48px;
      border-bottom: 1px solid #e4e7ed;
      background-color: white;

      .bpmn-header {
        display: -webkit-flex;
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;

        button {
          margin: 4px 0px 0px 8px;

          i svg {
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

        .bjs-container .djs-container {
          svg {
            min-height: 300px;
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
