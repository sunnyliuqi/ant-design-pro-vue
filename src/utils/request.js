import axios from 'axios'
import store from '@/store'
import router from '@/router'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, API_NO_AUTHORIZATIONS } from '@/store/mutation-types'
import { uuid, downFile } from './common'
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 30000 // 请求超时时间
})
// 创建axios 文件示例
const serviceFile = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 30000 // 请求超时时间
})
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      router.push('/403')
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
/*      const notificationKey = data.code + error.response.status
      notification.error({
        key: notificationKey,
        message: data.msg
      }) */
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    if (error.response.status <= 504 && error.response.status >= 500) {
      router.push('/500')
    }
    if (error.response.status >= 404 && error.response.status < 422) {
      router.push('/404')
    }
  }
  // return Promise.reject(error)
}
const requestConfig = config => {
  //  是否需要会话
  const isAuth = !(API_NO_AUTHORIZATIONS.includes(config.url))

  if (isAuth) {
    const token = storage.get(ACCESS_TOKEN)
    if (token) {
      config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
  }
  return config
}
// request interceptor
service.interceptors.request.use(requestConfig, err)

// response interceptor
service.interceptors.response.use((response) => {
  // console.log('接口服务响应数据：' + JSON.stringify(response.data))
  if (response.data.code !== 10000 && response.data.code !== 0 && !response.config.headers.check) {
    message.error(response.data.msg)
  }
  return response.data
}, err)
// 设置导出文件响应格式为二机制
serviceFile.interceptors.request.use(config => {
  config = Object.assign(requestConfig(config), { responseType: 'blob' })
  return config
}, err)

/**
 * 检查响应类型是否能处理
 * @param type
 * @returns {boolean}
 */
function checkType (type) {
  if (type === 'application/vnd.ms-excel' ||
    type === 'application/octet-stream' ||
    type.indexOf('image') > -1
  ) {
    return true
  }
  return false
}

// 读取服务端的文件
serviceFile.interceptors.response.use(response => {
  if (checkType(response.data.type)) {
    // 获取文件名
    const fileName = response.config.fileName || response.headers['content-disposition'].split('=')[1] || uuid()
    if (response.config.handleCallBack) {
      return response.config.handleCallBack(response.data, fileName)
    } else {
      return downFile(response.data, fileName)
    }
  } else {
    const reader = new FileReader()
    reader.readAsText(response.data, 'utf-8')
    reader.onload = function () {
      const data = JSON.parse(reader.result)
      if (data.code && data.code !== 10000 && !response.config.headers.check) {
        message.error(data.msg)
      }
    }
    return { 'code': 20000 }
  }
}, err)
const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios,
  serviceFile as axiosFile
}
