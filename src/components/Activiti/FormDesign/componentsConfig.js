import { input, textarea, number, radio, checkbox, select, datetime, date, outcomes } from '@/core/icons'
// 输入型组件 【左面板】
export const inputComponents = [
  {
    fieldType: 'input',
    name: '单行文本',
    id: 'input',
    tag: 'a-input',
    tagIcon: input,
    value: undefined,
    required: false,
    placeholder: '请输入',
    disabled: false
  },
  {
    fieldType: 'textarea',
    id: 'textarea',
    name: '多行文本',
    tag: 'a-textarea',
    tagIcon: textarea,
    value: undefined,
    required: false,
    placeholder: '请输入',
    disabled: false,
    autoSize: {
      minRows: 4,
      maxRows: 4
    }
  },
  {
    fieldType: 'input-number',
    name: '数字',
    id: 'number',
    tag: 'a-input-number',
    tagIcon: number,
    value: null,
    required: true,
    placeholder: '请输入',
    disabled: false
  }
]

// 选择型组件 【左面板】
export const selectComponents = [
  {
    fieldType: 'radio',
    name: '单选框组',
    id: 'radio',
    tag: 'a-radio-group',
    tagIcon: radio,
    value: null,
    required: true,
    options: [{
      value: '单选一'
    }, {
      value: '单选二'
    }],
    disabled: false
  },
  {
    fieldType: 'checkbox',
    name: '多选框组',
    id: 'checkbox',
    tag: 'a-checkbox-group',
    tagIcon: checkbox,
    value: null,
    required: true,
    options: [{
      value: '多选一'
    }, {
      value: '多选二'
    }],
    disabled: false
  },
  {
    fieldType: 'select',
    name: '下拉选择',
    id: 'select',
    tag: 'a-select',
    tagIcon: select,
    value: null,
    required: true,
    placeholder: '请选择',
    options: [{
      value: '下拉一'
    }, {
      value: '下拉二'
    }],
    disabled: false
  },
  {
    fieldType: 'date',
    name: '日期',
    id: 'date',
    tag: 'a-date-picker',
    tagIcon: date,
    value: null,
    required: true,
    placeholder: '请选择',
    disabled: false
  },
  {
    fieldType: 'datetime',
    name: '时间',
    id: 'datetime',
    tag: 'a-date-picker',
    tagIcon: datetime,
    value: null,
    required: true,
    placeholder: '请选择',
    disabled: false
  }
]
/**
 * 输出-流程引擎才有
 * @type {{tagIcon, size: string, defaultValue: null, name: string, options: [{name: string}], disabled: boolean, tag: string, fieldType: string}[]}
 */
export const outcomesComponents = [
  {
    fieldType: 'outcomes',
    name: '通过',
    id: 'approve',
    tagIcon: outcomes
  }, {
    fieldType: 'outcomes',
    name: '不通过',
    id: 'disprove',
    tagIcon: outcomes
  }
]
