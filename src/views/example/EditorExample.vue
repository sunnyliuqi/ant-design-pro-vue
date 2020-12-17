<template>
  <a-row :gutter="16">
    <a-col :span="24">
      <h3>示例1：</h3>
    </a-col>
    <a-col :span="24">
      <wang-editor init-value="123" @change="changeEditorContent"></wang-editor>
    </a-col>
    <a-col :span="24">
      <h3>示例2：</h3>
    </a-col>
    <a-col :span="24">
      <quill-editor></quill-editor>
    </a-col>
  </a-row>
</template>
<script>
  import WangEditor from '@/components/Editor/WangEditor'
  import QuillEditor from '@/components/Editor/QuillEditor'
  export default {
    name: 'EditorExample',
    components: {
      WangEditor,
      QuillEditor
    },
    methods: {
      changeEditorContent (editorContent) {
        console.info(editorContent)
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.w-e-text-container{
    height: 500px !important;
  }
</style>
