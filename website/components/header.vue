<template>
  <div class="headerWrapper">
    <div ref="header" class="header">
      <h1>
        <router-link :to="`/${ lang }`" class="nav-logo-box">
          <!-- logo -->
          <slot>
            <img
              src="https://github.com/wtgroup/yongheui/raw/dev/assets/1.jpg"
              alt="yongheui-logo"
              class="nav-logo"
            >
            <div class="nav-log-title">
              Yong He UI
            </div>
          </slot>
        </router-link>
      </h1>

      <!-- github -->
      <span id="github-btn" class="github-btn">
        <a href="//github.com/wtgroup/yongheui" target="_blank" class="gh-btn">
          <span aria-hidden="true" class="gh-ico"></span><span class="gh-text">Star</span>
        </a>
      </span> 
    </div>
  </div>
</template>
<script>
import AlgoliaSearch from './search.vue'
import { Language } from '../enums/language'
import compoLang from '../i18n/component.json'

const version = '1.0.0' // element version

export default {

  components: {
    AlgoliaSearch,
  },
  data() {
    return {
      active: '',
      versions: [],
      version,
      verDropdownVisible: true,
      langDropdownVisible: true,
      langs: {
        [Language.CN]: '中文',
        [Language.EN]: 'English',
        [Language.ES]: 'Español',
        [Language.FR]: 'Français',
        [Language.JP]: '日本語',
      },
    }
  },

  computed: {
    lang() {
      return this.$route.path.split('/')[1] || Language.CN
    },
    displayedLang() {
      return this.langs[this.lang] || '中文'
    },
    langConfig() {
      return compoLang.filter(config => config.lang === this.lang)[0]['header']
    },
    isComponentPage() {
      return /^component/.test(this.$route.name)
    },
  },
  created() {
    // const xhr = new XMLHttpRequest()
    // xhr.onreadystatechange = () => {
    //   if (xhr.readyState === 4 && xhr.status === 200) {
    //     const versions = JSON.parse(xhr.responseText)
    //     this.versions = Object.keys(versions).reduce((prev, next) => {
    //       prev[next] = versions[next]
    //       return prev
    //     }, {})
    //   }
    // }
    // xhr.open('GET', '/versions.json')
    // xhr.send()
  },
  methods: {
    switchVersion(version) {
      if (version === this.version) return
      location.href = `${ location.origin }/${ this.versions[version] }/${ location.hash } `
    },

    switchLang(targetLang) {
      if (this.lang === targetLang) return
      localStorage.setItem('ELEMENT_LANGUAGE', targetLang)
      this.$router.push(this.$route.path.replace(this.lang, targetLang))
    },

    handleVerDropdownToggle(visible) {
      this.verDropdownVisible = visible
    },

    handleLangDropdownToggle(visible) {
      this.langDropdownVisible = visible
    },
  },
}
</script>
<style lang="scss" scoped>
  $headerHeight: 40px;

  .headerWrapper {
    height: $headerHeight;
    background-image: url(https://github.com/wtgroup/yongheui/raw/dev/assets/1.jpg);
  }

  .header {
    height: $headerHeight;
    background-color: #fff;
    color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    line-height: $headerHeight;
    z-index: 100;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    // border-bottom: 1px solid #DCDFE6;
    box-shadow: 0 2px 8px #f0f1f2;

    #github-btn {
      display: flex;
      flex-flow: nowrap;
      height: auto;
      float: right;
      // margin-top: 20px;
      // margin-left: 16px;
      margin-right: 30px;
    }
    #github-btn .gh-btn {
      height: auto;
      padding: 1px 4px;
      background: transparent;
      border: 0;
    }
    #github-btn .gh-btn .gh-ico {
      width: 20px;
      height: 20px;
      margin: 0;
    }
    .gh-ico {
      width: 14px;
      height: 14px;
      margin-right: 4px;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMTIgMTIgNDAgNDAiPjxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0zMiAxMy40Yy0xMC41IDAtMTkgOC41LTE5IDE5IDAgOC40IDUuNSAxNS41IDEzIDE4IDEgLjIgMS4zLS40IDEuMy0uOXYtMy4yYy01LjMgMS4xLTYuNC0yLjYtNi40LTIuNi0uOS0yLjEtMi4xLTIuNy0yLjEtMi43LTEuNy0xLjIuMS0xLjEuMS0xLjEgMS45LjEgMi45IDIgMi45IDIgMS43IDIuOSA0LjUgMi4xIDUuNSAxLjYuMi0xLjIuNy0yLjEgMS4yLTIuNi00LjItLjUtOC43LTIuMS04LjctOS40IDAtMi4xLjctMy43IDItNS4xLS4yLS41LS44LTIuNC4yLTUgMCAwIDEuNi0uNSA1LjIgMiAxLjUtLjQgMy4xLS43IDQuOC0uNyAxLjYgMCAzLjMuMiA0LjcuNyAzLjYtMi40IDUuMi0yIDUuMi0yIDEgMi42LjQgNC42LjIgNSAxLjIgMS4zIDIgMyAyIDUuMSAwIDcuMy00LjUgOC45LTguNyA5LjQuNy42IDEuMyAxLjcgMS4zIDMuNXY1LjJjMCAuNS40IDEuMSAxLjMuOSA3LjUtMi42IDEzLTkuNyAxMy0xOC4xIDAtMTAuNS04LjUtMTktMTktMTl6Ii8+PC9zdmc+);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: inline-block;
    }

    .gh-btn, .gh-count {
      padding: 2px 5px 2px 4px;
      color: #333;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      border-radius: 3px;
    }
    #github-btn .gh-btn .gh-text {
      display: none;
    }

    // .container {
    //   height: 100%;
    //   box-sizing: border-box;
    //   border-bottom: 1px solid #DCDFE6;
    // }

    .nav-lang-spe {
      color: #888;
    }

    h1 {
      margin: 0;
      float: left;
      font-size: 32px;
      font-weight: normal;

      a {
        color: #333;
        text-decoration: none;
        display: block;
      }

      span {
        font-size: 12px;
        display: inline-block;
        width: 34px;
        height: 18px;
        border: 1px solid rgba(255, 255, 255, .5);
        text-align: center;
        line-height: 18px;
        vertical-align: middle;
        margin-left: 10px;
        border-radius: 3px;
      }
    }

    .nav {
      float: right;
      height: 100%;
      line-height: 80px;
      background: transparent;
      padding: 0;
      margin: 0;
      &::before, &::after {
        display: table;
        content: "";
      }
      &::after {
        clear: both;
      }
    }

    .nav-gap {
      position: relative;
      width: 1px;
      height: 80px;
      padding: 0 20px;

      &::before {
        content: '';
        position: absolute;
        top: calc(50% - 8px);
        width: 1px;
        height: 16px;
        background: #ebebeb;
      }
    }

    .nav-logo-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      .nav-log-title {
        font-size: 20px;
        margin-left: 6px;
        font-weight: 700;
        color: #92c8ff;
        font-family: fangsong;
      }
    }
    .nav-logo {
      height: $headerHeight;
    }
    .nav-logo,.nav-logo-small {
      vertical-align: sub;
    }

    .nav-logo-small {
      width: 44px;
      display: none;
    }

    .nav-item {
      margin: 0;
      float: left;
      list-style: none;
      position: relative;
      cursor: pointer;

      &.nav-algolia-search {
        cursor: default;
      }

      &.lang-item,
      &:last-child {
        cursor: default;
        margin-left: 34px;

        span {
          opacity: .8;
        }

        .nav-lang {
          cursor: pointer;
          display: inline-block;
          height: 100%;
          color: #888;

          &:hover {
            color: #409EFF;
          }
          &.active {
             font-weight: bold;
             color: #409EFF;
           }
        }
      }

      a {
        text-decoration: none;
        color: #1989FA;
        opacity: 0.5;
        display: block;
        padding: 0 22px;

        &.active,
        &:hover {
          opacity: 1;
        }

        &.active::after {
          content: '';
          display: inline-block;
          position: absolute;
          bottom: 0;
          left: calc(50% - 15px);
          width: 30px;
          height: 2px;
          background: #409EFF;
        }
      }
    }
  }

  .nav-dropdown {
    margin-bottom: 6px;
    padding-left: 18px;
    width: 100%;

    span {
      display: block;
      width: 100%;
      font-size: 16px;
      color: #888;
      line-height: 40px;
      transition: .2s;
      padding-bottom: 6px;
      user-select: none;

      &:hover {
         cursor: pointer;
       }
    }

    i {
      transition: .2s;
      font-size: 12px;
      color: #979797;
      transform: translateY(-2px);
    }

    .is-active {
      span, i {
        color: #409EFF;
      }
      i {
        transform: rotateZ(180deg) translateY(3px);
      }
    }

    &:hover {
      span, i {
        color: #409EFF;
      }
    }
  }

  .nav-dropdown-list {
    width: auto;
  }

  @media (max-width: 850px) {
    .header {
      .nav-logo {
        display: none;
      }
      .nav-logo-small {
        display: inline-block;
      }
      .nav-item {
        margin-left: 6px;

        &.lang-item,
        &:last-child {
          margin-left: 10px;
        }

        a {
          padding: 0 5px;
        }
      }
      .nav-theme-switch, .nav-algolia-search {
        display: none;
      }
    }
  }

  @media (max-width: 700px) {
    .header {
      .container {
        padding: 0 12px;
      }
      .nav-item {
        a {
          font-size: 12px;
          vertical-align: top;
        }

        &.lang-item {
          height: 100%;

          .nav-lang {
            display: flex;
            align-items: center;

            span {
              padding-bottom: 0;
            }
          }
        }
      }
      .nav-dropdown {
        padding: 0;
        span {
          font-size: 12px;
        }
      }
      .nav-gap {
        padding: 0 8px;
      }
      .nav-versions {
        display: none;
      }
    }
  }
</style>
