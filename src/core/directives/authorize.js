import Vue from 'vue'
import store from '@/store'

/**
 * 自定义指令
 * v-authorize:xxx
 * xxx为操作码
 * 操作权限控制
 * @type {DirectiveOptions}
 */
const authorize = Vue.directive('authorize', {
  inserted: function (el, binding, vnode) {
    /* 页面操作码 */
    const operationCode = binding.arg
    /* 用户是否超级管理员 */
    const { adminFlag } = store.getters.userInfo
    /* 用户所有操作码 */
    const operationCodes = store.getters.operationCodes
    if (adminFlag !== '1' && !operationCodes.includes(operationCode)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export default authorize
