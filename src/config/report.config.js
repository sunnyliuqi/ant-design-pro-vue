import { dataAnalysis } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}
/**
 * 报表分析根节点
 * @type {{path: string, component: {name: string, render: (function(*): *)}, children: [], meta: {icon, title: string}}}
 */
export const reportRoot = {
  path: '/report',
  component: RouteView,
  meta: {
    title: '数据分析',
    icon: dataAnalysis
  },
  children: []
}
/**
 * 报表组件
 * @type {{path: string, component: (function(): *), meta: {keepAlive: boolean, title: string}, name: string}}
 */
export const reportComponent = {
  component: () => import('@/components/MyIframe/MyIframe'),
  meta: {}
}
