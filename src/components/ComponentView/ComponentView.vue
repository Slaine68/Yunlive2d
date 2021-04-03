<template>
  <div class="full-screen">
    <!-- 最上方快捷窄条 -->
    <quick-bar
      :content="quickbarData"
      :autotimer="autoTimer"
      ref="quickbar"
    ></quick-bar>
    <!--帮助：ｈ-->
    <Helper v-show="isCompsOpen && isHelpShow"/>
  </div>
</template>

<script>
import QuickBar from "./QuickBar.vue";
import Helper from "./Helper.vue";
export default {
  data() {
    return {
      isCompsOpen: false,
      whoOpen: "help",
    };
  },
  components: {
    QuickBar,
    Helper
  },
  props: {
    autoClick:{
        type:Boolean,
        default:false
    },
    autoTimer:{
        type:Number
    }
  },
  computed: {
    isHelpShow() {
      return this.whoOpen === "help";
    },
    quickbarData() {
      return [
        { name: "章节名", type: "text", vars: this.$store.getters.charTitle },
        {
          name: "存档（S）",
          type: "active",
          vars: this.$store.getters.settViewFunc == "save" && this.$store.getters.isSettingActive,
          callback: ()=>{
            this.$store.commit("switchSettView", "save");
          },
        },
        {
          name: "读档（L）",
          type: "active",
          vars: this.$store.getters.settViewFunc == "load" && this.$store.getters.isSettingActive,
          callback: ()=>{
            this.$store.commit("switchSettView", "load");
          },
        },{
          name: "设置",
          type: "active",
          vars: this.$store.getters.settViewFunc == "set" && this.$store.getters.isSettingActive,
          callback: ()=>{
            this.$store.commit("switchSettView", "set");
          },
        },
        {
          name: "自动阅读（A）",
          type: "active",
          vars: this.autoClick,
          callback: () => {
              this.$emit('autoClickDo',!this.autoClick)
          },
        },
        {
          name: "帮助（H）",
          type: "active",
          vars: this.isCompsOpen && this.isHelpShow,
          callback: this.switchCompsOpen,
        },
      ];
    },
  },
  methods: {
    switchCompsOpen() {
      this.isCompsOpen = !this.isCompsOpen;
    },
    activeAnime(){
        this.$refs.quickbar.activeanime();
    },
    stopAnime(){
        this.$refs.quickbar.stopanime();
    }
  },
};
</script>

<style scoped lang="less">

</style>