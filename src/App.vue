<template>
  <div
    id="mainblock"
    class="flex-col-center"
    :style="{
      width: width + 'px',
      height: height + 'px',
      fontFamily: 'settingfont',
    }"
  >
    <!-- 存档视图 1001 -->
    <transition :name="$store.getters.isFlower?'slide-fade':''">
      <SettingView
        v-show="$store.getters.isSettingActive"
        @setStatus="setStatus"
        @playAudio="playAudio"
        @saveUserData="saveUserData"
        @loadUserData="loadUserData"
        class="full-screen flex-col-center"
        style="z-index: 9"
        :title="sence.title"
        :round="dyn_data.emotions['周目']"
        ref="settingView"
      ></SettingView>
    </transition>
    <!-- 组件视图 1 -->
    <ComponentView
    ref="compview"
    :autoClick="autoClick"
    :autoTimer="autoTimer"
    @autoClickDo="autoClickDo"
    />
    <!-- 主视图 0 -->
    <div
      id="viewBlock"
      class="full-screen flex-col-center"
      @click="onTap"
      :class="{ blur: $store.getters.isSettingActive && $store.getters.isFlower}"
    >
      <audio
        id = 'music'
        ref="music"
        loop
        :src="'./music/' + dyn_data.music + '.mp3'"
        preload="auto"
      >
        主音乐
      </audio>
      <audio id = 'audio' ref="audio" :src="'./audio/' + audio + '.wav'" preload="auto">
        音效
      </audio>
      <audio id = "voical" ref="speak" :src="'./speak/' + speak + '.wav'" preload="auto">
        语音
      </audio>
      <!-- 选择框 1000,一直显示 -->
      <Chooses :orgchoose="choose" @dochoose="dochoose"></Chooses>
      <!-- 控制按钮 101-->
      <ControlGroup
        v-show="statu != States.MOVIE"
        :func="controlFunc"
        :autoClick="autoClick"
        @setStatus="setStatus"
        @initGameByFirstCharp="initGameByFirstCharp"
      ></ControlGroup>
      <!-- 遮罩 100-->
      <div
        id="mask"
        class="full-screen flex-col-center"
        :style="{ opacity: mask.opa, backgroundColor: mask.color }"
      >
        <transition name="slidey50">
          <div id="titleBlock" v-show="mask.showtitle">
            <span v-html="mask.title"></span>
          </div>
        </transition>
        <transition name="slidex30">
          <TitleScroll
            :present="$store.getters.getPresent"
            v-show="$store.getters.getPresent < 100 || mask.showtitle"
          ></TitleScroll>
        </transition>
      </div>
      <!-- 对话框 99 -->
      <component
        :is="dialog.type"
        :text="dialog.text"
        :name="dialog.name"
        :opa="dialog.opacity"
        :font="dialog.font"
        :fontfamily="dialog.fontfamily"
        :anime="dialog.anime"
      ></component>
      <!-- 角色图像 1 -->
      <canvas
        id="maincanvas"
        v-show="statu != States.MOVIE"
        :width="width"
        :height="height"
        :style="{ opacity: canvas.opacity, zIndex: 1, filter: getFilterValue }"
        :class="['bechanges', filter.animation]"
      ></canvas>
      <!-- 背景 0 -->
      <Bkg
        id="bkg"
        :class="['bechanges', filter.animation]"
        :style="{ filter: getFilterValue }"
        :bkg="dyn_data.bkg"
        :perbkg="dyn_data.bkg"
      ></Bkg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DialogMovie from "./components/DialogMovie.vue";
import DialogTop from "./components/DialogTop.vue";
import DialogNormal from "./components/DialogNormal.vue";
import SettingView from "./components/SettingView.vue";
import TitleScroll from "./components/TitleScroll.vue";
import ComponentView from "./components/ComponentView.vue";
import Bkg from "./components/Bkgs.vue";
import Chooses from "./components/Chooses.vue";
import ControlGroup from "./components/ControlGroup.vue";
import { LAppDelegate } from "./lappdelegate";
import { LAppLive2DManager } from "./lapplive2dmanager";
import { ajax } from "./ajax";
import html2canvas from "html2canvas";
import {
  gameSetting,
  charaDefaultPosition,
  gameEmotion,
  States,
  DELAY_TIME,
  StatesDeal,
  phpPath,
  DebugLogEnable,
} from "./lappdefine";
import { Sence } from "./Sence";

//存档数据结构
interface SaveData {
  chapterName: string;
  chapter: string;
  nowi: number;
  position: number;
  other: string;
  canvas: string;
}

export default Vue.extend({
  data() {
    return {
      // 对话
      dialog: {
        type: "",
        name: "",
        text: "",
        opacity: 1,
        font: 0,
        fontfamily: 0,
        anime: false,
      },
      canvas: {
        opacity: 1,
      },
      mask: {
        opa: 0,
        color: "black",
        title: "",
        showtitle: false,
      },
      //存档内动态数据
      dyn_data: {
        music: "",
        bkg: "",
        charStatus: {},
        emotions: {},
        nowCha: "",
        tmpChoose: -1,
        old: 0,
      },
      //运行时滤镜/动画等数据
      filter: {
        animation: "",
        blur: "0",
      },
      controlFunc: ["save", "load", "relive", "auto"], //"autojump", "relive"
      //点击互斥量
      click: true,
      autoClick: false,
      autoClkSettimeFuncr: null,
      autoTimer:0,
      //
      statu: States.NORMAL,
      isHelpShow: false,
      showSaveView: "",
      audio: "",
      speak: "",
      choose: [],
      //章节场景实例
      sence: new Sence(gameSetting.startChap),
      //高和宽
      width: 1920,
      height: 1080,
      States: States,
    };
  },
  //   初始化
  mounted() {
    if (LAppDelegate.getInstance().initialize() == false) {
      return;
    }
    LAppDelegate.getInstance().run();

    //绑定resize重绘
    this.changeWH(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      1.77
    );
    window.addEventListener("resize", () => {
      this.changeWH(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        1.77
      );
    });
    this.$refs.music.volume = 0.5;
    //绑定全局键盘监听
    document.onkeydown = (e) => {
      if (e.keyCode == 32 || e.keyCode == 13) {
        this.onTap();
      } else if (e.keyCode == 38) {
        //↑字体放大
        this.dialog.font += 0.1;
      } else if (e.keyCode == 39) {
        //→字体family
        if (this.dialog.fontfamily++ > 6) {
          this.dialog.fontfamily = 0;
        }
      } else if (e.keyCode == 40) {
        //↓字体缩小
        this.dialog.font -= 0.1;
      } else if (e.keyCode == 65) {
        //a，auto自动
        this.autoClickDo(!this.autoClick);
      } else if (e.keyCode == 72) {
        //h，帮助
        if(this.statu == States.NORMAL && this.$store.getters.isSettingActive){
          this.isHelpShow = !this.isHelpShow;
        }
        else this.isHelpShow = false;
      } else if (e.keyCode == 77) {
        //m，音乐
        this.$store.commit("musicPlay", !this.$store.getters.isMusicPlay);
      } else if (e.keyCode == 83) {
        //s，save
        this.$store.commit("settingViewOpenClose", "save");
      } else if (e.keyCode == 76) {
        //l，load
        this.$store.commit("settingViewOpenClose", "load");
      } else if (e.keyCode == 81) {
        //q，快速跳过
        this.quickTap();
      } else if (e.keyCode == 80) {
        //p，向前倒退
        this.quickReTap();
      }
    };

    if (DebugLogEnable) {
      this.handleMessage({ data: { user: "yunming" } });
    } else {
      window.addEventListener("message", this.handleMessage);
    }
    //this.iframeWin = this.$refs.iframe.contentWindow;

  },
  //计算组件
  computed: {
    getFilterValue: function () {
      let val = `blur(${this.filter.blur}px) sepia(${this.dyn_data.old})`;
      return val;
    },
    // ComponentViewData(){
    //   return [
    //     {name:'章节名',type:'text',vars:this.$store.getters.charTitle},
    //     {name:'自动阅读',type:'active',vars:this.autoClick},
    //     {name:'帮助（H）',type:'active',vars:this.isHelpShow,callback:()=>{
    //       this.isHelpShow = !this.isHelpShow;
    //     }},
        
    //   ]
    // }
  },
  //组件
  components: {
    DialogMovie,
    DialogTop,
    DialogNormal,
    Bkg,
    Chooses,
    SettingView,
    ControlGroup,
    TitleScroll,
    ComponentView,
  },
  //方法
  methods: {
    //点击处理逻辑
    onTap() {
      if (this.$store.getters.isSettingActive) {
        return false;
      }
      const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
      //当前状态是否被允许点击
      if (!StatesDeal.clickable.includes(this.statu)) {
        return false;
      }
      //互斥量存在
      if (this.click) {
        this.click = false;
        //执行code，再切换立绘等
        this.dealAllCode(this.sence.getCode())
          .then((delay: number) => {
            //更换模型

            this.changeModel(this.sence.getCharOrigin(), this.sence.getFace());
            //更换音乐
            if (this.sence.getMus()) {
              this.dyn_data.music = this.sence.getMus();
              //为啥必须有个延迟才能播放？？？？
              if (this.$store.getters.isMusicPlay) {
                setTimeout(() => {
                  this.$refs.music.play();
                }, 100);
              } else {
                this.$refs.music.pause();
              }
            }
            //更换背景
            if (this.sence.getBkg()) {
              this.dyn_data.bkg = this.sence.getBkg();
            }
            //更换dialog
            if (this.statu == States.MOVIE || this.statu == States.MOVIEPRO) {
              this.dialog.type = "DialogMovie";
            } else if (this.sence.getCharOrigin() == "") {
              this.dialog.type = "DialogTop";
            } else if (this.sence.getCharOrigin()) {
              this.dialog.type = "DialogNormal";
            }

            //更换文字
            new Promise((resolve) => {
              //有语音播放语音
              if(this.$store.getters.isVoicalPlay){
                this.speak = this.sence.getCharSpeaks();
                this.$refs.speak.load();
                setTimeout(() => {
                  this.$refs.speak.play();
                }, 100);
              }
              //电影、旁白模式
              if (this.dialog.type != "DialogNormal") {
                this.dialog.opacity = 0;
                setTimeout(() => {
                  this.dialog.text = this.sence.getText();
                  this.dialog.name = this.sence.getCharShow();
                  this.dialog.opacity = 1;
                  resolve();
                }, 500);
                //正常对话模式
              } else {
                if (
                  this.sence.getCharShow() == "" ||
                  typeof this.sence.getCharReal() == "undefined"
                ) {
                  live2DManager.clearActiveModel();
                }
                if (this.dialog.name != this.sence.getCharShow()) {
                  //如果换人了，给个动画
                  this.dialog.text = this.sence.getText();
                  this.dialog.name = this.sence.getCharShow();
                  this.dialog.anime = live2DManager.getActiveModelPosition();
                  setTimeout(() => {
                    this.dialog.anime = "none";
                  }, 500);
                } else {
                  this.dialog.text = this.sence.getText();
                  this.dialog.name = this.sence.getCharShow();
                }
                setTimeout(() => {
                  resolve();
                }, 200);
              }
            })
              //nowi++
              .then(() => {
                this.sence.setNowiAdd();
                setTimeout(() => {
                  this.click = true;
                }, delay);
              });
          })
          .catch((param?: string) => {
            this.click = true;
            if (param == "tap") {
              this.onTap();
            } else console.log("错误：" + param);
          });
      }
    },
    quickTap() {
      //只执行位置控制、reset、change old、movie，到choose停下
      let num = this.sence
        .getAutoFlag()
        .find((number) => number > this.sence.nowi);
      const waitArr = [
        "left",
        "right",
        "middle",
        "reset",
        "change old",
        "change !old",
        "movie",
        "moviepro",
      ];
      const breakArr = "choose";
      if (num) {
        for (; this.sence.nowi < num; this.sence.setNowiAdd()) {
          let codes = this.sence.getCode();
          if (codes) {
            if (codes.some((code) => code.includes(breakArr))) break;
            let dealCode = codes.filter((code) =>
              waitArr.some((word) => code.includes(word))
            );
            if (dealCode.length) {
              this.dealAllCode(dealCode);
            }
          }
        }
        this.sence.findPreBkg();
        this.onTap();
      }
    },
    quickReTap(){
      let num = this.sence
        .getAutoFlagReserve()
        .find((number) => number + 1 < this.sence.nowi) || 0;
      this.sence.setNowi(num);
      this.sence.findPreBkg();
      this.onTap();
    },
    autoClickDo(state) {
      //如果点击自动
      if (typeof state === "boolean") this.autoClick = state;
      //此时不适合自动，或者停止自动，停下清句柄
      if(!StatesDeal.clickable.includes(this.statu) || this.$store.getters.isSettingActive || !this.autoClick){
        this.autoClick = false;
        if(this.autoClkSettimeFuncr){
          clearTimeout(this.autoClkSettimeFuncr);
          this.autoClkSettimeFuncr = null;
          return;
        }
      }
      if (this.autoClick) {
        this.onTap();
        //快速：1-4s,慢速: 3-6s
        let spd = 10 - this.$store.getters.autoReadSpead;
        let time = Math.max(1500 + spd * 300, this.sence.getText().length * (80 + spd *8));
        this.autoTimer = Math.min(time, 4000 + spd * 300);
        this.$refs.compview.activeAnime();
        this.autoClkSettimeFuncr = setTimeout(() => {
          this.autoClickDo();
        }, this.autoTimer);
      }
    },
    //触发立绘改变
    changeModel(origiChars?: string, emo?: string): void {
      const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
      if (origiChars) {
        let getRealName = this.sence.getCharReal(origiChars);
        if (!getRealName || !this.dyn_data.charStatus[getRealName]) return;
        switch (this.dyn_data.charStatus[getRealName].position) {
          case "left":
            live2DManager.changeLeftModel(getRealName);
            break;
          case "right":
            live2DManager.changeRightModel(getRealName);
            break;
          case "middle":
          default:
            live2DManager.changeMiddleModel(getRealName);
        }
        if (live2DManager._active_model != null) {
          live2DManager.resetActiveOpacity();
        }
      }
      if (emo) {
        live2DManager.changeEmotion(emo);
      } else {
        if (
          this.sence
            .getText()
            .split("")
            .some((i) => i != "…" && i != "。" && i != "！" && i != "？")
        ) {
          live2DManager.changeEmotion("sp");
        }
      }
    },

    dealAllCode(codeArr) {
      return new Promise((resolve, reject) => {
        if (codeArr) {
          let { arr, params } = this.dealCode(codeArr);
          let codePromise: Promise<number> = arr.shift()(params.shift());
          while (arr.length) {
            let func = arr.shift();
            let param = params.shift();
            codePromise = codePromise.then((delay: number) =>
              func(param, delay)
            );
          }
          codePromise
            .then((delay: number) => {
              resolve(delay);
            })
            .catch((param) => {
              reject(param);
            });
        } else {
          resolve();
        }
      });
    },
    //处理代码
    dealCode(codes: string[]) {
      let arr: Function[] = [];
      let params: string[][] = [];
      for (let item of codes) {
        let paras = item.split(" ");
        switch (paras.shift()) {
          case "delay":
            arr.push(this.dealCodeDelay);
            break;
          case "fadeout":
            arr.push(this.dealCodeFadeOut);
            break;
          case "fadein":
            arr.push(this.dealCodeFadeIn);
            break;
          case "fadeout_in":
            arr.push(this.dealCodeFadeOutIn);
            break;
          case "clear":
            arr.push(this.dealCodeClear);
            break;
          case "leave":
            arr.push(this.dealCodeAudio);
            arr.push(this.dealCodeFadeOut);
            arr.push(this.dealCodeClear);
            params.push(["step"]);
            params.push(paras);
            break;
          case "show":
            arr.push(this.dealCodeShow);
            break;
          case "left":
            arr.push(this.dealCodeLeft);
            break;
          case "right":
            arr.push(this.dealCodeRight);
            break;
          case "middle":
            arr.push(this.dealCodeMiddle);
            break;
          case "db":
            this.sence.bkgs[this.sence.nowi] = "black";
            arr.push(this.dealCodeDelay);
            break;
          case "audio":
            arr.push(this.dealCodeAudio);
            break;
          case "emotion":
            arr.push(this.dealCodeEmotion);
            break;
          case "judgement":
            arr.push(this.dealCodeJudg);
            break;
          case "choose":
            arr.push(this.dealCodeChoose);
            break;
          case "movie":
            arr.push(this.dealCodeMovie);
            break;
          case "moviepro":
            arr.push(this.dealCodeMoviePro);
            break;
          case "turnto":
            arr.push(this.dealCodeTurnto);
            break;
          case "change":
            arr.push(this.dealCodeChange);
            break;
          case "sleepy":
            arr.push(this.dealCodeChange);
            params.push(["blur"]);
            arr.push(this.dealCodeDelay);
            params.push(["4"]);
            arr.push(this.dealCodeChange);
            paras = ["!blur"];
            break;
          case "reset":
            arr.push(this.dealCodeReset);
            break;
          default:
            arr.push(this.dealDefalt);
        }
        params.push(paras);
      }
      return { arr: arr, params: params };
    },

    //delay代码:遮罩显示，param s后去掉遮罩且清空屏幕。
    dealCodeDelay(params: string[]): Promise<number> {
      let second = params.length > 0 ? parseInt(params[0]) : 2;
      return new Promise((resolve) => {
        this.showMask(second, params[1] ? params[1] : "black");
        setTimeout(() => {
          LAppLive2DManager.getInstance().clearAll();
          resolve(DELAY_TIME);
        }, second * 1000 - 500);
      });
    },

    //fadeout代码:设置fadeout，n秒后放行
    dealCodeFadeOut(params: string[]): Promise<number> {
      let second = params.length > 0 ? parseInt(params[0]) : 2;
      return new Promise((resolve) => {
        LAppLive2DManager.getInstance().fadeout();
        setTimeout(() => {
          this.dialog.opacity = "0";
        }, (second * 1000) / 2);
        setTimeout(() => {
          this.dialog.opacity = "1";
          resolve(0);
        }, second * 1000);
      });
    },

    //fadein代码:设置fadein，n秒后放行
    dealCodeFadeIn(params: string[]): Promise<number> {
      let second = params.length > 0 ? parseInt(params[0]) : 2;
      return new Promise((resolve) => {
        LAppLive2DManager.getInstance().fadein();
        resolve(DELAY_TIME);
      });
    },

    //fadeoutin代码:设置fadein，n秒后放行
    dealCodeFadeOutIn(params: string[], delay: number): Promise<number> {
      let second = params.length > 0 ? parseInt(params[0]) : 2;
      return new Promise((resolve) => {
        this.dialog.opacity = 0;
        setTimeout(() => {
          this.canvas.opacity = 0;
        }, 300);
        setTimeout(() => {
          LAppLive2DManager.getInstance().clearAll();
          this.dialog.opacity = 1;
          this.canvas.opacity = 1;
          resolve(DELAY_TIME);
        }, 2000);
      });
    },
    //clear:设置clear,放空当前活跃
    dealCodeClear(params: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        LAppLive2DManager.getInstance().clear();
        resolve(delay);
      });
    },
    //show代码：提前在界面上展示角色
    dealCodeShow(chars: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        for (let name of chars) {
          LAppLive2DManager.getInstance().changeSliper(
            this.sence.getCharReal(name)
          );
          this.changeModel(name);
        }
        resolve(delay);
      });
    },
    //right代码：将角色置右
    dealCodeRight(chars: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        for (let c of chars) {
          let realName = this.sence.getCharReal(c);
          if (!this.dyn_data.charStatus[realName]) {
            this.dyn_data.charStatus[realName] = { position: "right" };
          }
          this.dyn_data.charStatus[realName].position = "right";
        }
        resolve(delay);
      });
    },
    //left代码：将角色置右
    dealCodeLeft(chars: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        for (let c of chars) {
          let realName = this.sence.getCharReal(c);
          if (!this.dyn_data.charStatus[realName]) {
            this.dyn_data.charStatus[realName] = { position: "left" };
          }
          this.dyn_data.charStatus[realName].position = "left";
        }
        resolve(delay);
      });
    },
    //middle代码：将角色置右
    dealCodeMiddle(chars: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        for (let c of chars) {
          let realName = this.sence.getCharReal(c);
          if (!this.dyn_data.charStatus[realName]) {
            this.dyn_data.charStatus[realName] = { position: "middle" };
          }
          this.dyn_data.charStatus[realName].position = "middle";
        }
        resolve(delay);
      });
    },
    //audio 代码
    dealCodeAudio(audios: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        if(this.$store.getters.isAudioPlay){
          for (let audio of audios) {
            this.audio = audio;
            this.$refs.audio.load();
            setTimeout(() => {
              this.$refs.audio.play();
            }, 100);
          }
        }
        resolve(delay);
      });
    },
    //emotion 代码
    dealCodeEmotion(params: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        if (
          params.length > 1 &&
          typeof this.dyn_data.emotions[params[0]] != "undefined"
        ) {
          let key = params.shift();
          let num = this.dyn_data.emotions[key];
          eval("num" + params.join(""));
          this.dyn_data.emotions[key] = num;
        }
        resolve(delay);
      });
    },
    //judgement 代码
    dealCodeJudg(params: string[], delay: number): Promise<number> {
      return new Promise((resolve, reject) => {
        if (params.length == 1) {
          if (this.dyn_data.tmpChoose == parseInt(params[0])) {
            resolve(delay);
          } else {
            this.sence.jumpToNextFrag();
            reject("tap");
          }
        } else {
          let str = "";
          for (let key of params) {
            let t = this.dyn_data.emotions;
            if (typeof t[key] != "undefined") {
              str += t[key];
            } else str += key;
          }
          if (eval(str)) {
            //进入当前fragment
            resolve(delay);
          } else {
            //离开当前fragment，跳到下一个>提示的地方
            this.sence.jumpToNextFrag();
            reject("tap");
          }
        }
      });
    },
    //choose 代码
    dealCodeChoose(params: string[], delay: number): Promise<number> {
      //judgement 青寒 > 金寒 && 黑暗度 <= 1
      return new Promise((resolve) => {
        this.choose = params;
        this.setStatus(States.CHOOSE);
        resolve(delay);
      });
    },
    //movie 代码
    dealCodeMovie(params: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        if (params[0] == "start") this.setStatus(States.MOVIE);
        else this.setStatus(States.NORMAL);
        resolve(DELAY_TIME);
      });
    }, //moviepro 代码
    dealCodeMoviePro(params: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        if (params[0] == "start") this.setStatus(States.MOVIEPRO);
        else this.setStatus(States.NORMAL);
        LAppLive2DManager.getInstance().clear();
        resolve(DELAY_TIME);
      });
    },
    //turnto代码:执行转场后终止
    //eg:turnto char3 name 6second/
    dealCodeTurnto(params: string[], delay: number): Promise<number> {
      return new Promise((resolve, reject) => {
        let second = params.length > 0 ? parseInt(params[2]) : 5;
        //显示遮罩
        let pro1 = this.showMaskWithTitle("w" + params[0], params[1]);
        //2.n秒过后
        let pro2 = new Promise((r2) => {
          setTimeout(() => {
            this.mask.showtitle = false;
            r2();
          }, second * 1000);
        });
        //加载完并且约定展示的时间过后
        Promise.all([pro1, pro2]).then(() => {
          this.mask.showtitle = false;
          setTimeout(() => {
            this.mask.opa = 0;
            reject("tap");
          }, 2000);
        });
      });
    },
    //显示遮罩并1s后读取章节资源，返回Promise。
    showMaskWithTitle(chapter: string, title: string = ""): Promise<void> {
      //显示遮罩
      this.mask.color = "black";
      this.mask.title = title;
      this.mask.showtitle = true;
      this.$store.commit("setPresent", 0);
      this.mask.opa = 1;
      //1后
      return new Promise((r) => {
        setTimeout(() => {
          this.sence = null;
          this.sence = new Sence(chapter);
          this.sence.initByAjax().then(() => {
            r();
            //初始化全局变量
            this.$store.commit('charTitle',this.sence.title);
          });
        }, 1000);
      });
    },
    //change blind shake blur old
    //change 代码
    dealCodeChange(param: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        let delaytme = 500;
        this.dialog.opacity = 0;
        //change blur
        if (param[0] == "blur") {
          this.filter.blur = 20;
        }
        //change !blur
        else if (param[0] == "!blur") {
          this.filter.blur = 0;
        }

        //change old
        else if (param[0] == "old") {
          this.dyn_data["old"] = 0.7;
        }
        //change !old
        else if (param[0] == "!old") {
          this.dyn_data["old"] = 0;
        } else if (param[0] == "autoblur") {
          this.filter.blur = 10;
          setTimeout(() => {
            this.filter.blur = 0;
          }, 700);
          setTimeout(() => {
            this.filter.blur = 20;
          }, 2500);
          setTimeout(() => {
            this.filter.blur = 0;
          }, 3200);
          setTimeout(() => {
            this.filter.blur = 20;
          }, 5000);
          setTimeout(() => {
            this.filter.blur = 0;
          }, 7000);
          delaytme = 5000;
        } else if (param[0] == "blink") {
          this.showMask(0.4, "white");
        } else if (param[0] == "blood") {
          this.showMask(0.4, "red");
        } else if (param[0] == "shake") {
          this.filter.animation = "shake";
          setTimeout(() => {
            this.filter.animation = "";
          }, 2000);
        }
        setTimeout(() => {
          this.dialog.opacity = 1;
          resolve(DELAY_TIME);
        }, delaytme);
      });
    },
    //reset代码
    dealCodeReset(params: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        for (let item in charaDefaultPosition) {
          for (let char of charaDefaultPosition[item]) {
            if (this.dyn_data.charStatus[char]) {
              this.dyn_data.charStatus[char].position = item;
            } else {
              this.dyn_data.charStatus[char] = { position: item };
            }
          }
        }
        resolve(delay);
      });
    },
    //TODO:add
    //anime
    dealDefalt(chars: string[], delay: number): Promise<number> {
      return new Promise((resolve) => {
        resolve();
      });
    },
    //存档
    saveUserData(index: number) {
      this.getSaveData(index).then((d) => {
        d.game = gameSetting.gameName;
        d.user = this.$store.getters.getUser;
        console.log(d.user);
        ajax({
          type: "post",
          url: phpPath + "t_save.php",
          dataType: "json",
          data: JSON.stringify(d),
        }).then(
          () => {
            console.log("存档成功!");
            this.$refs.settingView.refreshLoads();
            //刷新存档
          },
          () => {
            console.log("存档失败!");
          }
        );
      });
    },
    //获取截图
    getcanvas(): Promise<string> {
      return new Promise((resolve) => {
        var Maincanvas = document.getElementById(
          "maincanvas"
        ) as HTMLCanvasElement;
        let personData = Maincanvas.toDataURL("image/png");
        html2canvas(document.getElementById("bkg")).then((bkgCanvas) => {
          const qrCodeImg = new Image();
          qrCodeImg.src = personData;
          qrCodeImg.onload = () => {
            const ctx = bkgCanvas.getContext("2d");
            ctx.drawImage(
              qrCodeImg,
              0,
              0,
              qrCodeImg.width,
              qrCodeImg.height,
              0,
              0,
              bkgCanvas.width,
              bkgCanvas.height
            );
            const canvas = document.createElement("canvas");
            canvas.height = 120;
            canvas.width = 212;
            const c = canvas.getContext("2d");
            c.drawImage(
              bkgCanvas,
              0,
              0,
              bkgCanvas.width,
              bkgCanvas.height,
              0,
              0,
              212,
              120
            );
            resolve(canvas.toDataURL("image/jpeg"));
          };
        });
      });
    },
    //获取全部数据
    getSaveData(index: number): Promise<SaveData> {
      return new Promise((resolve) => {
        this.getcanvas().then((d) => {
          let str: string = "";
          let l = LAppLive2DManager.getInstance();
          this.dyn_data["show"] = "";
          if (l._left_model != null) {
            this.dyn_data["show"] = l._left_model._realName;
          }
          if (l._right_model != null) {
            this.dyn_data["show"] += " " + l._right_model._realName;
          }
          if (l._middle_model != null) {
            this.dyn_data["show"] += " " + l._middle_model._realName;
          }
          this.dyn_data.nowCha = this.sence.getCharOrigin();
          str += JSON.stringify(this.dyn_data);

          let data: SaveData = {
            position: index,
            chapterName: this.sence.title,
            chapter: this.sence.charName,
            nowi: this.sence.nowi - 1,
            other: str,
            canvas: d,
          };
          resolve(data);
        });
      });
    },
    //读档/初始读最近的档
    //
    loadUserData(index?: number) {
      console.log(this.$store.getters.getUser);

      ajax({
        type: "post",
        url: phpPath + (index ? "t_load.php" : "t_findLastSave.php"),
        dataType: "json",
        data: JSON.stringify({
          game: gameSetting.gameName,
          user: this.$store.getters.getUser,
          position: index,
        }),
      }).then(
        (data) => {
          this.$store.commit("closeSetting");
          try {
            data = JSON.parse(data).result;
          } catch (error) {
            this.initGameByFirstCharp();
            return 0;
          }
          if (data.length == 0) {
            this.initGameByFirstCharp();
            return 0;
          }
          data = data[0];
          let pro1 = this.showMaskWithTitle(data["chapter_id"]);
          let pro2 = new Promise((r2) => {
            setTimeout(() => {
              r2();
            }, 3000);
          });
          Promise.all([pro1, pro2]).then(() => {
            this.dyn_data = JSON.parse(data["other"]);
            //1.恢复当前active角色/背景/音乐
            //2.show当前页面上的角色
            let nowi: number = data["nowi"];
            this.sence.setCharOrigin(this.dyn_data.nowCha);
            this.sence.bkgs[nowi] = this.dyn_data.bkg;
            this.sence.musics[nowi] = this.dyn_data.music;
            this.sence.setNowi(nowi);
            let showcode = "show " + this.dyn_data["show"].trimLeft();
            if (!this.sence.codes[nowi]) this.sence.codes[nowi] = [];
            this.sence.codes[nowi].push(showcode);
            this.mask.showtitle = false;
            setTimeout(() => {
              this.mask.opa = 0;
              this.onTap();
            }, 2000);
          });
        },
        () => {
          console.log("获取存档失败!");
        }
      );
    },
    //从第一章初始化游戏
    initGameByFirstCharp() {
      let pro1 = this.showMaskWithTitle(gameSetting.startChap);
      let pro2 = new Promise((r2) => {
        setTimeout(() => {
          r2();
        }, 4000);
      });
      Promise.all([pro1, pro2]).then(() => {
        for (let item in charaDefaultPosition) {
          for (let char of charaDefaultPosition[item]) {
            this.dyn_data.charStatus[char] = { position: item };
          }
        }
        for (let item in gameEmotion) {
          this.dyn_data.emotions[item] = gameEmotion[item];
        }
        this.mask.showtitle = false;
        setTimeout(() => {
          this.mask.opa = 0;
          this.onTap();
        }, 2000);
      });
    },
    //
    //私有工具方法
    //
    //有持续时间地显示mask
    showMask(second: number, color: string = "black") {
      this.mask.opa = 1;
      this.mask.color = color;
      setTimeout(() => {
        this.mask.opa = 0;
      }, second * 1000);
    },
    //做出选择
    dochoose(index: number) {
      this.choose = [];
      this.dyn_data.tmpChoose = index;
      this.onTap();
      this.setStatus(States.NORMAL);
    },
    //状态机变化
    setStatus(n: States) {
      console.log("状态改变：" + this.statu + "->" + n);
      this.statu = n;
      LAppLive2DManager.getInstance().clearAll();
    },
    //播放音效
    playAudio(music?: string) {
      if(!this.$store.getters.isAudioPlay) return;
      this.audio = music ? music : "hover";
      this.$refs.audio.load();
      setTimeout(() => {
        this.$refs.audio.play();
      }, 20);
    },
    //重新计算大小
    changeWH(w, h, b) {
      if (w / h > b) {
        this.height = h;
        this.width = h * b;
      } else {
        this.width = w;
        this.height = w / b;
      }
    },
    handleMessage(event) {
      const data = event.data;
      if (data.user) {
        this.$store.commit("setUser", data.user);
        console.log("user变为" + data.user);
        this.loadUserData();
        this.$refs.settingView.refreshLoads();
      }
      console.log("接到消息");
      console.log(data);
      // //读取最近的存档
      //alert(data.user)
    },
  },
  //   析构函数
  beforeDestroy() {
    LAppDelegate.releaseInstance();
  },
});
</script>

<style scoped lang="less">
//注册关键帧
.keyframesSlide(slidey50, 0px, 50px);
.keyframesSlide(slidex30, 30px, 0px);
.keyframesSlide(fadein);
.keyframesFadeInOut(fadeinout);
#viewBlock {
  z-index: 0;
  transition: filter 0.5s ease;
}
.blur {
  filter: blur(10px);
}

//延迟纵向-微移动进入
.slidey50-enter-active {
  opacity: 0;
  .slide(0px, 50px);
  animation: slidey50 1.5s ease-out 1s;
}
.slidey50-leave-active {
  animation: fadein 2s ease-out;
  animation-direction: reverse;
}

.slidex30-enter-active {
  opacity: 0;
  .slide(0px, -20px);
  animation: slidex30 1s ease-out 1.5s;
}
.slidex30-leave-active {
  animation: slidex30 1s cubic-bezier(0.42, 0, 1, 0.63) 0.5s;
  animation-direction: reverse;
}


</style>
