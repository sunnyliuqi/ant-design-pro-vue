import path from '@/api/index'
import { axios } from '@/utils/request'
import parsePageParams from '@/utils/page'
// 分页
export function queryList (data) {
  return axios({
    url: path.sys + '/user',
    method: 'POST',
    data: data,
    params: parsePageParams(data)
  })
}

// 保存
export function save (data) {
  return axios({
    url: path.sys + '/user/add',
    method: 'PUT',
    data: data
  })
}

// 修改
export function update (data) {
  return axios({
    url: path.sys + '/user/update',
    method: 'PUT',
    data: data
  })
}

// 删除
export function del (data) {
  return axios({
    url: path.sys + '/user',
    method: 'DELETE',
    data: data
  })
}

// 启用禁用
export function enabled (data) {
  return axios({
    url: path.sys + '/user/enabled',
    method: 'POST',
    data: data
  })
}

// 重置密码
export function resetPassword (data) {
  return axios({
    url: path.sys + '/user/resetPassword',
    method: 'POST',
    data: data
  })
}

// 获取详情
export function get (params) {
  return axios({
    url: path.sys + '/user/id/' + params.id,
    method: 'GET'
  })
}
// 工号唯一性校验
export function checkWorkNum (params) {
  return axios({
    url: path.sys + '/user/checkWorkNum',
    method: 'GET',
    // 设置后，业务错误时不会调用弹出全局错误信息
    headers: { 'check': true },
    // id=params.id&workNum=params.workNum
    params: params
  })
}
// 用户名唯一性校验
export function checkUserName (params) {
  return axios({
    url: path.sys + '/user/checkUserName',
    method: 'GET',
    headers: { 'check': true },
    // id=params.id&userName=params.userName
    params: params
  })
}
// 所有用户列表
export function getUserAllList () {
  return axios({
    url: path.sys + '/user/allList',
    method: 'GET'
  })
}
