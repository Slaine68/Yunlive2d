<template>
  <div id="controlGroup">
    <span
      @click="saveModel"
      v-show="func.indexOf('save')>-1"
      class="save"
    ></span>
    <span
      @click="$store.commit('switchSettView','load')"
      v-show="func.indexOf('load')>-1"
      class="load"
    ></span>
    <span @click="$emit('autojump')" v-show="func.indexOf('autojump')>-1" class="open"></span>
    <span @click="$emit('initGameByFirstCharp')" v-show="func.indexOf('relive')>-1" class="relive"></span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { States } from "../lappdefine";
export default Vue.extend({
  props: ["func","autoClick"],
  data() {
    return {
      c_loading: States.LOADING
    };
  },
  methods: {
    saveModel() {
      this.$store.commit('switchSettView','save');

    }
  }
});
</script>

<style scoped lang="less">
#controlGroup {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 101;
  span {
    width: 60px;
    line-height: 60px;
    text-align: center;
    position: relative;
    z-index: 1001;
    height: 70px;
    background-size: cover;
    display: inline-block;
  }
  .urls(@ur) {
    background-image: url("../../other/bt_@{ur}.png");
    &:hover {
      background-image: url("../../other/bt_@{ur}_cl.png");
    }
  }
  .save {
    .urls("save");
  }
  .load {
    .urls("load");
  }
  .open {
    .urls("open");
  }
  .relive {
    .urls("relive");
  }
}
</style>
