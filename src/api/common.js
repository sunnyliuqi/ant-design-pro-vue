import path from '@/api/index'
import { axios } from '@/utils/request'

// 根据类型获取数据字典
export function getDictByType (typeValue) {
  return axios({
    url: path.sys + '/dict/getByType',
    method: 'POST',
    data: { 'type': typeValue }
  })
}
