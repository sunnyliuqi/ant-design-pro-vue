<template>
  <a-row :gutter="16">
    <a-col :span="24">
      <h3>示例1：</h3>
    </a-col>
    <a-col :span="24">
      <u-editor :init-value="'123'" :config="{initialFrameHeight: 500}" @change="changeEditorContent"></u-editor>
    </a-col>
    <a-col :span="24">
      <h3>示例2：</h3>
    </a-col>
    <a-col :span="24">
      <wang-editor :init-value="'456'" @change="changeEditorContent"></wang-editor>
    </a-col>
    <a-col :span="24">
      <h3>示例3：</h3>
    </a-col>
    <a-col :span="24">
      <quill-editor :init-value="'789'" @change="changeEditorContent"></quill-editor>
    </a-col>
  </a-row>
</template>
<script>
  import UEditor from '@/components/Editor/UEditor'
  import WangEditor from '@/components/Editor/WangEditor'
  import QuillEditor from '@/components/Editor/QuillEditor'
  export default {
    name: 'EditorExample',
    components: {
      WangEditor,
      QuillEditor,
      UEditor
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
