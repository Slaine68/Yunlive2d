<template>
  <div>
    <div id="saveLoadMask" class="full-screen" @click="exit"></div>
    <transition name="slide-fade">
      <div id="saveLoadView" class="bright flex-col-center">
        <!-- 标题 -->
        <div class="tittle small-title-font">
          <div class="tittle-right">
            <span>第{{round}}周目</span>
            <span class="line"></span>
            <span class="small-number-font">2020/05/10 23:00</span>
            <span class="line"></span>
            <span>{{$store.getters.charTitle}}</span>
          </div>
        </div>
        <!-- 组件页 -->
        <div class="middleViews">
          <div class="middleLeftLists mouse-hover">
            <span
              :class="{'active':$store.getters.settViewFunc=='save'}"
              @click="$store.commit('setSettingViewFunc','save')"
            >存 档</span>
            <span
              :class="{'active':$store.getters.settViewFunc=='load'}"
              @click="$store.commit('setSettingViewFunc','load')"
            >读 档</span>
            <span
              :class="{'active':$store.getters.settViewFunc=='set'}"
              @click="$store.commit('setSettingViewFunc','set')"
            >设 置</span>
          </div>
          <keep-alive>
            <component
              class="middleRightComponent"
              :is="view"
              @saveUserData="saveUserData"
              @loadUserData="loadUserData"
              ref="saveblock"
            ></component>
          </keep-alive>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SaveView from "./SaveView.vue";
import SettingSubView from "./SettingSubView.vue";
import settingButton from "./SettingButton.vue";
import { States } from "../lappdefine";
export default Vue.extend({
  data() {
    return {
      page: this.$store.getters.getPage
    };
  },
  computed:{
    view(){
      return this.$store.getters.settViewFunc == 'set'? 'SettingSubView':'SaveView';
    }
  },
  mounted() {
    //音效
    let doc = document.getElementsByClassName("mouse-hover");
    for (let i = 0; i < doc.length; i++) {
      if (doc[i].childNodes.length > 0) {
        for (let index = 0; index < doc[i].childNodes.length; index++) {
          let node = doc[i].childNodes[index] as Element;
          node["onmouseenter"] = () => {
            this.$store.commit('playAudio',"yes");
          };
          node["onclick"] = () => {
            this.$store.commit('playAudio');
          };
        }
      }
    }
  },
  components: {
    SaveView,
    SettingSubView,
    settingButton
  },
  props: [ "round"],
  methods: {
    exit() {
      this.$store.commit("switchSettView");
    },
    saveUserData(val) {
      this.$emit("saveUserData", val);
    },
    loadUserData(val) {
      this.$emit("loadUserData", val);
    },
    refreshLoads() {
      this.$refs.saveblock.getAllUserSave();
    }
  }
});
</script>

<style scoped lang="less">
.dark {
  &#saveLoadView {
    background: repeating-linear-gradient(40deg, #ffffff05, transparent 10rem),
      repeating-linear-gradient(140deg, #ffffff08, transparent 10rem),
      linear-gradient(0deg, #292929, #0000007d, #292929);
    color: white;
  }
  .tittle {
    background: #0000008c;
  }
}
.bright {
  &#saveLoadView {
    background: repeating-linear-gradient(40deg, #19191905, transparent 10rem),
      repeating-linear-gradient(140deg, #13131308, transparent 10rem),
      linear-gradient(0deg, #fbf6ff, #ffffff7d, #e2edf1);
    color: #505050;
  }
  .tittle {
    background: #000000c7;
    color: white;
  }
}
.tittle {
  position: relative;
  width: 100%;
  top: 0px;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    50% 100%,
    calc(50% - 2rem) 50%,
    0 50%
  );
  line-height: 300%;
  text-align: right;
  box-sizing: border-box;
  .line {
    height: 50%;
    border-left: 1px solid #fff;
  }
  .tittle-right {
    display: flex;
    float: right;
    width: 50%;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
  }
}
#saveLoadMask {
  z-index: 1;
}
#saveLoadView {
  font-size: 0.8rem;
  z-index: 2;
  width: 80%;
  position: absolute;
  height: 80%;
  box-shadow: #ffffff14 5px 6px 0px 0px;
  //缺一角
  .sub-corner-right-bottom();
}
.middleViews {
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 0;
  width: 100%;
  padding-right: 3rem;
  padding-top: 2rem;
  padding-bottom: 4.2rem;
  box-sizing: border-box;
}
//左侧列表
.middleLeftLists {
  display: flex;
  text-align: center;
  padding-top: 2rem;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  //左侧列表块
  span {
    margin: 0.5rem;
    font-size: 0.6rem;
    line-height: 2rem;
    width: 60%;
    color: aliceblue;
    transition: background-color 0.25s;
    &.active,
    &:hover {
      position: relative;
      //玫红色
      background: linear-gradient(to left, #b3554b 4px, transparent 4px),
        repeating-linear-gradient(40deg, #00000024, transparent 4.5rem),
        repeating-linear-gradient(120deg, #ffffff2e, transparent 5rem),
        linear-gradient(90deg, #ff8080, #772f2c);
      text-shadow: 0px 1px 10px #8e0006;
      color: #efefef;
      //箭头
      &:after {
        content: "";
        background-color: #b3554b;
        display: block;
        clip-path: polygon(0 0, 100% 50%, 0 100%);
        position: absolute;
        /* z-index: -1; */
        right: -0.3rem;
        top: 0.7rem;
        width: 0.4rem;
        height: 0.6rem;
      }
      &:before {
        content: "";
        display: block;
        width: 0%;
        height: 100%;
        position: absolute;
        background: white;
        opacity: 0;
        -webkit-transition: 0.25s;
        transition: 0.25s;
        animation: chick 0.5s;
      }
    }
    text-shadow: 0px 1px 10px #ff3737;
    //黑色
    background: repeating-linear-gradient(30deg, #d8d8d81f, transparent 4rem),
      repeating-linear-gradient(150deg, #e2e2e212, transparent 4rem),
      linear-gradient(0deg, #131313, #000000c2);
    -webkit-transition: 0.25s;
    transition: 0.25s;
  }
}
.middleRightComponent {
  flex: 3;
}
#saveBody {
  span {
    display: inline-block;
    height: 5rem;
    width: 10rem;
    box-shadow: #ffffff66 3px 3px 0px 0px;
    margin: 1rem;
    //background-image: url("../../other/saveblock.png");
  }
}
#settingList {
  position: absolute;
  bottom: 0px;
}
// 手机
@media (max-width: 1000px) {
  .middleViews{
    padding-top: 1rem;
    padding-bottom: 2rem;
  }
}
</style>
