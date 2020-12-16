import path from './index'
import { isEmpty } from '@/utils/common'
import { axios } from '@/utils/request'
// 上传文件地址
export const UPLOAD_URL = process.env.VUE_APP_API_BASE_URL + path.upload
// 文件回显前缀
export const FILE_DISPLAY_PREFIX = path.uploads

// 解析文件响应
export function parseFileRespon (response) {
  if (isEmpty(response) || response.code !== 10000 || response.result.length < 1) {
    this.$message.error(() => {
      return response.msg || '服务异常，请稍后再试'
    })
    return ''
  } else {
    return response.result[0]
  }
}

/**
 * 1分片上传 地址
 * @returns
 */
export function chunk () {
  return UPLOAD_URL + '/oss/aliyun/chunk'
}

/**
 * 2分片上传完成
 * @param identifier
 * @returns {AxiosPromise}
 */
export function chunkComplete (identifier) {
  return axios({
    url: path.upload + '/oss/aliyun/chunk/complete',
    method: 'post',
    params: { 'identifier': identifier }
  })
}

/**
 * 3分片上传取消
 * @param identifier
 * @returns {AxiosPromise}
 */
export function chunkAbort (identifier) {
  return axios({
    url: path.upload + '/oss/aliyun/chunk/abort',
    method: 'post',
    params: { 'identifier': identifier }
  })
}
