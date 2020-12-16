// 分页参数解析工具
export default function parsePageParams (data) {
  return { 'size': (data.size ? data.size : 10), 'current': data.current }
}
