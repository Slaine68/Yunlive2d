<template>
  <div id="chooses">
    <div v-for="(choose,index) in orgchoose" @click="$emit('dochoose',index)" :key="choose">{{choose}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["orgchoose"]
});
</script>

<style scoped lang="less">
#chooses {
  width: 70%;
  max-width: 500px;
  z-index: 1000;
}

#chooses div {
  margin-bottom: 0.8rem;
  line-height: 2rem;
  text-align: center;
  background-image: url("../../other/bgline.png");
  background-size: 100% 100%;
}
</style>
