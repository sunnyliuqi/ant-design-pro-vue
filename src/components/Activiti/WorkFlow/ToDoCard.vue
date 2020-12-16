<template>
  <div>
    <a-card :loading="loading" size="small" :title="activiti.title" :bordered="true">
      <ul id="activiti">
        <li v-for="item in activiti.list" :key="item.url">
          {{ item.label }}：<router-link :to="item.url">{{ item.count }}</router-link>
        </li>
      </ul>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'ToDoCard',
  props: {
    activiti: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    closeLoading () {
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
