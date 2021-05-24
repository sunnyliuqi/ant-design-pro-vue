<template>
  <div ref="myIframe">
    <iframe :width="contentWidth" :height="contentHeight" style="border: medium none;" :src="url"/>
  </div>
</template>

<script>
  export default {
    name: 'MyIframe',
    props: {
      url: {
        Type: String,
        default: ''
      }
    },
    data () {
      return {
        contentWidth: 0,
        contentHeight: 0
      }
    },
    mounted () {
      this.synSize()
      window.onresize = () => {
        return (() => {
          this.synSize()
        })()
      }
    },
    methods: {
      synSize () {
        const { clientWidth } = this.$refs.myIframe
        this.contentWidth = clientWidth
        // const height = window.innerHeight - 56 - 64 - 170
        const height = window.innerHeight - 64 - 48
        this.contentHeight = height <= 300 ? 300 : height
      }
    }
  }
</script>

<style scoped>

</style>
