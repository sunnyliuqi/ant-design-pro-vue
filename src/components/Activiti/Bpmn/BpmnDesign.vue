<template>

  <div class="bpmnDesign">
    <div class="canvas" ref="canvas"></div>
    <div class="toolbar">
      <a style="color: #3b4249;cursor: default;" title="下载">下载</a>
      <a @click="saveDiagram" title="download BPMN diagram">BPMN</a>
      <a @click="saveSVG" title="download as SVG image">SVG</a>
    </div>
  </div>
</template>

<script>
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import customTranslate from './i18n/customTranslate'

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
        defaultXml: `
    <?xml version="1.0" encoding="UTF-8"?>
      <bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
        <bpmn2:process id="process1567044459787" name="process1567044459787">
        </bpmn2:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process1567044459787" />
        </bpmndi:BPMNDiagram>
      </bpmn2:definitions>
    `
      }
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
      createNewDiagram () {
        // 将字符串转换成图显示出来
        const _xml = this.xml || this.defaultXml
        this.bpmnModeler.importXML(_xml).then((result) => {
          const { warnings } = result
          console.warn(warnings)
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
       * 重置entry提示语
       * @param paletteDom
       */
      resetEntry (paletteDom) {
        const entriesDom = paletteDom.getElementsByClassName('entry')
        if (entriesDom && entriesDom.length > 0) {
          for (let i = 0; i < entriesDom.length; i++) {
            entriesDom[i].classList.add('custom-entry')
            entriesDom[i].innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;'>${entriesDom[i].title}</div>`
          }
        }
      }
    },
    mounted () {
      const canvas = this.$refs.canvas
      // 生成实例
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        additionalModules: [{
          translate: ['value', customTranslate]
        }]
      })
      // 监听流程图改变事件
      const _this = this
      this.bpmnModeler.on('commandStack.changed', function () {
        _this.bpmnModeler.saveXML({ format: true }).then(result => {
          const { xml } = result
          _this.change(xml)
        }).catch(err => {
          this.$message.error('更新xml错误：' + err)
        })
      })
      this.createNewDiagram() // 新增流程定义
    }
  }
</script>

<style scoped lang="less">
  /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

  .bpmnDesign {
    width: 100%;

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
    }

    .toolbar {
      position: absolute;
      top: 20px;
      right: 24px;

      a {
        text-decoration: none;
        margin: 5px;
        color: #409eff;
      }
    }
  }
</style>
