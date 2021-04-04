<template>
  <div id="movieDialog" class="dialog flex-col-center moviefont" :class="getcolor">
    <span :style="{opacity:opa}">{{text}}</span>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["text", "name", "opa"],
  computed: {
    getcolor: function() {
      return "outline_" + this.$store.getters.charactorColor[this.name]; //this.name;
    }
  }
});
</script>
<style scoped lang="less">
#movieDialog {
  position: absolute;
  bottom: 0;
  height: 4.6rem;
  padding: 1rem 15%;
  background: linear-gradient(0deg, #131313, #00000000);
  font-size: 1.6rem;
  span {
    transition: opacity 0.5s ease;
  }
}
.outline(@name,@color){
  .outline_@{name}{
  text-shadow: @color 1px 0 5px, @color 0 1px 5px, @color -1px 0 5px,@color 0 -1px 5px;
  }
}
.outline(green,@green);
.outline(blue,@blue);
.outline(yellow,@yellow);
.outline(gold,@gold);
.outline(pink,@pink);
.outline(black,@black);
.outline(brown,@brown);
.outline(red,@red);
</style>