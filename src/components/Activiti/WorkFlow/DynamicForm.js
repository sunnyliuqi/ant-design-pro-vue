import moment from 'moment'
export default {
  name: 'DynamicForm',
  props: {
    formInfo: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    parseForm () {
      let formFields = []
      const fields = this.formInfo.fields
      const outcomes = this.formInfo.outcomes
      if (fields && fields.length > 0) {
        formFields = fields.map(i => {
          return this.createFormItem(i.name, this.createItem(i))
        })
      }
      if (outcomes && outcomes.length > 0) {
        formFields.push(this.createFormItem('流程操作', this.getOutComes(outcomes)))
      }
      return (
        formFields
      )
    },
    /**
     * 创建表单录入组件
     * @param field
     */
    createItem (field) {
      const type = field.type
      if (type === 'multi-line-text') {
        /**
         * 多行文本
         */
        return (<a-textarea {...this.getDisabled(field)} rows={3} v-decorator={[`values.${field.id}`, { initialValue: field.value, rules: this.getRules(field) }]} placeholder={`请输入${field.name}`}/>)
      } else if (type === 'date') {
        /**
         * 日期
         */
        return (<a-date-picker {...this.getDisabled(field)} v-decorator={[`values.${field.id}`, { initialValue: field.value ? moment(field.value, 'YYYY-MM-DD') : null, rules: this.getRules(field) }]} placeholder={`请选择${field.name}`}/>)
      } else if (type === 'datetime') {
        /**
         * 时间
         */
        return (<a-date-picker showTime format={'YYYY-MM-DD HH:mm:ss'} {...this.getDisabled(field)} v-decorator={[`values.${field.id}`, { initialValue: field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null, rules: this.getRules(field) }]} placeholder={`请选择${field.name}`}/>)
      } else if (type === 'select' || type === 'dropdown') {
        /**
         * 选择框
         */
        return (<a-select {...this.getDisabled(field)} v-decorator={[`values.${field.id}`, { initialValue: this.getOptValue(field), rules: this.getRules(field) }]} placeholder={`请选择${field.name}`}>{this.getOpts(field)}</a-select>)
      } else if (type === 'radio-buttons') {
        /**
         * 单选
         */
        return (<a-radio-group {...this.getDisabled(field)} v-decorator={[`values.${field.id}`, { initialValue: field.value, rules: this.getRules(field) }]}>{this.getRadioOpts(field.options)}</a-radio-group>)
      } else if (type === 'check-box' || type === 'checkbox') {
        /**
         * 多选
         */
        return (<a-checkbox-group options={this.getCheckboxOpts(field)} {...this.getDisabled(field)} v-decorator={[`values.${field.id}`, { initialValue: this.getOptValue(field), rules: this.getRules(field) }]} />)
      } else if (type === 'integer') {
        /**
         * 数字
         */
        return (<a-input-number {...this.getDisabled(field)} v-decorator={[`values.${field.id}`, { initialValue: field.value ? field.value : 0, rules: this.getRules(field) }]} placeholder={`请输入${field.name}`}/>)
      } else {
        /**
         * 默认文本
         */
        return (<a-input {...this.getDisabled(field)} v-decorator={[`values.${field.id}`, { initialValue: field.value, rules: this.getRules(field) }]} placeholder={`请输入${field.name}`}/>)
      }
    },
    getOutComes (outcomes) {
      /* [{
        "name": "通过"
      }, {
        "name": "不通过"
      }] */
      return (<a-radio-group button-style={'solid'} v-decorator={[`outcome`, { initialValue: outcomes[0].name }]}>{this.getRadioButtonOpts(outcomes)}</a-radio-group>)
    },
    getOptValue (field) {
      const value = field.value
      if (value) {
        if (typeof (value) === 'string') {
          if ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'))) {
            return JSON.parse(value)
          }
          return value
        } else if (typeof (value) === 'object') {
          return value
        }
      } else {
        if (field.required && field.required === true && field.options && field.options.length > 0) {
          return field.options[0].name
        }
        return undefined
      }
    },
    getCheckboxOpts (field) {
      /* "options": [{
        "name": "0",
        "value":""
      }...] */
      const opts = []
      if (field.options && field.options.length > 0) {
        field.options.forEach(i => {
          if (i.name) {
            opts.push({
              label: i.name,
              value: i.name
            })
          }
        })
      }
      return (opts)
    },
    getRadioOpts (options) {
      /* "options": [{
        "name": "0"
      }...] */
      const opts = []
      if (options && options.length > 0) {
        options.forEach(i => {
          if (i.name) {
            opts.push(<a-radio value={i.name}>{i.name}</a-radio>)
          }
        })
      }
      return (opts)
    },
    getRadioButtonOpts (options) {
      /* "options": [{
        "name": "0"
      }...] */
      const opts = []
      if (options && options.length > 0) {
        options.forEach(i => {
          if (i.name) {
            opts.push(<a-radio-button value={i.name}>{i.name}</a-radio-button>)
          }
        })
      }
      return (opts)
    },
    getOpts (field) {
      /* "options": [{
        "name": "0",
        "value":""
      }...] */
      const opts = []
      if (field.required) {
        opts.push(<a-select-option value={''}>请选择</a-select-option>)
      }
      if (field.options && field.options.length > 0) {
        field.options.forEach(i => {
          if (i.name) {
            opts.push(<a-select-option value={i.name}>{i.name}</a-select-option>)
          }
        })
      }
      return (opts)
    },
    createFormItem (label, item) {
      return (<a-col span={24}>
        <a-form-item
          label={ label }
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}>
          { item }
        </a-form-item>
      </a-col>)
    },
    getDisabled (field) {
      if (field.readOnly) {
        return 'disabled'
      }
      return ''
    },
    getRules (field) {
      const rules = []
      if (field.required) {
        rules.push({ required: true, message: `${field.name}不能为空` })
      }
      return rules
    }
  },
  render () {
    return (<a-row gutter={16}>{this.parseForm()}</a-row>)
  }
}
