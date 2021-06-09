import { asyncRouterMap, constantRouterMap, reportRootTemplate, reportComponentTemplate } from '@/config/router.config'
import cloneDeep from 'lodash.clonedeep'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param menus 用户拥有的系统菜单
 * @param route 本地路由配置
 * @returns {boolean}
 */
function hasPermission (menus, route) {
  if (route.meta !== undefined && route.meta.static !== undefined && route.meta.static === true) {
    return true
  }
  let hasPermiss = false
  menus.forEach(menu => {
    if (menu.url === route.path) {
      hasPermiss = true
    }
  })
  return hasPermiss
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter (routerMap, menus) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  })
  accessedRouters.forEach(route => {
    menus.forEach(menu => {
      if (menu.url === route.path) {
        route.meta.sort = menu.sort
        route.meta.title = menu.name
      }
    })
  })
  return accessedRouters.sort(function (a, b) {
    return (b.meta.sort || 1) - (a.meta.sort || 1)
  })
  //  return routerMap
}

/**
 * 添加数据报表路由
 * @param asyncRouterMap
 * @param menus
 * @returns {*}
 */
function addReportRoutes (asyncRouterMap, menus) {
  if (menus && menus.length && menus.length > 0) {
    const reportMenus = menus.filter(m => m.url.indexOf('/report/') !== -1)
    if (reportMenus && reportMenus.length && reportMenus.length > 0) {
    //  存在报表菜单
      const reportRouterMap = reportMenus.map(r => {
        const reportMenu = { path: r.url, name: r.url, meta: { title: r.name, keepAlive: true } }
        return Object.assign({}, reportComponentTemplate, reportMenu)
      })
      reportRootTemplate.children = reportRouterMap
      const noReportRoutes = asyncRouterMap[0].children && asyncRouterMap[0].children.length > 0 && asyncRouterMap[0].children.filter(r => r.path !== '/report')
      asyncRouterMap[0].children = [...noReportRoutes, reportRootTemplate]
    }
  }
  return asyncRouterMap
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateDnyRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data
        const accessedRouters = filterAsyncRouter(addReportRoutes(cloneDeep(asyncRouterMap), menus), menus)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
