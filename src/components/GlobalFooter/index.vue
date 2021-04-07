<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="http://www.isimpo.com/" target="_blank">辛普科技</a>
    </template>
    <template v-slot:copyright>
      <a href="http://www.isimpo.com/" target="_blank">Copyright © 2021 simpo</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
