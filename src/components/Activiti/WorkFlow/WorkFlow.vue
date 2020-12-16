<template>
  <div>
    <slot>
      <a-row :gutter="16">
        <a-col :sm="8" :xs="12">
          <to-do-card
            ref="loadActiviti"
            :activiti="activiti" />
        </a-col>
      </a-row>
    </slot>
  </div>
</template>

<script>
import ToDoCard from './ToDoCard'
import { listTasksCurrentUser, listProcessInstancesCurrentUser } from '@/api/process/user'
export default {
  name: 'WorkFlow',
  components: {
    ToDoCard
  },
  props: {
    activiti: {
      type: Object,
      default: () => {
        return {
          'title': '与我相关',
          'list': [
          ]
        }
      }
    }
  },
  created () {
    this.refresh()
  },
  data () {
    return {
      instanceQueryParams: { 'state': 'running' },
      page: { 'size': 1, 'current': 1 },
      loadingComplete: 0
    }
  },
  methods: {
    cardComplete () {
      this.loadingComplete = this.loadingComplete + 1
      if (this.loadingComplete >= 2) {
        this.$refs.loadActiviti.closeLoading()
      }
    },
    refresh (queryParams) {
      listTasksCurrentUser(Object.assign({}, queryParams, this.page)).then(res => {
        if (res.code === 10000) {
          const task = { 'label': '待办任务', 'count': res.result.total, 'url': '/process/user/tasks' }
          this.activiti.list = { ...this.activiti.list, task }
          this.cardComplete()
        }
      })
      listProcessInstancesCurrentUser(Object.assign(this.instanceQueryParams, queryParams, this.page)).then(res => {
        if (res.code === 10000) {
          const instance = { 'label': '流程实例', 'count': res.result.total, 'url': '/process/user/processInstances' }
          this.activiti.list = { ...this.activiti.list, instance }
          this.cardComplete()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
