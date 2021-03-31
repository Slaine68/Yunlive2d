<template>
  <div :class="{buttonBkg:true, buttonBkgOpen:checker}" @click="callback">
    <span :class="{buttonInner:true, buttonInnerOpen:checker}" ></span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["state","callback"],
  data() {
    return {
      checker: this.state
    };
  },
  watch: {
    state(val, old) {
      this.checker = val;
    }
  }
});
</script>

<style scoped lang="less">
.buttonBkg{
  display: inline-block;
  width: 2.3rem;
  height: 1.2rem;
  position: relative;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  margin: 0px 20px;
  box-sizing: border-box;
  background: #5c5c60;
}
.buttonBkgOpen{
  background: #e2e2e2;
}

.buttonInner {
  display: inline-block;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1.3rem;
  height: 1.2rem;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  cursor: pointer;
  background: #ddd;
}

.buttonInnerOpen{
  left: 1rem;
  background: #fff;
}
</style>
