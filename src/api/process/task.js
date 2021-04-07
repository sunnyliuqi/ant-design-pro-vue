import path from '@/api/index'
import {
  axios
} from '@/utils/request'
import parsePageParams from '@/utils/page'
// 分页
export function queryList (data) {
  return axios({
    url: path.process + '/historys/task/historic-task-instances',
    method: 'GET',
    params: { ...data, ...parsePageParams(data), 'order': 'desc', 'sort': 'start' }
  })
}

/**
 * 执行任务动作
 * @param data
 * @returns {AxiosPromise}
 */
export function taskAction (id, data) {
  return axios({
    url: path.process + '/tasks/runtime/' + id,
    method: 'POST',
    data: data
  })
}

/**
 * 获取任务候选人
 * @param data
 * @returns {AxiosPromise}
 */
export function taskCandidate (id) {
  return axios({
    url: path.process + '/runtime/tasks/' + id + '/identitylinks',
    method: 'GET'
  })
}
