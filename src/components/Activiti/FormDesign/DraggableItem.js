import moment from 'moment'
import draggable from 'vuedraggable'
import boolean from 'less/lib/less/functions/boolean'
export default {
  name: 'DraggableItem',
  props: {
    drawingList: {
      type: Array,
      default: () => { return [] }
    },
    activeId: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    parseItems () {
      const { itemCopy, itemDelete, activeItem } = this.$listeners
      let formFields = []
      const fields = this.drawingList
      if (fields && fields.length > 0) {
        formFields = fields.map((item, index) => {
          const className = this.activeId === item.id ? 'hover-from-item active-item' : 'hover-from-item'
          return (
            <a-col index={item.id} onClick={e => { activeItem(e.target) }} span={24} class={className}>
              {this.createFormItem(item.name, this.createItem(item))}
              <a-icon onClick={e => {
                itemCopy(item, this.drawingList); e.stopPropagation()
              }} class="drawing-item-copy" type={'copy'}/>
              <a-icon onClick={e => {
                itemDelete(index, this.drawingList); e.stopPropagation()
              }} class="drawing-item-delete" type={'delete'}/>
            </a-col>)
        })
      }

      return (formFields)
    },
    createFormItem (label, item) {
      return (
        <a-form-item
          label={ label }
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}>
          { item }
        </a-form-item>)
    },
    /**
     * 创建表单录入组件
     * @param field
     */
    createItem (field) {
      const type = field.fieldType
      const name = field.id
      if (type === 'input') {
        /**
         * 单行文本
         */
        return (<a-input allowClear disabled={field.disabled} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]} placeholder={`${field.placeholder}${field.name}`}/>)
      } else if (type === 'textarea') {
        /**
         * 多行文本
         */
        return (<a-textarea disabled={field.disabled} autoSize={field.autoSize} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]} placeholder={`${field.placeholder}${field.name}`}/>)
      } else if (type === 'input-number') {
        /**
         * 数字
         */
        return (<a-input-number disabled={field.disabled} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]} placeholder={`${field.placeholder}${field.name}`}/>)
      } else if (type === 'radio') {
        /**
         * 单选
         */
        return (<a-radio-group disabled={field.disabled} size={'default'} button-style={'solid'} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]}>{this.createRadioOptions(field)}</a-radio-group>)
      } else if (type === 'checkbox') {
        /**
         * 多选
         */
        return (<a-checkbox-group disabled={field.disabled} options={this.createCheckboxOptions(field)} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]} />)
      } else if (type === 'select') {
        /**
         * 选择框
         */
        return (<a-select disabled={field.disabled} allowClear mode={'default'} filterOption={false} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]} placeholder={`${field.placeholder}${field.name}`}>{this.createSelectOptions(field)}</a-select>)
      } else if (type === 'date') {
        /**
         * 日期
         */
        return (<a-date-picker allowClear disabled={field.disabled} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]} placeholder={`${field.placeholder}${field.name}`}/>)
      } else if (type === 'datetime') {
        /**
         * 时间
         */
        return (<a-date-picker allowClear showTime disabled={field.disabled} format={'YYYY-MM-DD HH:mm:ss'} v-decorator={[`${name}`, { initialValue: this.getInitialValue(field), rules: this.getRules(field) }]} placeholder={`${field.placeholder}${field.name}`}/>)
      }
    },
    getRules (field) {
      const rules = []
      if (field.required) {
        rules.push({ required: true, message: `${field.name}不能为空` })
      }
      return rules
    },
    createRadioOptions (field) {
      /* "options": [{
        "value": "0"
      }...] */
      const opts = []
      if (field.options && field.options.length > 0) {
        field.options.forEach(i => {
          if (i.value) {
            opts.push(<a-radio-button value={i.value}>{i.value}</a-radio-button>)
          }
        })
      }
      return (opts)
    },
    createCheckboxOptions (field) {
      /* "options": [{
        "value":""
      }...] */
      const opts = []
      if (field.options && field.options.length > 0) {
        field.options.forEach(i => {
          if (i.value) {
            opts.push({
              label: i.value,
              value: i.value
            })
          }
        })
      }
      return (opts)
    },
    createSelectOptions (field) {
      /* "options": [{
        "value":""
      }...] */
      const opts = []
      if (field.options && field.options.length > 0) {
        field.options.forEach(i => {
          if (i.value) {
            opts.push(<a-select-option value={i.value}>{i.value}</a-select-option>)
          }
        })
      }
      return (opts)
    },
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
    }
  },
  render () {
    const { start, add, update, remove, end } = this.$listeners
    return (<draggable
      onStart={start}
      onAdd={add}
      onUpdate={update}
      onRemove={remove}
      onEnd={end}
      disabled={this.disabled}
      className="drawing-board" list={this.drawingList} animation={340} group="componentsGroup">{this.parseItems()}</draggable>)
  }
}
