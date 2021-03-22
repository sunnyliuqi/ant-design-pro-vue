<template>
  <a-drawer
    wrapClassName="custom-drawer"
    :maskClosable="false"
    title="历史表单"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{ overflow: 'auto' }"
  >
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :lg="12" :md="24">
          <a-form-item
            label="历史版本"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }">
            <a-select
              :options="getOptions"
              @change="handleChange"
              v-decorator="[
                'historyVersion',
                {rules: []}
              ]"
              placeholder="请选择一个版本进行查看"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left" v-if="activeObject">
        基础信息
      </a-divider>
      <a-row :gutter="16" v-if="activeObject">
        <a-col :lg="12" :md="24">
          <span class="detail-label">表单名称</span><span class="detail-content">{{ activeObject.name }}</span>
        </a-col>
        <a-col :lg="12" :md="24">
          <span class="detail-label">key</span><span class="detail-content">{{ activeObject.modelKey }}</span>
        </a-col>
        <a-col :lg="12" :md="24">
          <span class="detail-label">版本</span><span class="detail-content">{{ activeObject.version }}</span>
        </a-col>
        <a-col :span="24">
          <span class="detail-label">描述</span><span class="detail-content" style="height: auto;vertical-align: text-top;">{{ activeObject.description }}</span>
        </a-col>
        <a-col :span="24">
          <span class="detail-label">备注</span><span class="detail-content" style="height: auto;vertical-align: text-top;">{{ activeObject.modelComment }}</span>
        </a-col>
      </a-row>
      <a-divider orientation="left" v-if="activeObject">
        表单信息
      </a-divider>
      <view-form-design
        ref="vformDesign"
        :drawing-list="activeObject.drawingList"
        :drawing-button-list="activeObject.drawingButtonList"
        v-if="activeObject"
      />
      <a-divider orientation="left" v-if="activeObject">
        评论
      </a-divider>
      <a-col :span="24" v-if="activeObject" style="margin-bottom: 64px">
        <a-form-item
          label="备注"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 8 }">
          <a-textarea
            :rows="4"
            v-decorator="['modelComment',{rules:[]}]"
            placeholder="请输入备注"/>
        </a-form-item>
      </a-col>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button
        :style="{marginRight: '8px'}"
        @click="onClose"
      >
        返回
      </a-button>
      <a-button v-authorize:PROCESS_FORM_HISTORIES v-if="activeObject" @click="handleSubmit" type="primary" :loading="formLoading">设为新版本</a-button>
    </div>

  </a-drawer>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import { ViewFormDesign } from '@/components/Activiti/FormDesign'
import { formatDate } from '@/utils/common'

export default {
  name: 'FormHistory',
  components: { ACol, ViewFormDesign },
  props: {
    record: {
      type: Array,
      default: () => {
        return []
      }
    },
    refresh: {
      type: Function,
      default: undefined
    },
    rollback: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      formatDate: formatDate,
      visible: false,
      form: this.$form.createForm(this),
      formLoading: false,
      activeObject: undefined
    }
  },
  computed: {
    getOptions: function () {
      if (this.record && this.record instanceof Array) {
        return this.record.map(item => {
          return { label: `${item.version}-${this.formatDate(item.lastUpdated, 'YYYY/MM/DD HH:mm:ss')}`, value: item.id }
        })
      } else {
        return []
      }
    }
  },
  watch: {
    /* record (val) {
      if (this.record && this.record instanceof Array) {
        this.activeObject = this.record[0]
      }
    } */
  },
  methods: {
    /**
     * 切换选中记录
     * @param v
     */
    handleChange (v) {
      const selects = this.record.filter(i => {
        return i.id === v
      })
      if (selects && selects.length > 0) {
        this.activeObject = selects[0]
      }
    },
    show () {
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.formLoading = false
      this.form.resetFields()
      this.activeObject = undefined
    },
    handleSubmit () {
      this.formLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$refs.vformDesign.generatePicture(pic => {
            const designValue = { name: this.activeObject.name, modelKey: this.activeObject.modelKey, modelId: this.activeObject.modelId, id: this.activeObject.id, 'base64Thumbnail': pic, 'modelEditorJson': JSON.stringify([...this.activeObject.drawingList, ...this.activeObject.drawingButtonList]) }
            this.rollback(Object.assign({}, values, designValue)).then(res => {
              if (res.code === 10000) {
                this.$message.info(res.msg)
                this.refresh()
                this.onClose()
              }
            }).finally(() => {
              this.formLoading = false
            })
          })
        } else {
          setTimeout(() => {
            this.formLoading = false
          }, 1000)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
