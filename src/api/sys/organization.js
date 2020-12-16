import path from '@/api/index'
import { axios } from '@/utils/request'

// 分页
export function queryList (data) {
  return axios({
    url: path.sys + '/organization/list',
    method: 'POST',
    data: data
  })
}

// 保存
export function save (data) {
  return axios({
    url: path.sys + '/organization/add',
    method: 'PUT',
    data: data
  })
}

// 修改
export function update (data) {
  return axios({
    url: path.sys + '/organization/update',
    method: 'PUT',
    data: data
  })
}

// 删除
export function del (data) {
  return axios({
    url: path.sys + '/organization',
    method: 'DELETE',
    data: data
  })
}

// 获取详情
export function get (params) {
  return axios({
    url: path.sys + '/organization/id/' + params.id,
    method: 'GET'
  })
}

// 验证编码
export function checkCode (params) {
  return axios({
    url: path.sys + '/organization/checkCode',
    method: 'GET',
    headers: { 'check': true },
    // id=params.id&code=params.code
    params: params
  })
}

// 组织机构树
export function treeList () {
  return axios({
    url: path.sys + '/organization/treeList',
    method: 'GET'
  })
}
