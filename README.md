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
## 导入导出
1. api js文件导出或者模板下载时新增axiosFile(只有导入时不用新增)  
    ```import { axios, axiosFile } from '@/utils/request'，```
2. 导出或模板下载,请求示例
    ````
    export function exportExcel (data) {
      return axiosFile({
        url: path.sys + '/dict/export',
        method: 'POST',
        data: data
      })
    }
    ````
3. 导入，请求示例
   ````
   export function importExcel (file) {
     const data = new FormData()
     data.append('file', file)
     return axios({
       url: path.sys + '/dict/import',
       method: 'POST',
       headers: { 'Content-Type': 'multipart/form-data' },
       timeout: 180000,
       data: data
     })
   }
   ````   
4. 页面组件实例
    ````
    <a-button v-authorize:SYS_DICT_EXPORT icon="download" @click="handleExport()">导出</a-button>
    <a-button v-authorize:SYS_DICT_IMPORT icon="cloud-download" @click="handleTemplate()">模板下载</a-button>
    <a-upload
      v-authorize:SYS_DICT_IMPORT
      name="file"
      :showUploadList="false"
      :customRequest="handleImport"
    >
      <a-button :icon="fileLoading ? 'loading' : 'upload'">导入</a-button>
    </a-upload>
   ...
   data () {
       return {
         /* 导入加载状态 */
         fileLoading: false,
   }
   ...
   methods: {
   ...
       /**
        * 导出
        */
       handleExport () {
         exportExcel(this.queryParam).then(res => {
           if (res.code === 10000) {
             this.$message.info(res.msg)
           }
         })
       },
       /**
        * 模板下载
        */
       handleTemplate () {
         template().then(res => {
           if (res.code === 10000) {
             this.$message.info(res.msg)
           }
         })
       },
       /**
        * 导入
        */
       handleImport (data) {
         this.fileLoading = true
         importExcel(data.file).then(res => {
           if (res.code === 10000) {
             this.$message.info(this.createMsg(res.result))
           }
         }).finally(() => {
           this.fileLoading = false
           this.refresh()
         })
       },
       /* 创建多行vnode */
       createMsg (messages) {
         const msgNodes = messages.map(msg => {
           return this.$createElement('p', msg)
         })
         const multiMsg = this.$createElement('p', { style: { textAlign: 'left' } }, msgNodes)
         return multiMsg
       },
   ...
   }
    ```` 
 5. 完整参考示例  
    [数据字典导入导出](./src/views/sys/dict/DictList.vue)  
## 大文件上传（项目需要开通阿里云OSS）
1. 引入组件
   ```
        import BaseUploader from '@/components/BaseUploader'
   ```
2. 如何使用
    > 快速使用 
   ````
   <base-uploader :complete-call-back="customCompleteCallBack" />
   ````  
   > 自定义使用
   ```
    <base-uploader :complete-call-back="customCompleteCallBack" >
     <uploader-unsupport></uploader-unsupport>
     <uploader-btn :attrs="attrs">选择视频</uploader-btn>
     <uploader-list></uploader-list>
    </base-uploader>
    ``` 
   > 自定义说明，支持内部标签<uploader-unsupport>、<uploader-drop>、<uploader-list>
3. 参考示例  
    [大文件示例](./src/views/example/BigFile.vue)  
    [更多文档查看](https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md)
## 更多文档查看   
> [vue](https://cn.vuejs.org/v2/guide/components.html)  
> [antd-vue UI组件](https://vue.ant.design/)  
> [ant-design-pro-vue 框架](https://github.com/sendya/ant-design-pro-vue)
