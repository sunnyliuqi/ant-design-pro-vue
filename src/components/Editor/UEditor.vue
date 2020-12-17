<template>
  <vue-ueditor-wrap
    ref="ueditor"
    v-model="content"
    :destroy="false"
    :config="customConfig"
    @ready="ready"
    @beforeInit="addCustomUI"></vue-ueditor-wrap>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import { UPLOAD_URL, parseFileRespon, FILE_DISPLAY_PREFIX } from '@/api/upload'
  export default {
    name: 'UEditor',
    components: { VueUeditorWrap },
    props: {
      initValue: {
        type: [String, Number],
        default: () => {
          return ''
        }
      },
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        // 3、v-model绑定数据
        content: this.initValue,
        // 4、根据项目需求自行配置,具体配置参见ueditor.config.js源码或 http://fex.baidu.com/ueditor/#start-start
        customConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 300,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 上传文件接口
          serverUrl: UPLOAD_URL + '/ufile',
          // UEditor 资源文件的存放路径
          UEDITOR_HOME_URL: '/UEditor/',
          // 配合最新编译的资源文件，你可以实现添加自定义Request Headers,详情https://github.com/HaoChuan9421/ueditor/commits/dev-1.4.3.3
          // headers: {
          //   access_token: '37e7c9e3fda54cca94b8c88a4b5ddbf3'
          // }
          ...this.config
        }
      }
    },
    watch: {
      content (val) {
        this.$emit('change', val)
      }
    },
    methods: {
      // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
      ready (editorInstance) {
      },
      // 7. 借助 beforeInit 钩子，你可以实现对 UEditor 的二次开发，会在 scripts 加载完毕之后、编辑器初始化之前触发，以 编辑器 id 和 配置参数 作为入参
      addCustomUI (editorId, editorConfig) {}
    }
  }
</script>

<style lang="less" scoped>
</style>
