/* eslint-disable no-eval */
// 文件系统
const fs = require('fs')
// 进程
const process = require('process')
// 子进程shell命令函数
const { exec } = require('child_process')

// 项目根路径 D:\workspace\framework\front-manager-vue
const bashPath = process.cwd()

// 字符编码
const character = 'utf8'

// 组件页面位置
const pagesPath = `${bashPath}/src/views`
// api文件位置
const serverPath = `${bashPath}/src/api`
// 路由配置位置
const routerPath = `${bashPath}/src/config`
// 模板文件位置
// 列表页面
const listTemp = './scripts/generateCode/modules/template/TempList.vue.temp'
// 新增页面
const addTemp = './scripts/generateCode/modules/template/Add.vue.temp'
// 编辑页面
const editTemp = './scripts/generateCode/modules/template/Edit.vue.temp'
// 详情页面
const detailsTemp = './scripts/generateCode/modules/template/Detail.vue.temp'
// api服务
const apiTemp = './scripts/generateCode/modules/template/functionName.js.temp'

/** 列表查询条件**/
let LIST_QUERY_CONDITION
/** 列表操作批量删除**/
let LIST_OPERATE_BATCH_DEL
/** 列表多选框**/
let LIST_ROW_SELECT
/** 列表内容下拉框**/
let LIST_CONTENT_SELECT
/** 列表 详情**/
let LIST_DETAIL
/** 列表 新增**/
let LIST_ADD
/** 列表 编辑**/
let LIST_EDIT
/** 列表 导入包**/
let LIST_IMPORT
/** 列表 Data**/
let LIST_DATA
/** 列表 数据字典**/
let LIST_DICT
/** 列表 方法**/
let LIST_METHOD

/** 功能名称小写user**/
let FUNCTION_NAME_LOWER
/** 功能名称首字母大写User**/
let FUNCTION_NAME_FIRST_UPPER
/** 父目录 sys **/
let PARENT_ROUTER
/** 服务路径 sys **/
let SERVICE_PATH
/** 全路由 /sys/user**/
let FULL_ROUTER
/** 是否存在数据字典**/
let isDict = false
/** 是否存在日期**/
let isDate = false

/** 编辑内容 **/
let EDIT_CONTENT
let EDIT_PROPS
let EDIT_SUBMIT
/** 详情内容 **/
let DETAIL_CONTENT
let DETAIL_PROPS
/** 新增内容 **/
let ADD_CONTENT
let ADD_PROPS
let ADD_SUBMIT
/**
 *  前端代码生成
 * @param param
 * @returns {string} 返回 {"code":10000,"msg":"处理成功","result":"处理成功"}
 */
const generateCodeHandle = param => {
  let code = 20000
  let msg = '不支持的生成方式'

  console.info('代码生成-前端-项目根路径为：' + bashPath)
  console.info('代码生成-前端-请求数据为：' + JSON.stringify(param))
  // user
  FUNCTION_NAME_LOWER = param.router.substring(1)
  // User
  FUNCTION_NAME_FIRST_UPPER = FUNCTION_NAME_LOWER.replace(FUNCTION_NAME_LOWER[0], FUNCTION_NAME_LOWER[0].toUpperCase())
  // /sys
  PARENT_ROUTER = param.parentRouter
  // /sys/user
  FULL_ROUTER = param.fileUrl

  /* 1.路由配置文件更新 D:\workspace\framework\front-manager-vue\src\config\dynRouter.config.js
  2.api服务更新 D:\workspace\framework\front-manager-vue\src\api\service.js
  3.api 文件新增 D:\workspace\framework\front-manager-vue\src\api\sys\user.js
  4.列表页面 文件新增 D:\workspace\framework\front-manager-vue\src\views\sys\user\UserList.vue
  5.详情页面 文件新增 D:\workspace\framework\front-manager-vue\src\views\sys\user\components\Detail.vue
  6.新增页面 文件新增D:\workspace\framework\front-manager-vue\src\views\sys\user\components\Add.vue
  7.更新页面 文件新增D:\workspace\framework\front-manager-vue\src\views\sys\user\components\Edit.vue
  */
  if (param.hasPage === '2') {
    //  只生成路由
    updateRouterConfig(param, 2)
    code = 10000
    msg = '生成路由成功'
  } else if (param.hasPage === '1') {
    /* 字段信息排序 */
    param.tableInfo = param.tableInfo.sort(columnSort)
    /* 更新模板文件的占位符 */
    setDictAndDate(param.tableInfo)
    SERVICE_PATH = param.serviceName.match(/(.*):/)[1]
    /* 更新列表页面 */
    LIST_QUERY_CONDITION = getQueryCondition(param)
    LIST_OPERATE_BATCH_DEL = getBatchDel(param)
    LIST_ROW_SELECT = getRowSelect(param)
    LIST_CONTENT_SELECT = getContentSelect(param)
    LIST_DETAIL = getListDetail(param)
    LIST_ADD = getListAdd(param)
    LIST_EDIT = getListEdit(param)
    LIST_IMPORT = getListImport(param)
    LIST_DATA = getListData(param)
    LIST_DICT = getListDict(param)
    LIST_METHOD = getListMethod(param)
    /* 更新详情页面 */
    DETAIL_CONTENT = getDetail(param)
    DETAIL_PROPS = getDetailProps(param)
    /* 更新新增页面 */
    ADD_CONTENT = getAdd(param)
    ADD_PROPS = getAddProps(param)
    ADD_SUBMIT = getAddOrEditSubmit(param)
    /* 更新编辑页面 */
    EDIT_CONTENT = getEdit(param)
    EDIT_PROPS = getEditProps(param)
    EDIT_SUBMIT = getAddOrEditSubmit(param)
    /* 生成页面 */
    /* 更新路由配置 */
    updateRouterConfig(param, 1)
    /* 更新服务（对应后端新建工程服务路径） */
    updateApiService(param)
    /* 创建api接口文件 */
    createApi(param)
    /* 创建列表页面  */
    createList(param)
    /* 创建详情页面 */
    createDetail(param)
    /* 创建新增页面 */
    createAdd(param)
    /* 创建编辑页面 */
    createEdit(param)
    /* lint 延迟5s修复 */
    setTimeout(formatFullCode, 5000)
    code = 10000
    msg = '生成页面成功'
  }
  const responseMsg = `{"code":${code},"msg":"${msg}","result":"${msg}"}`
  return responseMsg
}

/**
 * 更新路由配置
 * @param param
 * @param number 1表示生成带页面的路由 2表示生成父路由
 */
function updateRouterConfig (param, number) {
  let router
  if (number === 2) {
    // 生成父路由
    router = `{
      path: '${param.fileUrl}',
      component: PageView,
      meta: { title: '${param.chinaValue}', static: true },
      children: []
      }`
  } else {
    router = `{
      path: '${param.fileUrl}',
      name: '${param.engValue}',
      component: () => import('@/views${param.fileUrl}/${FUNCTION_NAME_FIRST_UPPER}List'),
      meta: { title: '${param.chinaValue}', keepAlive: true, static: true }
    }`
  }
  const filePath = `${routerPath}/dynRouter.config.js`
  fs.readFile(filePath, character, (err, data) => {
    if (err) console.error(JSON.stringify(err))
    const split = 'dynRouterMap ='
    // 拿到动态路由配置
    const dnyRouterArr = data.split(split)
    const dnyRouter = replaceError(dnyRouterArr[1])
    console.info(dnyRouter)
    const dnyRouterObj = JSON.parse(dnyRouter)
    const routerObj = JSON.parse(replaceError(router))
    // 将当前路由添加到路由配置里面
    setRouterToConfig(dnyRouterObj, routerObj)
    const dnyRouterJson = JSON.stringify(dnyRouterObj)
    const newRouterConfig = dnyRouterArr[0] + split + '\n' + reReplaceError(dnyRouterJson)
    fs.writeFile(filePath, newRouterConfig, character, (err) => {
      if (err) console.error(JSON.stringify(err))
      //  格式化代码
      formatJsonCode(filePath)
      // 代码规范修复
      formatCode(filePath)
    })
  })
}

function setRouterToConfig (dnyRouterObj, router) {
  dnyRouterObj.forEach(item => {
    if (item.path === PARENT_ROUTER) {
      if (!item.children) {
        item.children = []
      }
      item.children.push(router)
    } else {
      if (item.children && item.children.length) {
        setRouterToConfig(item.children, router)
      }
    }
  })
  return dnyRouterObj
}

/**
 * 更新api服务
 * @param param
 */
function updateApiService (param) {
  const filePath = `${serverPath}/service.js`
  fs.readFile(filePath, character, (err, data) => {
    if (err) console.error(JSON.stringify(err))
    // 拿到服务配置
    const prefix = 'export const service ='
    const serviceConfigObj = JSON.parse(data.replace(prefix, '').replace(/(\w+):\s*'(.+)'/g, '"$1":"$2"'))
    const serviceInfo = param.serviceName.split(/:|：/)
    if (!serviceInfo || serviceInfo.length < 2) {
      console.error('服务格式错误：' + param.serviceName)
    }
    const servicePro = {}
    servicePro[serviceInfo[0]] = serviceInfo[1].replace(/'/g, '').trim()
    const newData = prefix + JSON.stringify(Object.assign(serviceConfigObj, servicePro)).replace(/"[A-Za-z].+?"/g, ($1) => {
      return $1.substring(1, ($1.length - 1))
    })
    fs.writeFile(filePath, newData, character, (err) => {
      if (err) console.error(JSON.stringify(err))
      //  格式化代码
      formatJsonCode(filePath)
      // 代码规范修复
      formatCode(filePath)
    })
  })
}

/**
 * 创建api文件
 * @param param
 */
function createApi (param) {
  fs.readFile(apiTemp, character, (err, data) => {
    if (err) console.error(JSON.stringify(err))
    const dir = `${serverPath}${PARENT_ROUTER}`.replace(/\\/g, '/')
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) console.error(JSON.stringify(err))
      data = data
        .replace(/#{SERVICE_PATH}/g, SERVICE_PATH)
        .replace(/#{FULL_ROUTER}/g, FULL_ROUTER)
      const filePath = `${dir}/${FUNCTION_NAME_LOWER}.js`
      fs.writeFile(filePath, data, character, (err) => {
        if (err) console.error(JSON.stringify(err))
        //  格式化代码
        formatJsonCode(filePath)
        // 代码规范修复
        formatCode(filePath)
      })
    })
  })
}

/**
 * 创建list页面
 * @param param
 */
function createList (param) {
  fs.readFile(listTemp, character, (err, data) => {
    if (err) console.error(JSON.stringify(err))
    const dir = `${pagesPath}${FULL_ROUTER}`.replace(/\\/g, '/')
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) console.error(JSON.stringify(err))
      const filePath = `${dir}/${FUNCTION_NAME_FIRST_UPPER}List.vue`
      fs.writeFile(filePath, replaceContent(data), character, (err) => {
        if (err) console.error(JSON.stringify(err))
        // 代码规范修复
        formatCode(filePath)
      })
    })
  })
}

/**
 * 创建详情页面
 * @param param
 */
function createDetail (param) {
  fs.readFile(detailsTemp, character, (err, data) => {
    if (err) console.error(JSON.stringify(err))
    const dir = `${pagesPath}${FULL_ROUTER}/components`.replace(/\\/g, '/')
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) console.error(JSON.stringify(err))
      const filePath = `${dir}/Detail.vue`
      fs.writeFile(filePath, replaceContent(data), character, (err) => {
        if (err) console.error(JSON.stringify(err))
        // 代码规范修复
        formatCode(filePath)
      })
    })
  })
}

/**
 * 创建新增页面
 * @param param
 */
function createAdd (param) {
  fs.readFile(addTemp, character, (err, data) => {
    if (err) console.error(JSON.stringify(err))
    const dir = `${pagesPath}${FULL_ROUTER}/components`.replace(/\\/g, '/')
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) console.error(JSON.stringify(err))
      const filePath = `${dir}/Add.vue`
      fs.writeFile(filePath, replaceContent(data), character, (err) => {
        if (err) console.error(JSON.stringify(err))
        // 代码规范修复
        formatCode(filePath)
      })
    })
  })
}

/**
 * 创建编辑页面
 * @param param
 */
function createEdit (param) {
  fs.readFile(editTemp, character, (err, data) => {
    if (err) console.error(JSON.stringify(err))
    const dir = `${pagesPath}${FULL_ROUTER}/components`.replace(/\\/g, '/')
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) console.error(JSON.stringify(err))
      const filePath = `${dir}/Edit.vue`
      fs.writeFile(filePath, replaceContent(data), character, (err) => {
        if (err) console.error(JSON.stringify(err))
        // 代码规范修复
        formatCode(filePath)
      })
    })
  })
}

/**
 *<a-col :md="8" :sm="12" :xs="24">
 <a-form-item label="用户名">
 <a-input v-model="queryParam.userName" placeholder="请输入用户名"/>
 </a-form-item>
 </a-col>
 * @param param
 * @returns {string}
 */
function getQueryCondition (param) {
  const tableInfo = param.tableInfo
  const temp = []
  tableInfo.forEach(column => {
    if (column.queryFlag === '1') {
      if (column.componentType === 'InputNumber') {
        temp.push(`
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="${column.columnName}">
                <a-input-number v-model="queryParam.${column.javaName}" placeholder="请输入${column.columnName}"/>
              </a-form-item>
            </a-col>`)
      } else if (column.componentType === 'Select') {
        if (dictFlag(column)) {
          // 数据字典
          temp.push(`
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="${column.columnName}">
                <a-select :options="${underLineToCamelbak(column.componentData)}" v-model="queryParam.${column.javaName}" placeholder="全部"/>
              </a-form-item>
            </a-col>`)
        } else {
          const selectOptions = column.componentData.split(/;|；/)
          // 自定义
          const selectOpt = []
          selectOptions.forEach(opt => {
            const opts = opt.split(/:|：/)
            if (typeof (opts) === 'object' && opts.length === 2) {
              selectOpt.push(`\n                  <a-select-option value="${opts[0]}">${opts[1]}</a-select-option>`)
            }
          })
          temp.push(`
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="${column.columnName}">
                <a-select v-model="queryParam.${column.javaName}" placeholder="全部">${selectOpt.join('')}
                </a-select>
              </a-form-item>
            </a-col>`)
        }
      } else if (column.componentType === 'DatePicker_date') {
        temp.push(`
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="${column.columnName}">
                <a-range-picker v-model="queryParam.${column.javaName}Condition"/>
              </a-form-item>
            </a-col>`)
      } else if (column.componentType === 'DatePicker_datetime') {
        temp.push(`
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item
                label="${column.columnName}">
                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-model="queryParam.${column.javaName}Condition"/>
              </a-form-item>
            </a-col>`)
      } else {
        temp.push(`
            <a-col :md="8" :sm="12" :xs="24">
              <a-form-item label="${column.columnName}">
                <a-input v-model="queryParam.${column.javaName}" placeholder="请输入${column.columnName}"/>
              </a-form-item>
            </a-col>`)
      }
    }
  })
  return temp.join('')
}

/**
 * 批量删除操作
 * @param param
 * @returns {string}
 */
function getBatchDel (param) {
  const temp = []
  if (param.tableType === '2') {
    temp.push(`        <a-popconfirm title="您确认批量删除吗?" @confirm="handleDelete(selectedRows)" okText="确认" cancelText="取消">
          <a-button style="margin-left: 8px">批量删除</a-button>
        </a-popconfirm>`)
  }

  return temp.join('')
}

/**
 * 列表多选项
 * @param param
 * @returns {string}
 */
function getRowSelect (param) {
  const temp = []
  if (param.tableType === '2') {
    temp.push(`      :rowSelection="options.rowSelection"
      :alert="options.alert"`)
  }

  return temp.join('')
}

function getContentSelect (param) {
  const temp = []
  const tableInfo = param.tableInfo
  tableInfo.forEach(column => {
    if (column.componentType === 'Select') {
      const getName = `get_${column.tableColumn}`
      temp.push(`\n      <span slot="${column.javaName}" slot-scope="text">
        {{ ${underLineToCamelbak(getName)}Name(text) }}
      </span>`)
    }
  })
  return temp.join('')
}

/** 列表详情**/
function getListDetail (param) {
  const temp = []
  const tableInfo = param.tableInfo
  temp.push(`      ref="${FUNCTION_NAME_LOWER}Detail"`)
  formatDate(tableInfo, temp)
  selectFun(tableInfo, temp)
  return temp.join('')
}

/** 列表新增**/
function getListAdd (param) {
  const temp = []
  const tableInfo = param.tableInfo
  temp.push(`      ref="${FUNCTION_NAME_LOWER}Add"`)
  dictFun(tableInfo, temp)
  formatDate(tableInfo, temp)
  return temp.join('')
}

/** 列表编辑**/
function getListEdit (param) {
  const temp = []
  const tableInfo = param.tableInfo
  temp.push(`      ref="${FUNCTION_NAME_LOWER}Edit"`)
  dictFun(tableInfo, temp)
  formatDate(tableInfo, temp)
  getMoment(tableInfo, temp)
  return temp.join('')
}

/** 数据字典函数**/
function dictFun (tableInfo, temp) {
  tableInfo.forEach(column => {
    if (dictFlag(column)) {
      // 数据字典
      const selectName = `select_${column.componentData}`
      temp.push(`
      :${underLineToMidcourtLine(column.componentData)}="${underLineToCamelbak(selectName)}"`)
    }
  })
}

function dictProps (tableInfo, temp) {
  tableInfo.forEach(column => {
    if (dictFlag(column)) {
      // 数据字典
      temp.push(`
    ${underLineToCamelbak(column.componentData)}: {
      type: Array,
      default: function () {
        return {}
      }
    },`)
    }
  })
}

/** 下拉框函数**/
function selectFun (tableInfo, temp) {
  tableInfo.forEach(column => {
    if (column.componentType === 'Select') {
      const getName = `get_${column.tableColumn}`
      temp.push(`
      :${underLineToMidcourtLine(getName)}-name="${underLineToCamelbak(getName)}Name"`)
    }
  })
}

function selectProps (tableInfo, temp) {
  tableInfo.forEach(column => {
    if (column.componentType === 'Select') {
      const getName = `get_${column.tableColumn}`
      temp.push(`
    ${underLineToCamelbak(getName)}Name: {
      type: Function,
      default: undefined
    },`)
    }
  })
}

/**
 * 是否存在数据字典、日期
 * @param tableInfo
 */
function setDictAndDate (tableInfo) {
  tableInfo.forEach(column => {
    // column.publicFlag === '0' &&
    if (!isDate && (column.componentType === 'DatePicker_datetime' || column.componentType === 'DatePicker_date')) {
      isDate = true
    }
    if (!isDict) {
      isDict = dictFlag(column)
    }
  })
}

/**
 * 是否数据字典判断
 * @param column
 * @returns {boolean}
 */
function dictFlag (column) {
  if (column.componentType === 'Select') {
    const selectOptions = column.componentData.split(/;|；/)
    if (selectOptions.length < 2) {
      return true
    }
  }
  return false
}

/** 日期函数**/
function formatDate (tableInfo, temp) {
  if (isDate) {
    temp.push(`
      :format-date="formatDate"`)
  }
}

function formatDateProps (tableInfo, temp) {
  if (isDate) {
    temp.push(`
    formatDate: {
      type: Function,
      default: undefined
    },`)
  }
}

/**
 * 时间格式化函数
 * @param tableInfo
 * @param temp
 */
function getMoment (tableInfo, temp) {
  if (isDate) {
    temp.push(`
      :get-moment="getMoment"`)
  }
}

function getMomentProps (tableInfo, temp) {
  if (isDate) {
    temp.push(`
    getMoment: {
      type: Function,
      default: undefined
    },`)
  }
}

/**
 * list import
 * @param param
 * @returns {string}
 */
function getListImport (param) {
  const temp = []
  const tableInfo = param.tableInfo
  if (isDate) {
    temp.push(`\nimport { formatDate, getMoment } from '@/utils/common'`)
  }/*  else {
    temp.push(`\nimport { isEmpty } from '@/utils/common'`)
  } */
  temp.push(`\nimport { del, get, queryList, save, update } from '@/api${FULL_ROUTER}'`)
  if (isDict) {
    temp.push(`\nimport { getDictByType } from '@/api/common'`)
  }
  return temp.join('')
}

/**
 * 列表 data
 * @param param
 * @returns {string}
 */
function getListData (param) {
  const temp = []
  temp.push(`      columns: [\n`)
  const tableInfo = param.tableInfo
  const queryTime = []
  const dicts = []
  tableInfo.forEach(column => {
    if (column.componentType === 'DatePicker_datetime') {
      queryTime.push(`
        if (this.queryParam.${column.javaName}Condition) {
          this.queryParam.${column.javaName}Search = []
          this.queryParam.${column.javaName}Search[0] = formatDate(this.queryParam.${column.javaName}Condition[0], 'YYYY-MM-DD HH:mm:ss')
          this.queryParam.${column.javaName}Search[1] = formatDate(this.queryParam.${column.javaName}Condition[1], 'YYYY-MM-DD HH:mm:ss')
        }`)
    }
    if (column.componentType === 'DatePicker_date') {
      queryTime.push(`
        if (this.queryParam.${column.javaName}Condition) {
          this.queryParam.${column.javaName}Search = []
          this.queryParam.${column.javaName}Search[0] = formatDate(this.queryParam.${column.javaName}Condition[0], 'YYYY-MM-DD')
          this.queryParam.${column.javaName}Search[1] = formatDate(this.queryParam.${column.javaName}Condition[1], 'YYYY-MM-DD')
        }`)
    }
    if (dictFlag(column)) {
      const selectName = `select_${column.componentData}`
      dicts.push(`
      ${underLineToCamelbak(column.componentData)}: [{ label: '全部', value: '' }],
      ${underLineToCamelbak(selectName)}: [],`)
    }
    if (column.listFlag === '1') {
      if (column.componentType === 'Select') {
        temp.push(`        {
          title: '${column.columnName}',
          dataIndex: '${column.javaName}',
          key: '${column.javaName}',
          scopedSlots: { customRender: '${column.javaName}' }
        },\n`)
      } else {
        temp.push(`        {
          title: '${column.columnName}',
          dataIndex: '${column.javaName}',
          key: '${column.javaName}'
        },\n`)
      }
    }
  })
  temp.push(`        {
          title: '操作',
          dataIndex: 'action',
          width: '320px',
          scopedSlots: { customRender: 'action' }
        }
      ],`)
  if (isDate) {
    temp.push(`
      // 日期工具类
      formatDate: formatDate,
      getMoment: getMoment,`)
    temp.push(`
      // 列表加载数据方法
      loadData: parameter => {${queryTime.join('')}
        return queryList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      },`)
  } else {
    temp.push(`
        loadData: parameter => {
        return queryList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 10000) {
              return res.result
            }
          })
      },`)
  }
  if (isDict) {
    temp.push(`${dicts.join('')}`)
  }
  if (param.tableType === '2') {
    temp.push(`\n      // 列表选择
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      selectedRowKeys: [],
      selectedRows: [],`)
  }
  return temp.join('')
}

/**
 * 数组排序 -升序
 * @param obj1
 * @param obj2
 */
function columnSort (obj1, obj2) {
  const val1 = obj1.sort
  const val2 = obj2.sort
  if (val1 > val2) {
    return 1
  } else if (val1 < val2) {
    return -1
  } else {
    return 0
  }
}

/**
 * 数据字典数据
 * @param param
 * @returns {string}
 */
function getListDict (param) {
  const temp = []
  const tableInfo = param.tableInfo
  tableInfo.forEach(column => {
    if (dictFlag(column)) {
      // 数据字典
      const dnyName = `dny_${column.componentData}`
      const selectName = `select_${column.componentData}`
      temp.push(`\n    getDictByType('${column.componentData}').then(
      (res) => {
        if (res.code === 10000) {
          const ${underLineToCamelbak(dnyName)} = res.result.map(item => {
            return { label: \`\${item.dictKey}\`, value: \`\${item.dictValue}\` }
          })
          this.${underLineToCamelbak(column.componentData)} = [...this.${underLineToCamelbak(column.componentData)}, ...${underLineToCamelbak(dnyName)}]
          this.${underLineToCamelbak(selectName)} = ${underLineToCamelbak(dnyName)}
        }
      }
    )`)
    }
  })
  return temp.join('')
}

/**
 * 列表方法
 * @param param
 * @returns {string}
 */
function getListMethod (param) {
  const temp = []
  if (param.tableType === '2') {
    temp.push(`    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },`)
  }
  const tableInfo = param.tableInfo
  tableInfo.forEach(column => {
    if (column.componentType === 'Select') {
      const getName = `get_${column.tableColumn}`
      if (dictFlag(column)) {
        const selectName = `select_${column.componentData}`
        temp.push(`\n    ${underLineToCamelbak(getName)}Name (key) {
      let value = ''
      this.${underLineToCamelbak(selectName)}.forEach(item => {
        if (item.value === key) {
          value = item.label
        }
      })
      return value
    },`)
      } else {
        const caseOpts = column.componentData.split(/;|；/)
        // 自定义
        const caseKeys = []
        caseOpts.forEach(opt => {
          const opts = opt.split(/:|：/)
          if (typeof (opts) === 'object' && opts.length === 2) {
            caseKeys.push(`\n        case '${opts[0]}':
          value = '${opts[1]}'
          break`)
          }
        })
        temp.push(`\n    ${underLineToCamelbak(getName)}Name (key) {
      let value = ''
      switch (key) {${caseKeys.join('')}
      }
      return value
    },`)
      }
    }
  })
  return temp.join('')
}

/**
 * <a-col :span="12">
 <a-form-item
 label="工号"
 :labelCol="{ span: 8 }"
 :wrapperCol="{ span: 16 }">
 <a-input
 v-decorator="[
 'workNum',
 {
                  initialValue: record.workNum,
                  rules: [ { required: true, message: '工号不能为空' }]
                }
 ]"
 placeholder="请输入工号"/>
 </a-form-item>
 </a-col>
 * @param param
 * @returns {string}
 */
function getEdit (param) {
  const temp = []
  const tableInfo = param.tableInfo
  tableInfo.forEach(column => {
    if (column.publicFlag === '0' && column.editFlag === '1') {
      if (column.componentType === 'Select') {
        if (dictFlag(column)) {
          let allowClear = ''
          if (column.notNullFlag === '0') {
            allowClear = ' allowClear'
          }
          //  数据字典
          temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select
              :options="${underLineToCamelbak(column.componentData)}"
             ${getEditDecorator(column)}${allowClear}
              placeholder="请选择${column.columnName}"/>
          </a-form-item>
        </a-col>`)
        } else {
          //  自定义
          const selectOptions = column.componentData.split(/;|；/)
          const selectOpt = []
          if (column.notNullFlag === '0') {
            selectOpt.push(`\n              <a-select-option value="">请选择</a-select-option>`)
          }
          selectOptions.forEach(opt => {
            const opts = opt.split(/:|：/)
            if (typeof (opts) === 'object' && opts.length === 2) {
              selectOpt.push(`\n              <a-select-option value="${opts[0]}">${opts[1]}</a-select-option>`)
            }
          })
          temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select
              ${getEditDecorator(column)} placeholder="请选择${column.columnName}">${selectOpt.join('')}
            </a-select>
          </a-form-item>
        </a-col>`)
        }
      } else if (column.componentType === 'DatePicker_date') {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-date-picker
              ${getEditDecorator(column)}
              placeholder="请选择${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      } else if (column.componentType === 'DatePicker_datetime') {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-date-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              ${getEditDecorator(column)}
              placeholder="请选择${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      } else if (column.componentType === 'InputNumber') {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input-number
              ${getEditDecorator(column)}
              placeholder="请输入${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      } else {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              ${getEditDecorator(column)}
              placeholder="请输入${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      }
    }
  })
  return temp.join('')
}

/**
 * <a-col :sm="12" :xs="24">
 <span class="detail-label">编码</span><span class="detail-content">{{ record.userCode }}</span>
 </a-col>
 * @param param
 * @returns {string}
 */
function getDetail (param) {
  const temp = []
  const tableInfo = param.tableInfo
  tableInfo.forEach(column => {
    if (column.publicFlag === '0') {
      if (column.componentType === 'Select') {
        const getName = `get_${column.tableColumn}`
        temp.push(`
      <a-col :lg="12" :md="24">
        <span class="detail-label">${column.columnName}</span><span class="detail-content">{{ ${underLineToCamelbak(getName)}Name(record.${column.javaName}) }}</span>
      </a-col>`)
      } else if (column.componentType === 'DatePicker_date') {
        temp.push(`
      <a-col :lg="12" :md="24">
        <span class="detail-label">${column.columnName}</span><span class="detail-content">{{ formatDate(record.${column.javaName},'YYYY-MM-DD') }}</span>
      </a-col>`)
      } else if (column.componentType === 'DatePicker_datetime') {
        temp.push(`
      <a-col :lg="12" :md="24">
        <span class="detail-label">${column.columnName}</span><span class="detail-content">{{ formatDate(record.${column.javaName},'YYYY-MM-DD HH:mm:ss') }}</span>
      </a-col>`)
      } else {
        temp.push(`
      <a-col :lg="12" :md="24">
        <span class="detail-label">${column.columnName}</span><span class="detail-content">{{ record.${column.javaName} }}</span>
      </a-col>`)
      }
    }
  })
  return temp.join('')
}

/**
 * 详情 props
 * @param param
 */
function getDetailProps (param) {
  const temp = []
  formatDateProps(param.tableInfo, temp)
  selectProps(param.tableInfo, temp)
  return temp.join('')
}

/**
 * <a-col :span="12">
 <a-form-item
 label="工号"
 :labelCol="{ span: 8 }"
 :wrapperCol="{ span: 16 }">
 <a-input
 v-decorator="[
 'workNum',
 {rules: [ { required: true, message: '工号不能为空' }]}
 ]"
 placeholder="请输入工号"/>
 </a-form-item>
 </a-col>
 * @param param
 * @returns {string}
 */
function getAdd (param) {
  const temp = []
  const tableInfo = param.tableInfo
  tableInfo.forEach(column => {
    if (column.publicFlag === '0' && column.insertFlag === '1') {
      if (column.componentType === 'Select') {
        if (dictFlag(column)) {
          let allowClear = ''
          if (column.notNullFlag === '0') {
            allowClear = ' allowClear'
          }
          //  数据字典
          temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select :options="${underLineToCamelbak(column.componentData)}" ${getAddDecorator(column)}${allowClear} placeholder="请选择${column.columnName}"/>
          </a-form-item>
        </a-col>`)
        } else {
          //  自定义
          const selectOptions = column.componentData.split(/;|；/)
          const selectOpt = []
          if (column.notNullFlag === '0') {
            selectOpt.push(`\n              <a-select-option value="">请选择</a-select-option>`)
          }
          selectOptions.forEach(opt => {
            const opts = opt.split(/:|：/)
            if (typeof (opts) === 'object' && opts.length === 2) {
              selectOpt.push(`\n              <a-select-option value="${opts[0]}">${opts[1]}</a-select-option>`)
            }
          })
          temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select ${getAddDecorator(column)} placeholder="请选择${column.columnName}">${selectOpt.join('')}
            </a-select>
          </a-form-item>
        </a-col>`)
        }
      } else if (column.componentType === 'DatePicker_date') {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-date-picker
              ${getAddDecorator(column)}
              placeholder="请选择${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      } else if (column.componentType === 'DatePicker_datetime') {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-date-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              ${getAddDecorator(column)}
              placeholder="请选择${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      } else if (column.componentType === 'InputNumber') {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input-number
              ${getAddDecorator(column)}
              placeholder="请输入${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      } else {
        temp.push(`\n        <a-col :lg="12" :md="24">
          <a-form-item
            label="${column.columnName}"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-input
              ${getAddDecorator(column)}
              placeholder="请输入${column.columnName}"/>
          </a-form-item>
        </a-col>`)
      }
    }
  })
  return temp.join('')
}

/**
 * 新增提交页面
 * @param param
 */
function getAddOrEditSubmit (param) {
  const temp = []
  param.tableInfo.forEach(column => {
    if (column.componentType === 'DatePicker_datetime') {
      temp.push(`\n          values.${column.javaName} = this.formatDate(values.${column.javaName}, 'YYYY-MM-DD HH:mm:ss')`)
    }
    if (column.componentType === 'DatePicker_date') {
      temp.push(`\n          values.${column.javaName} = this.formatDate(values.${column.javaName}, 'YYYY-MM-DD 00:00:00')`)
    }
  })
  return temp.join('')
}

/**
 * 新增 props
 * @param param
 * @returns {string}
 */
function getAddProps (param) {
  const temp = []
  formatDateProps(param.tableInfo, temp)
  dictProps(param.tableInfo, temp)
  return temp.join('')
}

/**
 * 编辑 props
 * @param param
 * @returns {string}
 */
function getEditProps (param) {
  const temp = []
  dictProps(param.tableInfo, temp)
  formatDateProps(param.tableInfo, temp)
  getMomentProps(param.tableInfo, temp)
  return temp.join('')
}

/**
 * Add页面
 * 装饰绑定
 * @param column
 */
function getAddDecorator (column) {
  const decorator = []
  const rule = []
  const initialValue = []
  if (column.notNullFlag === '1') {
    if (column.componentType === 'Select') {
      initialValue.push(`initialValue:'0',`)
    }
    rule.push(`rules:[{required: true, message: '${column.columnName}不能为空'}]`)
  }
  decorator.push(`v-decorator="['${column.javaName}',{${initialValue.join('')}${rule.join('')}}]"`)
  return decorator.join('')
}

/**
 * Edit页面
 * 装饰绑定
 * @param column
 */
function getEditDecorator (column) {
  const decorator = []
  const rule = []
  if (column.notNullFlag === '1') {
    rule.push(`,rules:[{required: true, message: '${column.columnName}不能为空'}]`)
  }
  if (column.componentType === 'DatePicker_date') {
    decorator.push(`v-decorator="['${column.javaName}',{initialValue: record.${column.javaName}?getMoment(record.${column.javaName},'YYYY-MM-DD'):undefined${rule.join('')}}]"`)
  } else if (column.componentType === 'DatePicker_datetime') {
    decorator.push(`v-decorator="['${column.javaName}',{initialValue: record.${column.javaName}?getMoment(record.${column.javaName},'YYYY-MM-DD HH:mm:ss'):undefined${rule.join('')}}]"`)
  } else {
    decorator.push(`v-decorator="['${column.javaName}',{initialValue: record.${column.javaName}${rule.join('')}}]"`)
  }
  return decorator.join('')
}

/**
 * 业务模板内容替换
 * @param data
 * @returns {*}
 */
function replaceContent (data) {
  return data
    .replace(/#{LIST_METHOD}/g, LIST_METHOD)
    .replace(/#{LIST_DICT}/g, LIST_DICT)
    .replace(/#{LIST_DATA}/g, LIST_DATA)
    .replace(/#{LIST_IMPORT}/g, LIST_IMPORT)
    .replace(/#{LIST_EDIT}/g, LIST_EDIT)
    .replace(/#{LIST_ADD}/g, LIST_ADD)
    .replace(/#{LIST_DETAIL}/g, LIST_DETAIL)
    .replace(/#{LIST_CONTENT_SELECT}/g, LIST_CONTENT_SELECT)
    .replace(/#{LIST_QUERY_CONDITION}/g, LIST_QUERY_CONDITION)
    .replace(/#{LIST_OPERATE_BATCH_DEL}/g, LIST_OPERATE_BATCH_DEL)
    .replace(/#{LIST_ROW_SELECT}/g, LIST_ROW_SELECT)
    .replace(/#{FUNCTION_NAME_LOWER}/g, FUNCTION_NAME_LOWER)
    .replace(/#{FUNCTION_NAME_FIRST_UPPER}/g, FUNCTION_NAME_FIRST_UPPER)
    .replace(/#{PARENT_ROUTER}/g, PARENT_ROUTER)
    .replace(/#{SERVICE_PATH}/g, SERVICE_PATH)
    .replace(/#{EDIT_CONTENT}/g, EDIT_CONTENT)
    .replace(/#{EDIT_PROPS}/g, EDIT_PROPS)
    .replace(/#{EDIT_SUBMIT}/g, EDIT_SUBMIT)
    .replace(/#{DETAIL_CONTENT}/g, DETAIL_CONTENT)
    .replace(/#{DETAIL_PROPS}/g, DETAIL_PROPS)
    .replace(/#{ADD_CONTENT}/g, ADD_CONTENT)
    .replace(/#{ADD_PROPS}/g, ADD_PROPS)
    .replace(/#{ADD_SUBMIT}/g, ADD_SUBMIT)
}

function replaceError (string) {
  return string
    .replace(/BasicLayout/g, '\'BasicLayout\'')
    .replace(/PageView/g, '\'PageView\'')
    .replace(/RouteView/g, '\'RouteView\'')
    .replace(/PagUserLayouteView/g, '\'UserLayout\'')
    .replace(/BlankLayout/g, '\'BlankLayout\'')
    .replace(/path:/g, '\'path\':')
    .replace(/component:/g, '\'component\':')
    .replace(/meta:/g, '\'meta\':')
    .replace(/name:/g, '\'name\':')
    .replace(/title:/g, '\'title\':')
    .replace(/static:/g, '\'static\':')
    .replace(/redirect:/g, '\'redirect\':')
    .replace(/children:/g, '\'children\':')
    .replace(/keepAlive:/g, '\'keepAlive\':')
    .replace(/hidden:/g, '\'hidden\':')
    .replace(/(icon):\s(.+?),/g, '"#$1": "$2#",')
    .replace(/\(\) =>.+?\)/g, ($1) => {
      return ('"' + $1 + '"').replace(/'/g, '##')
    }).replace(/'/g, '"')
}

function reReplaceError (string) {
  return string
    .replace(/"BasicLayout"/g, 'BasicLayout')
    .replace(/"PageView"/g, 'PageView')
    .replace(/"RouteView"/g, 'RouteView')
    .replace(/"UserLayout"/g, 'UserLayout')
    .replace(/"BlankLayout"/g, 'BlankLayout')
    .replace(/"path":/g, 'path:')
    .replace(/"component":/g, 'component:')
    .replace(/"meta":/g, 'meta:')
    .replace(/"name":/g, 'name:')
    .replace(/"title":/g, 'title:')
    .replace(/"static":/g, 'static:')
    .replace(/"redirect":/g, 'redirect:')
    .replace(/"children":/g, 'children:')
    .replace(/"keepAlive":/g, 'keepAlive:')
    .replace(/"hidden":/g, 'hidden:')
    .replace(/"#(icon)":\s?"(.*?)#",/g, '$1: $2,')
    .replace(/"\(\) =>.*?\)"/g, ($1) => {
      return $1.substring(1, ($1.length - 1)).replace(/##/g, '\'')
    })
}

/**
 * 代码格式化 Json 代码
 * @param command 命令
 */
const formatJsonCode = path => {
  const execCommand = `js-beautify -s 2 -f  ${path} -r ${path}`
  exec(execCommand, function (err, stdout, stderr) {
    if (err) console.error(JSON.stringify(err))
  })
}
/* 代码全部格式 */
const formatFullCode = () => {
  const execCommand = `npm run lint`
  exec(execCommand, function (err, stdout, stderr) {
    if (err) console.error(JSON.stringify(err))
  })
}
/**
 * 代码规范修复
 * @param command 命令
 */
const formatCode = fullpath => {
  const execCommand = `eslint --fix ${fullpath}`
  exec(execCommand, function (err, stdout, stderr) {
    if (err) console.error(JSON.stringify(err))
  })
}
/**
 * 下划线转驼峰标识
 * @param str
 * @returns {*}
 */
const underLineToCamelbak = str => {
  return str.replace(/_./g, ($1) => {
    return $1.substring(1, ($1.length)).toUpperCase()
  })
}
/**
 * 下划线转中线
 * @param str
 * @returns {*}
 */
const underLineToMidcourtLine = str => {
  return str.replace(/_/g, '-')
}
module.exports = {
  generateCodeHandle
}
