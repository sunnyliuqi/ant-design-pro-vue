<template>
  <div class="uploader">
    <slot :files="files" :file-list="fileList" :started="started">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <p>拖动文件到此区域或</p>
        <uploader-btn>选择文件</uploader-btn>
        <uploader-btn :directory="true" style="margin-left: 8px">选择文件夹</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </slot>
  </div>
</template>

<script>
import Uploader from 'simple-uploader.js'
import { chunk, chunkAbort, chunkComplete } from '@/api/upload'

const COMPONENT_NAME = 'BaseUploader'
const FILE_ADDED_EVENT = 'fileAdded'
const FILES_ADDED_EVENT = 'filesAdded'
const UPLOAD_START_EVENT = 'uploadStart'

function kebabCase (s) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

export default {
  name: COMPONENT_NAME,
  provide () {
    return {
      uploader: this
    }
  },
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    autoStart: {
      type: Boolean,
      default: true
    },
    fileStatusText: {
      type: [Object, Function],
      default () {
        return {
          success: '成功',
          error: '错误',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        }
      }
    },
    completeCallBack: {
      type: Function,
      default: function (filePath) {
        console.log('文件路径：' + filePath)
      }
    }
  },
  data () {
    return {
      opts: {
        target: chunk,
        testChunks: true,
        simultaneousUploads: 5,
        chunkSize: 1 * 1024 * 1024,
        forceChunkSize: true,
        maxChunkRetries: 3,
        // chunkRetryInterval: 100,
        allowDuplicateUploads: true,
        generateUniqueIdentifier: this.generateIdentifier,
        checkChunkUploadedByResponse: function (chunk, message) {
          let objMessage = {}
          try {
            objMessage = JSON.parse(message)
          } catch (e) {
            this.$message.error('文件校验出错，请刷新页面重试')
          }
          return (objMessage.uploaded_chunks || []).indexOf(chunk.offset + 1) >= 0
        }
      },
      started: false,
      files: [],
      fileList: []
    }
  },
  methods: {
    fileError (rootFile, file, message, chunk) {
      this.$message.info('上传错误，请重试')
    },
    fileSuccess (rootFile, file, message, chunk) {
      //  文件上传成功
      chunkComplete(file.uniqueIdentifier).then(res => {
        if (res.code === 10000) {
          this.completeCallBack(res.result)
        }
      })
    },
    // 上传完成
    complete () {
    },
    // 一个根文件（文件夹）成功上传完成。
    fileComplete (rootFile) {
    },
    generateIdentifier (a) {
      return this.$uuid.v1()
    },
    uploadStart () {
      this.started = true
    },
    fileAdded (file) {
      // eslint-disable-next-line no-undef
      this.$emit(kebabCase(FILE_ADDED_EVENT), file)
      if (file.ignored) {
        // is ignored, filter it
        return false
      }
    },
    filesAdded (files, fileList) {
      // eslint-disable-next-line no-undef
      this.$emit(kebabCase(FILES_ADDED_EVENT), files, fileList)
      if (files.ignored || fileList.ignored) {
        // is ignored, filter it
        return false
      }
    },
    fileRemoved (file) {
      // 文件移除
      chunkAbort(file.uniqueIdentifier)
      this.files = this.uploader.files
      this.fileList = this.uploader.fileList
    },
    filesSubmitted (files, fileList) {
      this.files = this.uploader.files
      this.fileList = this.uploader.fileList
      if (this.autoStart) {
        this.uploader.upload()
      }
    },
    allEvent (...args) {
      const name = args[0]
      const EVENTSMAP = {
        [FILE_ADDED_EVENT]: true,
        [FILES_ADDED_EVENT]: true,
        [UPLOAD_START_EVENT]: 'uploadStart'
      }
      const handler = EVENTSMAP[name]
      if (handler) {
        if (handler === true) {
          return
        }
        this[handler].apply(this, args.slice(1))
      }
      // eslint-disable-next-line no-undef
      args[0] = kebabCase(name)
      this.$emit.apply(this, args)
    }
  },
  created () {
    this.options.initialPaused = !this.autoStart
    // eslint-disable-next-line no-undef
    const uploader = new Uploader(Object.assign(this.opts, this.options))
    this.uploader = uploader
    this.uploader.fileStatusText = this.fileStatusText
    uploader.on('catchAll', this.allEvent)
    uploader.on(FILE_ADDED_EVENT, this.fileAdded)
    uploader.on(FILES_ADDED_EVENT, this.filesAdded)
    uploader.on('fileRemoved', this.fileRemoved)
    uploader.on('filesSubmitted', this.filesSubmitted)
    uploader.on('fileSuccess', this.fileSuccess)
    uploader.on('fileComplete', this.fileComplete)
    uploader.on('complete', this.complete)
  },
  destroyed () {
    const uploader = this.uploader
    uploader.off('catchAll', this.allEvent)
    uploader.off(FILE_ADDED_EVENT, this.fileAdded)
    uploader.off(FILES_ADDED_EVENT, this.filesAdded)
    uploader.off('fileRemoved', this.fileRemoved)
    uploader.off('filesSubmitted', this.filesSubmitted)
    uploader.off('fileSuccess', this.fileSuccess)
    uploader.off('fileComplete', this.fileComplete)
    uploader.off('complete', this.complete)
    this.uploader = null
  },
  components: {}
}
</script>

<style>
  .uploader {
    position: relative;
  }
</style>
