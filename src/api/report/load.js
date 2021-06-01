import path from '@/api/index'
import { axios } from '@/utils/request'
import queryString from 'querystring'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 获取代理地址
export function findProxyUrl (data) {
  return axios({
    url: path.sys + '/menu/findProxyUrl',
    method: 'POST',
    data: data
  })
}

/**
 * 读取url地址
 * @param proxyUrl
 * @returns {string}
 */
export function loadProxyUrl (proxyUrl) {
  const pattern = /(.*)?\?(.*)/
  let _proxyUrl
  let contextPath = proxyUrl
  if (pattern.test(proxyUrl)) {
    contextPath = proxyUrl.replace(pattern, '$1')
    const _params = proxyUrl.replace(pattern, '$2')
    _proxyUrl = queryString.parse(_params)
  } else {
    _proxyUrl = {}
  }
  _proxyUrl.Authorization = storage.get(ACCESS_TOKEN)
  const fullPath = process.env.VUE_APP_API_BASE_URL + path.report + contextPath + '?' + queryString.stringify(_proxyUrl)
  return fullPath
}
