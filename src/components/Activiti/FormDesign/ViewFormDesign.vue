<template>
  <a-form :form="form" class="form-design">
    <a-row :gutter="16" ref="designDom">
      <draggable-item
        :drawing-list="drawingList"
        :active-id="activeId"
        :clone="onClone"
        :disabled="true"
        @start="onStart"
        @add="onAdd"
        @update="onUpdate"
        @remove="onRemove"
        @end="onEnd"
        @itemCopy="drawingItemCopy"
        @itemDelete="drawingItemDelete"
        @activeItem="activeItem"
      />
      <draggable-button-item
        :drawing-button-list="drawingButtonList"
        :active-id="activeId"
        :clone="onClone"
        :disabled="true"
        @start="onStart"
        @add="onAdd"
        @update="onUpdate"
        @remove="onRemove"
        @end="onEnd"
        @itemCopy="drawingItemCopy"
        @itemDelete="drawingItemDelete"
        @activeItem="activeButtonItem"
      />
    </a-row>
  </a-form>
</template>

<script>
  import draggable from 'vuedraggable'
  import DraggableItem from './DraggableItem'
  import DraggableButtonItem from './DraggableButtonItem'
  import EditableCell from './EditableCell'
  import { deepClone } from './util'
  import moment from 'moment'
  import { input } from '@/core/icons'
  import html2canvas from 'html2canvas'

  let gid = 0

  function initialClone (array) {
    if (array && array.length && array.length > 0) {
      return array.map(item => {
        return deepClone(item)
      })
    }
    return []
  }

  const columns = [
    {
      title: '值',
      dataIndex: 'optValue',
      scopedSlots: { customRender: 'optValue' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'FormDesign',
    components: {
      draggable,
      DraggableItem,
      DraggableButtonItem,
      EditableCell
    },
    props: {
      inputComponents: {
        type: Array,
        default: () => {
          return [{
            fieldType: 'input',
            name: '单行文本',
            id: 'input',
            tag: 'a-input',
            tagIcon: input,
            value: undefined,
            required: false,
            placeholder: '请输入',
            disabled: false
          }]
        }
      },
      selectComponents: {
        type: Array,
        default: () => {
          return []
        }
      },
      outcomesComponents: {
        type: Array,
        default: () => {
          return []
        }
      },
      drawingList: {
        type: Array,
        default: () => {
          return []
        }
      },
      drawingButtonList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        activeObj: this.inputComponents[0],
        activeId: this.inputComponents[0].id,
        form: this.$form.createForm(this, { onFieldsChange: this.onFieldsChange }),
        formPanel: this.$form.createForm(this, { onFieldsChange: this.onPanelFieldsChange }),
        columns,
        leftComponents: [
          {
            title: '输入型组件',
            list: this.inputComponents,
            icon: 'edit'
          },
          {
            title: '选择型组件',
            list: this.selectComponents,
            icon: 'select'
          }
        ],
        leftButtonComponents: [
          {
            title: '按钮型组件',
            list: this.outcomesComponents,
            icon: 'gold'
          }
        ]
      }
    },
    computed: {},
    methods: {
      /**
       * 页面内容生成base64图片
       */
      generatePicture (callback) {
        const elDom = this.$refs.designDom.$el
        html2canvas(elDom).then(canvas => {
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
       * 选择模式
       */
      getMode (type) {
        if (type === 'radio' || type === 'select') {
          return 'default'
        }
        return 'multiple'
      },
      /**
       * 初始值
       */
      getInitialValue (obj) {
        if (obj.required && !obj.value) {
          if (obj.fieldType === 'radio' || obj.fieldType === 'select') {
            return obj.options[0].value
          }
          if (obj.fieldType === 'checkbox') {
            return [obj.options[0].value]
          }
        }
        if (obj.fieldType === 'input-number') {
          return obj.value ? obj.value : 0
        }
        if (obj.fieldType === 'date') {
          return obj.value ? moment(obj.value, 'YYYY-MM-DD') : null
        }
        if (obj.fieldType === 'datetime') {
          return obj.value ? moment(obj.value, 'YYYY-MM-DD HH:mm:ss') : null
        }
        return obj.value ? obj.value : undefined
      },
      /**
       * 默认值可选项
       **/
      defaultOptions (options) {
        const defaultOpts = [...options]
        return defaultOpts.map(item => {
          return { label: item.value, value: item.value }
        })
      },
      /**
       * 移除选项值
       * @param key
       */
      handleRemove (key) {
        const options = this.activeObj.options
        if (options.length === 1) {
          this.$message.warn('选项至少有一个值', 1)
          return
        }
        const target = options.findIndex(item => item.value === key)
        if (target > -1) {
          options.splice(target, 1)
        }
        /**
         * 同步重置默认值
         * @type {undefined}
         */
        this.activeObj.value = undefined
        this.formPanel.resetFields(['value'])
      },
      /**
       * 新增选项值
       */
      handleAdd () {
        const options = [...this.activeObj.options]
        gid = gid + 1
        const newData = {
          value: '新增' + gid
        }
        this.activeObj.options = [...options, newData]
      },
      /**
       * 修改选项值
       * @param key
       * @param dataIndex
       * @param value
       */
      onCellChange (key, dataIndex, value) {
        const options = [...this.activeObj.options]
        const target = options.find(item => item.value === key)
        if (target) {
          target.value = value
          this.activeObj.options = options
        }
      },
      /**
       * 获取选项列表
       * @param options
       * @returns {*}
       */
      getDataOptions (options) {
        const data = options.map(item => {
          return { key: item.value, optValue: item.value }
        })
        return data
      },
      /**
       * 是否有选项
       * @param activeObj
       * @returns {*|boolean}
       */
      isOpt (activeObj) {
        return activeObj.options && activeObj.options.length && activeObj.options.length > 0
      },
      /**
       * 表单任意字段改变
       * @param props
       * @param fields
       */
      onPanelFieldsChange (props, fields) {
        const fieldName = Object.keys(fields)[0]
        if (fieldName && this.activeObj && (fields[fieldName].value !== undefined)) {
          const objProp = {}
          objProp[fieldName] = fields[fieldName].value
          let temp = {}
          if (this.activeObj.fieldType.indexOf('outcomes') >= 0) {
            temp = this.findActiveObj(this.drawingButtonList, this.activeObj.id)
          } else {
            temp = this.findActiveObj(this.drawingList, this.activeObj.id)
          }
          temp = Object.assign(temp, objProp)
          this.activeObj = temp
          /**
           * 右边表单默认值同步到中间表单值
           * @type {{}}
           */
          this.form.resetFields([`${this.activeObj.id}`])
        }
      },
      onFieldsChange (props, fields) {
        const fieldName = Object.keys(fields)[0]
        if (fieldName && this.activeObj && (fields[fieldName].value !== undefined)) {
          const objProp = {}
          objProp.value = fields[fieldName].value
          let temp = {}
          if (this.activeObj.fieldType.indexOf('outcomes') >= 0) {
            temp = this.findActiveObj(this.drawingButtonList, this.activeObj.id)
          } else {
            temp = this.findActiveObj(this.drawingList, this.activeObj.id)
          }
          temp = Object.assign(temp, objProp)
          this.activeObj = temp
        }
      },
      /**
       * 拖拽开始
       * @param obj
       */
      onStart (obj) {
      },
      /**
       * 拖拽新增
       * @param obj
       */
      onAdd (obj) {
      },
      /**
       * 拖拽克隆
       * @param obj
       * @returns {Date | RegExp | [] | {}}
       */
      onClone (obj) {
        const clone = deepClone(obj)
        gid = gid + 1
        clone.id = clone.id + gid
        return clone
      },
      /**
       * 拖拽更新
       * @param obj
       */
      onUpdate (obj) {
      },
      /**
       * 拖拽移除
       * @param obj
       */
      onRemove (obj) {
      },
      /**
       * 拖拽结束
       * @param obj
       */
      onEnd (obj) {
      },
      /**
       * 设为活动状态
       * @param item
       */
      setActiveObj (item) {
        this.activeId = item.getAttribute('index')
        let temp = this.findActiveObj(this.drawingList, this.activeId)
        if (!temp) {
          temp = this.findActiveObj(this.drawingButtonList, this.activeId)
        }
        this.activeObj = temp
        this.formPanel.resetFields()
      },
      /**
       * 移除活动组件选中效果
       * @param activeItem
       */
      removeActiveItem (activeItem) {
        const oldActiveItems = document.getElementsByClassName(activeItem)
        if (oldActiveItems && oldActiveItems.length > 0) {
          for (let i = 0; i < oldActiveItems.length; i++) {
            oldActiveItems[i].classList.remove(activeItem)
          }
        }
      },
      /**
       * 设置活动组件选中效果
       * @param obj
       */
      activeItem (obj) {
        const activeItem = 'active-item'
        this.removeActiveItem(activeItem)
        const activeButtonItem = 'active-button-item'
        this.removeActiveItem(activeButtonItem)

        function findItem (e) {
          if (e.classList && e.classList.length > 0 && e.classList.contains('hover-from-item')) {
            return e
          }
          return findItem(e.parentElement)
        }

        const item = findItem(obj)
        item.classList.add(activeItem)
        this.setActiveObj(item)
      },
      /**
       * 设置活动按钮效果
       * @param obj
       */
      activeButtonItem (obj) {
        const activeItem = 'active-item'
        this.removeActiveItem(activeItem)
        const activeButtonItem = 'active-button-item'
        this.removeActiveItem(activeButtonItem)

        function findItem (e) {
          if (e.classList && e.classList.length > 0 && e.classList.contains('hover-button-from-item')) {
            return e
          }
          return findItem(e.parentElement)
        }

        const item = findItem(obj)
        item.classList.add(activeButtonItem)
        this.setActiveObj(item)
      },
      /**
       * 组件复制
       * @param item
       * @param parent
       */
      drawingItemCopy (item, parent) {
        const clone = deepClone(item)
        gid = gid + 1
        clone.id = clone.id + gid
        parent.push(clone)
      },
      /**
       * 组件删除
       * @param index
       * @param parent
       */
      drawingItemDelete (index, parent) {
        parent.splice(index, 1)
      },
      /**
       * 查处活动对象
       * @param list
       * @param activeId
       * @returns {undefined|*}
       */
      findActiveObj (list, activeId) {
        if (list && list.length > 0) {
          const temp = list.filter(i => {
            return i.id === activeId
          })
          if (temp && temp.length && temp.length > 0) {
            return temp[0]
          }
        }
        return undefined
      }
    }
  }
</script>

<style lang="less" scoped>
  .form-design {
    min-height: 300px;
    word-break: break-all;
    overflow-x: hidden;

    .components-title {
      font-size: 14px;
      color: #222;
      margin: 6px 2px;
    }

    .components-item {
      display: inline-block;
      width: 48%;
      margin: 1%;
      -webkit-transition: -webkit-transform 0ms !important;
      transition: -webkit-transform 0ms !important;
      transition: transform 0ms !important;
      transition: transform 0ms, -webkit-transform 0ms !important;

      .components-body {
        padding: 8px 10px;
        background: #F6FFFD;
        font-size: 12px;
        cursor: move;
        border: 1px dashed #F6FFFD;
        border-radius: 3px;
      }

      .components-body:hover {
        border: 1px dashed #1890ff;
        color: #1890ff;
      }
    }

    /deep/ .hover-from-item {
      &:hover .drawing-item-copy, &:hover .drawing-item-delete {
        position: absolute;
        display: none !important;
      }
    }

    /deep/ .drawing-item-copy {
      top: 8px;
      color: #409EFF;
      right: 52px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #409EFF;
      width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      cursor: pointer;
      z-index: 1;
      display: none;

      &:hover {
        background: #409EFF;
        color: #fff;
      }
    }

    /deep/ .drawing-item-delete {
      top: 8px;
      color: #F56C6C;
      right: 24px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #F56C6C;
      width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      cursor: pointer;
      z-index: 1;
      display: none;

      &:hover {
        background: #F56C6C;
        color: #fff;
      }
    }

    /deep/ .hover-button-from-item {
      &:hover .drawing-button-item-copy, &:hover .drawing-button-item-delete {
        display: none !important;
      }
    }

    /deep/ .drawing-button-item {
      display: inline;
      float: left;
      margin: 0 0 8px 0;
      min-width: 108px;
    }

    /deep/ .drawing-button-item-copy {
      z-index: 1;
      display: none;
      position: relative;
      top: -16px;
      right: 52px;
      color: #409EFF;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #409EFF;
      width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background: #409EFF;
        color: #fff;
      }
    }

    /deep/ .drawing-button-item-delete {
      z-index: 1;
      display: none;
      position: relative;
      top: -16px;
      right: 48px;
      color: #F56C6C;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #F56C6C;
      width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background: #F56C6C;
        color: #fff;
      }
    }

    /deep/ .ant-form-item {
      border-radius: 6px;
      padding: 8px;
      margin-bottom: 0;
      margin-top: 16px;

      &:hover {
        /*background: #f6f7ff;*/
      }
    }

    /deep/ .ant-layout-sider {
      background-color: white;
      padding: 8px;
      flex: 0 0 256px !important;
      max-width: 256px !important;
      min-height: 300px;
    }

    /deep/ .ant-layout-content {
      background-color: white;
      padding: 8px;
      border-left: 1px solid #f1e8e8;
      border-right: 1px solid #f1e8e8;
      min-height: 300px;
    }

    /deep/ .active-item {
      .ant-form-item {
        /*background: #f6f7ff;*/
      }

      .drawing-item-copy, .drawing-item-delete {
        position: absolute;
        display: none !important;
      }
    }

    /deep/ .active-button-item {
      .drawing-button-item-copy, .drawing-button-item-delete {
        display: none !important;
      }
    }

    /deep/ .ant-table.ant-table-bordered .ant-table-footer {
      text-align: center !important;
    }

    /deep/ .ant-table-body {
      min-width: 200px !important;
    }
  }
</style>
