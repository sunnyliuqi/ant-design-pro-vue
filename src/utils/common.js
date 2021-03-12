import moment from 'moment'

export { moment }
/**
 * 获取moment
 * @param date
 * @param format
 * @returns {*}
 */
export function getMoment (date, format) {
  if (isEmpty(format)) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  if (isEmpty(date)) {
    return moment(new Date(), format)
  } else {
    return moment(date, format)
  }
}
/**
 * 时间格式化
 * @param date
 * @param fromat
 * 返回字符串
 */
export function formatDate (date, format) {
  if (isEmpty(format)) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  if (isEmpty(date)) {
    return ''
  } else {
    return moment(date).format(format)
  }
}

/**
 * 时间偏移
 * @param date 时间
 * @param format 格式化
 * @param type 偏移类型 'year' 'month' 'week' 'day' 'hour' 'minute' 'second'
 * @param offset 偏移量
 */
export function offsetMoment (date, format, type, offset) {
  if (isEmpty(date)) {
    date = new Date()
  }
  if (isEmpty(format)) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  return moment(moment(date).add(offset, type), format)
}

/**
 * 时长格式化
 * @param milliseconds
 * @returns {string} x天x时x分x秒
 */
export function duration (milliseconds) {
  if (isEmpty(milliseconds)) {
    return '-'
  }
  const dur = moment.duration(milliseconds)
  if (dur.days() > 0) {
    return `${dur.days()}天${dur.hours()}时${dur.minutes()}分${dur.seconds()}秒`
  }
  if (dur.hours() > 0) {
    return `${dur.hours()}时${dur.minutes()}分${dur.seconds()}秒`
  }
  return `${dur.minutes()}分${dur.seconds()}秒`
}
/**
 * 判断是否为空
 * @param o
 * @returns {boolean}
 */
export function isEmpty (o) {
  switch (typeof (o)) {
    case 'undefined':
      return true
    case 'function':
      return false
    case 'boolean':
      return false
    case 'number':
      return false
    case 'string':
      return o.trim().length < 1
    case 'object':
      if (o === null) {
        return true
      } else if (typeof (o.length) === 'undefined') {
        return false
      } else {
        return Object.keys(o).length === 0
      }
    default:
      return Object.keys(o).length === 0
  }
}

/**
 * 生成uuid
 */
export function uuid () {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}
/**
 * 下载文件
 * @param data
 * @param fileName
 */
export function downFile (data, fileName) {
  const objectUrl = URL.createObjectURL(data)
  // 文件地址
  const link = document.createElement('a')
  link.download = decodeURI(fileName)
  link.href = objectUrl
  link.click()
  return { 'code': 10000, 'msg': '文件下载成功', 'result': '文件下载成功' }
}

/**
 * 生成图片节点
 */
export function createImgNode (data, fileName) {
  const objectUrl = URL.createObjectURL(data)
  // 文件地址
  const img = document.createElement('img')
  img.src = objectUrl
  img.alt = fileName
  return { 'code': 10000, 'msg': '文件创建成功', 'result': img }
}

/**
 * 流程表单变量日期格式化
 * @param formProps
 * @param fields
 * @returns {*}
 */
export function setActivitiFormDateFormat (formProps, fields) {
  const values = formProps.values
  if (values) {
    if (fields && fields.length > 0) {
      fields.forEach(i => {
        if (i.type === 'date') {
          values[i.id] = formatDate(values[i.id], 'YYYY-MM-DD')
        } else if (i.type === 'datetime') {
          values[i.id] = formatDate(values[i.id])
        } else if (i.type === 'checkbox') {
          if (values[i.id]) {
            values[i.id] = JSON.stringify(values[i.id])
          }
        }
      })
    }
  }
  return formProps
}

/**
 * 数字格式化
 * @param o
 * @param p
 * @returns {string}
 */
export function toFixed (o, p) {
  if (o) {
    if (!p) {
      p = 2
    }
    return o.toFixed(p)
  }
  return ''
}
