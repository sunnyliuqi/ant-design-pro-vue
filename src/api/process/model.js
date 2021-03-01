import path from '@/api/index'
import {
  axios
} from '@/utils/request'
import parsePageParams from '@/utils/page'

/**
 * 用户列表
 * @returns {AxiosPromise}
 */
export function users () {
  return axios({
    url: path.process + '/modeler/identity/users',
    method: 'GET'
  })
}

/**
 * 分组列表
 * @returns {AxiosPromise}
 */
export function groups () {
  return axios({
    url: path.process + '/modeler/identity/groups',
    method: 'GET'
  })
}
// 分页
export function queryList (data) {
  return axios({
    url: path.process + '/modeler/models',
    method: 'POST',
    data: data,
    params: parsePageParams(data)
  })
}

// 表单key唯一性校验
export function checkKey (params) {
  return axios({
    url: path.process + '/modeler/model/checkKey',
    method: 'GET',
    // 设置后，业务错误时不会调用弹出全局错误信息
    headers: { 'check': true },
    params: params
  })
}
// 保存
export function save (data) {
  return axios({
    url: path.process + '/modeler/model/add',
    method: 'POST',
    data: data
  })
}
// 修改
export function update (data) {
  return axios({
    url: path.process + '/modeler/model/update',
    method: 'PUT',
    data: data
  })
}
// 删除
export function del (data) {
  return axios({
    url: path.process + '/modeler/model/' + data.id,
    method: 'DELETE',
    data: data
  })
}
// 获取详情
export function get (params) {
  return axios({
    url: path.process + '/modeler/model/' + params.id,
    method: 'GET'
  })
}

/**
 * 获取历史
 * @param params
 * @returns {AxiosPromise}
 */
export function histories (params) {
  return axios({
    url: path.process + '/modeler/model/histories/' + params.id,
    method: 'GET'
  })
}

/**
 * 回滚版本
 * @param data
 * @returns {AxiosPromise}
 */
export function rollback (data) {
  return axios({
    url: path.process + '/modeler/model/rollback',
    method: 'PUT',
    data: data
  })
}
