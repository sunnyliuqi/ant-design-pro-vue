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
