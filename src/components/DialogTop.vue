<template>
  <div id="topDialog" class="dialog" :style="{opacity:opa}" v-html="text"></div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["text","opa"]
});
</script>
<style scoped lang="less">
</style>