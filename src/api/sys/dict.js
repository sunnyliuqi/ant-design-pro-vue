import path from '@/api/index'
import { axios, axiosFile } from '@/utils/request'
import parsePageParams from '@/utils/page'

// 分页
export function queryList (data) {
  return axios({
    url: path.sys + '/dict',
    method: 'POST',
    data: data,
    params: { 'desc': 'addTime', ...parsePageParams(data) }
  })
}

// 保存
export function save (data) {
  return axios({
    url: path.sys + '/dict/add',
    method: 'PUT',
    data: data
  })
}

// 修改
export function update (data) {
  return axios({
    url: path.sys + '/dict/update',
    method: 'PUT',
    data: data
  })
}

// 删除
export function del (data) {
  return axios({
    url: path.sys + '/dict',
    method: 'DELETE',
    data: data
  })
}

// 获取详情
export function get (params) {
  return axios({
    url: path.sys + '/dict/id/' + params.id,
    method: 'GET'
  })
}

// 检查类别
export function checkType (params) {
  return axios({
    url: path.sys + '/dict/checkType',
    method: 'GET',
    // id=params.id&type=params.type
    params: params
  })
}

// 获取所有的字典类型
export function getAllDict () {
  return axios({
    url: path.sys + '/dict/allType',
    method: 'GET'
  })
}
// 导出excel
export function exportExcel (data) {
  return axiosFile({
    url: path.sys + '/dict/export',
    method: 'POST',
    data: data
  })
}
// 模板下载
export function template () {
  return axiosFile({
    url: path.sys + '/dict/template',
    method: 'POST'
  })
}
// 导入excel
export function importExcel (file) {
  const data = new FormData()
  data.append('file', file)
  return axios({
    url: path.sys + '/dict/import',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 1800000,
    data: data
  })
}
