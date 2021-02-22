<template>
  <div id="app" :class="{ 'is-component': isComponent }">
<!--    <main-header v-if="lang !== 'play'" />-->
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
.main-cnt {
  height: 100%;
  overflow: auto;
}
</style>
