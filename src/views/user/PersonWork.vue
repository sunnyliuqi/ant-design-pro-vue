<template>
  <a-card :bordered="false">
    <work-flow />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import WorkFlow from '@/components/Activiti/WorkFlow'
export default {
  name: 'PersonWorkFlow',
  components: {
    STable,
    WorkFlow
  }
}
</script>

<style scoped>

</style>
