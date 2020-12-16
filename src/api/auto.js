import path from '@/api/index'
import { axios } from '@/utils/request'
import parsePageParams from '@/utils/page'

// 列表
export function queryList (data) {
  return axios({
    url: path.default + '/auto/completeList',
    method: 'POST',
    data: data,
    params: parsePageParams(data)
  })
}

// 删除
export function tableDel (params) {
  return axios({
    url: path.default + '/auto/del/' + params.id,
    method: 'GET'
  })
}

// 数据库表信息
export function tableInfo () {
  return axios({
    url: path.default + '/auto/tableList/',
    method: 'GET'
  })
}

// 表列 列表
export function tableColumnInfo (data) {
  return axios({
    url: path.default + '/auto/tableColumnList',
    method: 'POST',
    data: data
  })
}

// 保存
export function save (data) {
  return axios({
    url: (data.serviceName.match(/(.*):.*'(.*)'/)[2] || path.default) + '/auto/tableInfoSave',
    method: 'POST',
    data: data
  })
}

// 检查路由唯一性(暂不启用)
export function checkRouter (params) {
  return axios({
    url: path.default + '/auto/checkRouter',
    method: 'POST',
    // 设置后，业务错误时不会调用弹出全局错误信息
    headers: { 'check': true },
    params: params
  })
}
// 前端代码生成
export function createCode (data) {
  return axios({
    url: path.createCode,
    method: 'POST',
    // 设置后，业务错误时不会调用弹出全局错误信息
    data: data
  })
}
