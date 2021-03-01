<template>
  <a-card :bordered="false">
    <bpmn-design
      :form-lists="formLists"
      :user-lists="userLists"
      :group-lists="groupLists"
      v-model="xml"
      :model-key="modelKey"
      :model-name="modelName"
      :description="description"
    />
  </a-card>
</template>

<script>
  import BpmnDesign from '@/components/Activiti/Bpmn/BpmnDesign'
  import { list } from '@/api/process/form'
  import { users, groups } from '@/api/process/model'
export default {
  name: 'Model',
  components: { BpmnDesign },
  data () {
    return {
      formLists: [],
      userLists: [],
      groupLists: [],
      xml: undefined,
      modelKey: undefined,
      modelName: undefined,
      description: undefined
    }
  },
  created () {
    list({}).then((res) => {
      if (res.code === 10000) {
        const result = res.result
        if (result && result.length && result.length > 0) {
           result.forEach(item => {
             this.formLists.push({ label: `${item.name}`, value: `${item.modelKey}` })
          })
        }
      }
    })
    users().then((res) => {
      if (res.code === 10000) {
        const result = res.result
        if (result && result.length && result.length > 0) {
          result.forEach(item => {
            this.userLists.push({ label: `${item.id}`, value: `${item.id}` })
          })
        }
      }
    })
    groups().then((res) => {
      if (res.code === 10000) {
        const result = res.result
        if (result && result.length && result.length > 0) {
          result.forEach(item => {
            this.groupLists.push({ label: `${item.name}`, value: `${item.id}` })
          })
        }
      }
    })
  }
}
</script>

<style scoped>

</style>
