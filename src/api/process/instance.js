import path from '@/api/index'
import {
  axios, axiosFile
} from '@/utils/request'
import parsePageParams from '@/utils/page'
import { createImgNode } from '@/utils/common'
// 分页
export function queryList (data) {
  return axios({
    url: path.process + '/historys/instance/historic-process-instances',
    method: 'GET',
    params: { ...data, ...parsePageParams(data), 'order': 'desc', 'sort': 'startTime' }
  })
}

/**
 * 终止流程
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteProcessInstance (data) {
  return axios({
    url: path.process + '/instances/runtime/process-instances/' + data.id,
    method: 'DELETE',
    params: { 'deleteReason': data.deleteReason }
  })
}

/**
 * 获取流程实例
 * @param data
 * @returns {AxiosPromise}
 */
export function getProcessInstance (id) {
  return axios({
    url: path.process + '/history/historic-process-instances/' + id,
    method: 'GET'
  })
}

/**
 * 获取流程实例的diagram
 * @param id
 * @returns {AxiosPromise}
 */
export function getProcessInstanceDiagram (id) {
  return axiosFile({
    url: path.process + '/runtime/process-instances/' + id + '/diagram',
    headers: { 'Accept': '*/*' },
    method: 'GET',
    fileName: `${id}.png`,
    handleCallBack: createImgNode
  })
}

/**
 * 获取流程实例的tasks
 * @param id
 * @returns {AxiosPromise}
 */
export function getHistoricProcessTaskInstances (id) {
  return axios({
    url: path.process + '/history/historic-task-instances',
    method: 'GET',
    params: { 'processInstanceId': id }
  })
}

/**
 * 获取流程实例的variables
 * @param id
 * @returns {AxiosPromise}
 */
export function getHistoricActivityInstances (id) {
  return axios({
    url: path.process + '/history/historic-variable-instances',
    method: 'GET',
    params: { 'processInstanceId': id }
  })
}

/**
 * 获取流程实例的subprocesses
 * @param id
 * @returns {AxiosPromise}
 */
export function getHistoricSubprocessInstances (id) {
  return axios({
    url: path.process + '/history/historic-process-instances',
    method: 'GET',
    params: { 'superProcessInstanceId': id }
  })
}

/**
 * 获取流程实例的jobs
 * @param id
 * @returns {AxiosPromise}
 */
export function getJobs (id) {
  return axios({
    url: path.process + '/management/jobs',
    method: 'GET',
    params: { 'processInstanceId': id }
  })
}
