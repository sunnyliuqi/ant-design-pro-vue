<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <background />
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <!--<img src="~@/assets/logo.svg" class="logo" alt="logo">-->
            <span class="title">Simpo</span>
          </a>
        </div>
        <!--<div class="desc">
          Simpo
        </div>-->
      </div>

      <router-view />

      <div class="footer">
        <div class="links">
          <!--<a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>-->
        </div>
        <div class="copyright">
          Copyright &copy; 2021 辛普科技
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'
import Background from '@/components/Background'
export default {
  name: 'UserLayout',
  components: { Background },
  mixins: [deviceMixin],
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }
    height: 100%;
    .container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }
      .title{
        font-size: 33px;
        color: white;
        font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
      }
      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          font-size: 14px;
        }
      }
    }
  }
</style>
