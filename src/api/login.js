import path from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: path.sys + '/loginjwt',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
    params: parameter
  })
}
// 用户信息
export function getInfo () {
  return axios({
    url: path.sys + '/token/user',
    method: 'post'
  })
}
// 用户菜单和操作码
export function getMenus () {
  return axios({
    url: path.sys + '/token/user/menus',
    method: 'post'
  })
}
// 用户退出
export function logout () {
  return axios({
    url: path.sys + '/logoutjwt',
    method: 'post'
  })
}
// 更新密码
export function updatePasswd (data) {
  return axios({
    url: path.sys + '/user/updatePassword',
    method: 'post',
    data: data
  })
}
// 更新用户信息
export function updateUserInfo (data) {
  return axios({
    url: path.sys + '/user/updateInfo',
    method: 'put',
    data: data
  })
}
// 发送短信验证码
export function getSmsCaptcha (parameter) {
  return axios({
    url: path.sys + '/validationcode/sms/create',
    method: 'post',
    data: parameter
  })
}
/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    // url: path.default + '/loginMobileJwt',
    url: '/auth/2step-code',
    method: 'post',
    data: parameter
  })
}
