<template>
  <!--
  <el-scrollbar ref="componentScrollBar" class="page-component__scroll">
    <div class="page-container page-component">
      <el-scrollbar class="page-component__nav">
        <side-nav :data="navsData[lang]" :base="`/${ lang }/component`" />
      </el-scrollbar>
      <div class="page-component__content">
        <div class="content-wrap">
          <router-view class="content" />
        </div>
        <footer-nav />
      </div>
      <el-backtop
        v-if="showBackToTop"
        target=".page-component__scroll .el-scrollbar__wrap"
        :right="100"
        :bottom="150"
      />
    </div>
  </el-scrollbar>-->

  <el-container class="page-component">
    <el-aside class="page-component__menu" width="200px">
      <side-nav :data="navsData[lang]" :base="`/${ lang }/component`"/>
    </el-aside>
    <el-main>
      <div class="page-component__content">
        <div class="content-wrap">
          <router-view class="content"/>
        </div>
      </div>
    </el-main>
  </el-container>


</template>
<script>
import bus from '../bus'
import navsData from '../nav.config.json'
import { throttle } from 'throttle-debounce'

export default {
  data() {
    return {
      lang: this.$route.meta.lang,
      navsData,
      scrollTop: 0,
      showHeader: true,
      componentScrollBar: null,
      componentScrollBoxElement: null,
    }
  },
  computed: {
    showBackToTop() {
      return !this.$route.path.match(/backtop/)
    },
  },
  watch: {
    '$route.path'() {
      // // 触发伪滚动条更新
      // this.componentScrollBox.scrollTop = 0
      // this.$nextTick(() => {
      //   this.componentScrollBar.update()
      // })
    },
  },
  created() {
    bus.$on('nav-fade', val => {
      this.navFaded = val
    })
  },
  mounted() {
    // this.componentScrollBar = this.$refs.componentScrollBar
    // this.componentScrollBox = this.componentScrollBar.$el.querySelector('.el-scrollbar__wrap')
    // this.throttledScrollHandler = throttle(300, this.handleScroll)
    // this.componentScrollBox.addEventListener('scroll', this.throttledScrollHandler)
    document.body.classList.add('is-component')
    this.addContentObserver()
  },
  unmounted() {
    document.body.classList.remove('is-component')
  },
  beforeUnmount() {
    this.componentScrollBox.removeEventListener('scroll', this.throttledScrollHandler)
    this.observer.disconnect()
    this.headerAnchorObserver.disconnect()
  },
  methods: {
    addContentObserver() {
      this.observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            this.renderAnchorHref()
            this.goAnchor()
          }
        }
      })
      this.observer.observe(
        document.querySelector('.content-wrap'),
        { childList: true },
      )

      // 标题前图标隐藏显示 START
      this.headerAnchorObserver = new MutationObserver((mutationsList, observer) => {
        // 新换了一批 header-anchor , 再次绑定事件
        const headerAnchors = document.getElementsByClassName('header-anchor');
        for (let i = 0; i < headerAnchors.length; i++) {
          let elem = headerAnchors[i];
          const p = elem.parentNode;
          if (p) {
            p.onmouseover = function () {
              elem.style.opacity = 1;
            };
            p.onmouseout = function () {
              elem.style.opacity = 0;
            };
          }
        }
      })
      this.headerAnchorObserver.observe(
        // 监听 content-wrap 下 dom 的变化
        document.querySelector('.content-wrap'),
        {childList: true},
      )
      // 标题前图标隐藏显示 END
    },
    renderAnchorHref() {
      if (/changelog/g.test(location.href)) return
      const anchors = document.querySelectorAll('h2 a,h3 a,h4 a,h5 a')
      const basePath = location.href.split('#').splice(0, 2).join('#');

      [].slice.call(anchors).forEach(a => {
        const href = a.getAttribute('href')
        if (href.indexOf('#') === 0) {
          a.href = basePath + href
        }
      })
    },

    goAnchor() {
      if (location.href.match(/#/g).length > 1) {
        const anchor = location.href.match(/#[^#]+$/g)
        if (!anchor) return
        const elm = document.querySelector(anchor[0])
        if (!elm) return

        setTimeout(() => {
          this.componentScrollBox.scrollTop = elm.offsetTop
        }, 50)
      }
    },

    handleScroll() {
      const scrollTop = this.componentScrollBox.scrollTop
      if (this.showHeader !== this.scrollTop > scrollTop) {
        this.showHeader = this.scrollTop > scrollTop
      }
      if (scrollTop === 0) {
        this.showHeader = true
      }
      if (!this.navFaded) {
        bus.$emit('fade-nav')
      }
      this.scrollTop = scrollTop
    },
  },
}
</script>
<style>
/*标题前图标隐藏显示 (scoped 无效)*/
.page-component .header-anchor {
  opacity: 0;
  float: left;
  margin-left: -20px;
  opacity: 0;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.page-component {
  width: 1200px;
  margin: 0 auto;
}

.page-component__menu {
  width: 200px;
  height: 400px;
  overflow-y: scroll;
}
.el-container {
  display: flex;
}
.el-main {
  padding: 10px 40px;
  width: 100%;
}

.page-component__scroll {
  height: calc(100% - 80px);
  margin-top: 80px;

  ::v-deep( > .el-scrollbar__wrap) {
    overflow-x: auto;
  }
}



@media (max-width: 768px) {
  .page-component {
    .page-component__nav {
      width: 100%;
      position: static;
      margin-top: 0;
    }
    .side-nav {
      padding-top: 0;
      padding-left: 50px;
    }
    .page-component__content {
      padding-left: 10px;
      padding-right: 10px;
    }
    .content {
      padding-top: 0;
    }
    .content > table {
      overflow: auto;
      display: block;
    }
  }
}
</style>
