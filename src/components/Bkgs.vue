<template>
  <span class="full-screen" id="bkg">
    <div key="bkg2" class="full-screen" :style="{ backgroundImage: geturl2 }"></div>
    <transition name="component-fade" mode="out-in">
      <div v-show="firstActive" key="bkg1" class="full-screen" :style="{ backgroundImage: geturl }"></div>
    </transition>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    bkg: {
      type: String,
      default: "sky",
    },
  },
  data(){
    return {
      firstActive: true,
      firtsBkg:'',
      seconBkg:''
    }
  },
  mounted(){
    this.firtsBkg = this.bkg
  },
  watch:{
    bkg(n){
      if(this.firstActive){
        this.seconBkg = n;
      }
      else this.firtsBkg = n;
      this.firstActive = !this.firstActive;
    }
  },
  computed: {
    geturl: function () {
      return `url("./Resources/${this.$store.getters.gameName}/bkg/${this.firtsBkg}.jpg")`;
    },
    geturl2: function () {
      return `url("./Resources/${this.$store.getters.gameName}/bkg/${this.seconBkg}.jpg")`;
    },
  },
});
</script>
<style scoped lang="less">
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .8s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>