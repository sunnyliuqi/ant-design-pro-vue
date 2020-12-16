import path from '@/api/index'
import {
  axios
} from '@/utils/request'

/**
 * 获取activiti 用户列表
 * @param data
 * @returns {AxiosPromise}
 */
export function queryUsers (data) {
  return axios({
    url: path.process + '/identitys/users',
    method: 'GET',
    params: data
  })
}
