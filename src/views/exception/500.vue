<template>
  <a-result status="500" title="500" sub-title="对不起, 服务器暂时无法访问，请稍后再试.">
    <template #extra>
      <a-button type="primary" @click="toHome">
        回首页
      </a-button>
    </template>
  </a-result>
</template>

<script>
  export default {
    name: 'Exception500',
    methods: {
      toHome () {
        this.$router.push({ path: '/' })
      }
    }
  }
</script>
