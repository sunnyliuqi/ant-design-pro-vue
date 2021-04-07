# 前后端分离框架--vue\antd-vue 
## 代码生成（必读） 
1. 配置服务代理（[配置文件](./vue.config.js)）
    >proxy 节点下配置对应的代理服务  
    ````
             // demo服务
             '/api/demo': {
               target: 'http://127.0.0.1:67',
               changeOrigin: true,
               pathRewrite: { '^/api': '' }
             },
    ````
   >其中/api是全局默认，如需修改则到[.env](./.env)中VUE_APP_API_BASE_URL值  
/demo对应后台application.yml中context-path属性  
2. 运行项目
    >打开[package.json](./package.json)  
           >点击serve 进行运行  
           >也可以在Terminal 中跳转到front-manager-vue目录下执行 cnpm run serve  
3. 浏览器访问（默认就是代码生成页面），使用代码生成
    1. 点击新增
    2. 只生成路由（对于父级菜单使用） 
        > 录入路由信息并保存即可
    3. 生成页面
        > 接口服务配置添加（新增服务中服务地址对应配置服务代理中/api/demo中的demo）  
        这里面配置的服务就会在后台对应的服务项目生成相应的后台代码
    4. 录入相关信息保存
        > 保存后重启后台对应服务（如果启用了devtools 可以支持热部署，则不需要手动重启）  
        等待前台自动编译运行
## 页面权限控制（必读）
1. 自定义指令（视图数据只是隐藏，还是会读取）
    > <a-button v-authorize:xxx >查询</a-button> ,其中xxx对应菜单管理里面操作的操作编码
2. v-if方式（视图数据不会读取数据）
    ><a-button v-if="$authorize('xxx')" >查询</a-button>,其中xxx对应菜单管理里面操作的操作编码
3. 去掉菜单路由静态化
    >[dynRouter.config.js](./src/config/dynRouter.config.js)里面对应菜单设置 static: false
## 跳过全局性错误提示   
> 在接口文件对应的请求中添加headers: { 'check': true }，例如：
```
   export function checkWorkNum (params) {
     return axios({
       url: path.sys + '/user/checkWorkNum',
       method: 'GET',
       // 设置后，业务错误时不会调用弹出全局错误信息
       headers: { 'check': true },
       // id=params.id&workNum=params.workNum
       params: params
     })
   }
```
## 代码格式化命令  
  ```js-beautify -s 2 -f  service.js  -r service.js```
## 代码规范检查命令  
   ```npm run lint```
## 添加必填效果
> 标签添加class="custom-required"  
## 菜单路由静态化（代码生成的默认设置）
> 动态路由配置文件[dynRouter.config.js](./src/config/dynRouter.config.js)里面设置 static: true
## 日期工具类
> [common.js](./src/utils/common.js)  
> getMoment 获取当前时间  
> formatDate 日期转字符串  
> offsetMoment 日期偏移  
## 抽屉宽度设置
> 默认宽度：活动窗口的50%
> 自定义宽度： 可设置30%-90%（对应3-9），例如40%,
````
wrapClassName="custom-drawer custom-drawer-4"
````
