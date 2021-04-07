import { service } from './service'
// 系统多服务配置，对应后端的context-path配置
const path = service
/* {
  // 默认服务 系统管理
  default: '/sys',
  // 上传文件服务
  upload: '/upload',
  // 显示文件，nginx文件显示配置
  uploads: '/uploads',
  // 前端代码生成服务
  createCode: '/createFile'
} */
export default path
export function parsePageParams (data) {
  return {}
}
