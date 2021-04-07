<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'
import { customUploadFile, parseFileRespon, FILE_DISPLAY_PREFIX } from '@/api/upload'
import xss from 'xss'
export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    initValue: {
      type: [String, Number],
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      editor: null,
      editorContent: this.initValue
    }
  },
  watch: {
    initValue (val) {
      this.editorContent = val
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      this.editor = new WEditor(this.$refs.editor)
      this.editor.customConfig.zIndex = 1
      this.editor.customConfig.customUploadImg = function (resultFiles, insertImgFn) {
        if (resultFiles && resultFiles.length && resultFiles.length > 0) {
          resultFiles.forEach(file => {
            customUploadFile(file).then(res => {
              insertImgFn(FILE_DISPLAY_PREFIX + parseFileRespon(res))
            })
          })
        } else {
          this.$message.info('没有选择图片，请重新选择')
        }
      }
      this.editor.customConfig.showLinkImg = false
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('change', xss(this.editorContent))
      }
      this.editor.customConfig = Object.assign({}, this.editor.customConfig, this.config)
      this.editor.create()
      this.editor.txt.html(this.initValue)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
  /deep/.w-e-toolbar {
    flex-wrap: wrap !important;
  }
}
</style>
