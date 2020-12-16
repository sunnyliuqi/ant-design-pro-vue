import path from '@/api/index'
import { axios } from '@/utils/request'

// 菜单树
export function queryList () {
  return axios({
    url: path.sys + '/menu/listTree',
    method: 'GET'
  })
}

// 保存
export function save (data) {
  return axios({
    url: path.sys + '/menu/add',
    method: 'PUT',
    data: data
  })
}

// 修改
export function update (data) {
  return axios({
    url: path.sys + '/menu/update',
    method: 'PUT',
    data: data
  })
}

// 删除
export function del (data) {
  return axios({
    url: path.sys + '/menu',
    method: 'DELETE',
    data: data
  })
}

// 获取详情
export function get (params) {
  return axios({
    url: path.sys + '/menu/id/' + params.id,
    method: 'GET'
  })
}

// 验证code
export function checkCode (params) {
  return axios({
    url: path.sys + '/menu/checkCode',
    method: 'GET',
    headers: { 'check': true },
    // id=params.id&code=params.code
    params: params
  })
}

// 验证url
export function checkUrl (params) {
  return axios({
    url: path.sys + '/menu/checkUrl',
    method: 'GET',
    headers: { 'check': true },
    // id=params.id&url=params.url
    params: params
  })
}

// 获取菜单和操作
export function getMenuAndOrganization () {
  return axios({
    url: path.sys + '/menu/getMenuAndOrganization',
    method: 'GET'
  })
}
