import path from '@/api/index'
import {
  axios
} from '@/utils/request'
import parsePageParams from '@/utils/page'

// 分页
export function queryList (data) {
  return axios({
    url: path.sys + '/api/list',
    method: 'POST',
    data: { 'desc': 'addTime', ...parsePageParams(data) }
  })
}

// 保存
export function save (data) {
  return axios({
    url: path.sys + '/api/add',
    method: 'PUT',
    data: data
  })
}

// 修改
export function update (data) {
  return axios({
    url: path.sys + '/api/update',
    method: 'PUT',
    data: data
  })
}

// 删除
export function del (data) {
  return axios({
    url: path.sys + '/api',
    method: 'DELETE',
    data: data
  })
}

// 获取详情
export function get (params) {
  return axios({
    url: path.sys + '/api/id/' + params.id,
    method: 'GET'
  })
}

// checkName
export function checkName (params) {
  return axios({
    url: path.sys + '/api/checkName',
    method: 'GET',
    headers: { 'check': true },
    // id=params.id&name=params.name
    params: params
  })
}

// checkUrl
export function checkUrl (params) {
  return axios({
    url: path.sys + '/api/checkUrl',
    method: 'GET',
    headers: { 'check': true },
    // id=params.id&path=params.path&requestMethod=params.requestMethod
    params: params
  })
}
