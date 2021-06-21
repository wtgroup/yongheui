<template>
  <div id="app" class="app-box" :class="{ 'is-component': isComponent }">
    <main-header />
    <div class="main-cnt">
      <router-view />
      <!--<SqHello />-->
    </div>
<!--    <main-footer v-if="lang !== 'play' && !isComponent" />-->
  </div>
</template>

<script>


export default {
  name: 'App',

  computed: {
    isComponent() {
      return /^component-/.test(this.$route.name || '')
    },
  },

  watch: {

  },

  mounted() {

  },

  methods: {

  },
}
</script>
<style>
.app-box {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.main-cnt {
  height: 100%;
  overflow: auto;
}
</style>
