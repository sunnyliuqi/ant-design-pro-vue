import storage from 'store'
import { welcome } from '@/utils/util'
import { login, getInfo, logout, getMenus, updatePasswd, updateUserInfo } from '@/api/login'
import { FILE_DISPLAY_PREFIX } from '@/api/upload'
import { ACCESS_TOKEN, TOKEN_TIME_OUT } from '@/store/mutation-types'
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    serviceMenus: undefined,
    operationCodes: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = FILE_DISPLAY_PREFIX + avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_AUTH: (state, { serviceMenus, operationCodes }) => {
      state.serviceMenus = serviceMenus
      state.operationCodes = operationCodes
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          storage.set(ACCESS_TOKEN, result, TOKEN_TIME_OUT * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result
          commit('SET_NAME', { name: result.userName, welcome: welcome() })
          commit('SET_AVATAR', result.suserHeader)
          commit('SET_INFO', result)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户菜单信息
    GetMenus ({ commit }) {
      return new Promise((resolve, reject) => {
        getMenus().then(response => {
          const result = response.result
          commit('SET_AUTH', { serviceMenus: result.menus, operationCodes: result.operationCodes })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout ({ commit }) {
      return new Promise((resolve) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },
    // 更新密码
    UpdPasswd ({ commit }, passwdInfo) {
      return new Promise((resolve, reject) => {
        updatePasswd(passwdInfo).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 更新个人资料
    UpdateUserInfo ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        updateUserInfo(userInfo).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default user
