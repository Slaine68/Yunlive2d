<template>
  <div class="full-screen">
    <!-- 最上方快捷窄条 -->
    <quick-bar
      :content="quickbarData"
      :autotimer="autoTimer"
      ref="quickbar"
    ></quick-bar>
    <!--帮助：ｈ-->
    <div v-show="isCompsOpen && isHelpShow" id="helpBlock">
      <table cellspacing="10" style="width: 100%">
        <tr>
          <td>A</td>
          <td>开始/停止自动翻页</td>
          <td>↑↓</td>
          <td>自动翻页速度</td>
        </tr>
        <tr>
          <td>Q</td>
          <td>快速跳跃至下一处</td>
          <td>P</td>
          <td>跳跃回到上一处</td>
        </tr>
        <tr>
          <td>S</td>
          <td>存档</td>
          <td>L</td>
          <td>读档</td>
        </tr>
        <tr>
          <td>M</td>
          <td>音乐开启关闭</td>
          <td>N</td>
          <td>语音开启关闭</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import QuickBar from "./QuickBar.vue";
export default {
  data() {
    return {
      isCompsOpen: false,
      whoOpen: "help",
    };
  },
  components: {
    QuickBar,
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
          name: "自动阅读",
          type: "active",
          vars: this.autoClick,
          callback: () => {
              this.$emit('autoClickDo',!this.autoClick)
          },
        },
        {
          name: "帮助（H）",
          type: "active",
          vars: this.isHelpShow,
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
    }
  },
};
</script>

<style scoped lang="less">
#helpBlock{
  position: absolute;
  top:2rem;
  left: 0;
  right: 0;
  width:calc(100% - 4rem);
  margin: auto;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  color:white;
  z-index: 1000;
  padding: 2rem 4rem;
  box-sizing: border-box;
  td:nth-child(odd){
    width: 4rem;
  }
  td:nth-child(even){
    width: calc(50% - 4rem);
  }
}
</style>