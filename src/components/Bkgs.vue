<template>
  <div id="bkg" class="full-screen" :style="{backgroundImage: geturl}"></div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["bkg", "perbkg"],
  methods: {},
  computed: {
    geturl: function() {
      return 'url("./bkg/' + this.bkg + '.jpg")';
    }
  }
});
</script>
<style scoped lang="less">
</style>