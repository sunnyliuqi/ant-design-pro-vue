<template>
  <div>
    <a-card :loading="loading" size="small" :title="activiti.title" :bordered="true">
      <ul id="activiti" v-if="listData">
        <li v-for="item in listData" :key="item.url">
          {{ item.label }}：<router-link :to="item.url">{{ item.count }}</router-link>
        </li>
      </ul>
      <empty v-else />
    </a-card>
  </div>
</template>

<script>
  import _ from 'lodash'
  import { Empty } from 'ant-design-vue'
export default {
  name: 'ToDoCard',
  components: {
    Empty
  },
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
  computed: {
      listData () {
        if (this.activiti.list && this.activiti.list.length > 0) {
          return _.sortBy(this.activiti.list, ['sort'])
        }
        return undefined
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
