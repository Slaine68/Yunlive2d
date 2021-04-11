<template>
  <component
    :is="type"
    :text="text"
    :name="name"
    :opa="opacity"
    :font="font"
    :fontfamily="fontfamily"
    :anime="anime"
  ></component>
</template>

<script lang="ts">
import Vue from "vue";
import { States } from "../../lappdefine";
import DialogNormal from "./DialogNormal.vue";
import DialogMovie from "./DialogMovie.vue";
import DialogTop from "./DialogTop.vue";

export default Vue.extend({
  props: ["statu", "sence", "live2DManager"],
  components: {
    DialogNormal,
    DialogMovie,
    DialogTop,
  },
  data() {
    return {
      type: "",
      name: "",
      text: "",
      opacity: 1,
      font: 0.1,
      fontfamily: 0,
      anime: false,
    };
  },
  methods: {
    changeDialog() {
      this.changeStatu();
      return new Promise<void>((resolve) => {
        if (this.type != "DialogNormal") {
          //电影、旁白模式
          this.opacity = 0;
          setTimeout(() => {
            this.text = this.sence.getText();
            this.name = this.sence.getCharShow();
            this.opacity = 1;
            resolve();
          }, 500);
        } else {
          //正常对话模式
          if (this.name != this.sence.getCharShow()) {
            //如果换人了，给个动画
            this.anime = this.live2DManager.getActiveModelPosition();
            this.text = this.sence.getText();
            this.name = this.sence.getCharShow();
            setTimeout(() => {
              this.anime = "none";
            }, 500);
          } else {
            this.text = this.sence.getText();
            this.name = this.sence.getCharShow();
          }
          setTimeout(() => {
            resolve();
          }, 200);
        }
      });
    },
    changeStatu() {
      if (this.statu == States.MOVIE || this.statu == States.MOVIEPRO) {
        this.type = "DialogMovie";
      } else if (this.sence.getCharOrigin() == "") {
        this.type = "DialogTop";
      } else if (this.sence.getCharOrigin()) {
        this.type = "DialogNormal";
      }
    },
  },
});
</script>

<style scoped lang = 'less'>
</style>