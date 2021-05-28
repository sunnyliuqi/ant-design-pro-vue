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
  if (pattern.test(proxyUrl)) {
    const _params = proxyUrl.replace(pattern, '$2')
    _proxyUrl = queryString.parse(_params)
  } else {
    _proxyUrl = {}
  }
  _proxyUrl.Authorization = storage.get(ACCESS_TOKEN)
  return process.env.VUE_APP_API_BASE_URL + path.report + '?' + queryString.stringify(_proxyUrl)
}
