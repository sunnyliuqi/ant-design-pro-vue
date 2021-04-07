import path from '@/api/index'
import { axios } from '@/utils/request'
import parsePageParams from '@/utils/page'
// 分页
export function queryList (data) {
  return axios({
    url: path.sys + '/log',
    method: 'POST',
    data: data,
    params: { 'desc': 'addTime', ...parsePageParams(data) }
  })
}

// 获取详情
export function get (params) {
  return axios({
    url: path.sys + '/log/' + params.id,
    method: 'GET'
  })
}
