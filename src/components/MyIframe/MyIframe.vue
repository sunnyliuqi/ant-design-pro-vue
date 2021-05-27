<template>
  <div ref="myIframe">
    <iframe :width="contentWidth" :height="contentHeight" style="border: medium none;" :src="url"/>
  </div>
</template>

<script>
  import { findProxyUrl } from '@/api/report/load'
  import { service } from '@/api/service'
  export default {
    name: 'MyIframe',
    props: {
    },
    data () {
      return {
        contentWidth: 0,
        contentHeight: 0,
        url: ''
      }
    },
    created () {
      this.loadUrl()
      this.$watch('$route', (val) => {
        this.loadUrl()
      })
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
      /**
       * 加载url
       */
      loadUrl () {
        const route = this.$route
        findProxyUrl({ url: route.path }).then((res) => {
          if (res.code === 10000) {
            if (res.result && (res.result.indexOf('http://') === 0 || res.result.indexOf('https://') === 0)) {
              this.url = res.result
            } else {
            this.url = service.report + res.result
            }
          }
        })
      },
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
