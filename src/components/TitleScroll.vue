<template>
  <div class="titleScrollBack flex-col-center litter-font">
    <div :class="{'scrollBody':true,'shadow':present>=100}">
      <div class="scrollColorBack full-screen"></div>
      <div class="scrollColor full-screen" :style="{clipPath:getPolygon}"></div>
      <!-- <span class="scrollHead"></span> -->
    </div>
    <span :class="{'scrollText':true,'shadow':present>=100}">{{present}}%</span>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["present"],
  methods: {},
  computed: {
    getPolygon: function() {
      return `polygon(${this.present}% 0%, ${this.present}% 100%, 0 100%, 0 0)`;
    }
  }
});
</script>
<style scoped lang="less">
.titleScrollBack {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 4rem;
  background: #00000050;
  z-index: 9999;
}
.scrollBody {
  height: 4px;
  width: 33rem;
  position: relative;
  transition: all 1s ease;
  &.shadow {
    box-shadow: #8fffea6b 0px 0px 12px 1px;
  }
}
.scrollText {
  transition: all 1s ease;
  line-height: 1.5rem;
  .shadow {
    text-shadow: #8fffea85 0px 0px 12px 1px;
  }
}
.scrollColor {
  background: linear-gradient(90deg, #399471, #3b6b86, #533f5a);
  transition: all 0.5s ease;
}
.scrollColorBack {
  background: #ffffff20;
}
.scrollHead {
  height: 1rem;
  background: #4c0e0b;
  float: right;
  width: 0.5rem;
}
@media (min-width: 1401px) {
  .titleScrollBack {
    width: 65%;
    max-width: 1000px;
  }
}
</style>