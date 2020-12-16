/* eslint-disable node/no-deprecated-api */
const http = require('http')
const url = require('url')
const generate = require('./modules/index.js')
const port = process.env.PORT | 9228
const server = http
  .createServer(function (request, response) {
    try {
      const pathName = url.parse(request.url).pathname
      if (pathName === '/createFile') {
        let data = ''
        request.on('data', chunk => {
          data += chunk
          console.info('代码生成-前端-请求信息：' + data)
          response.writeHead(200, { 'Content-Type': 'text/plain' })
          response.write(generate.generateCodeHandle(JSON.parse(data)))
          response.end()
        })
      }
    } catch (e) {
      console.log(e)
    }
  })
server.listen(port, '127.0.0.1', () => {
  console.log('Server listening on port' + port)
  console.log('获取调试地址：http://127.0.0.1:9229/json/list')
})

// debugger 方法
// 浏览器访问 http://127.0.0.1:9229/json/list
// 复制 devtoolsFrontendUrlCompat 里面的值访问即可调试
