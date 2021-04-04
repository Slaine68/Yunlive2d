/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import {
  States
} from "./lappdefine";
import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

import "./assets/css/style.less";
import './assets/css/font.less'

//禁止选择
document.body.onselectstart = function () {
  return false;
}
//禁止右键菜单
// document.oncontextmenu = function () {
//   event.returnValue = false;
// }

//Vuex
Vue.use( Vuex );
const store = new Vuex.Store({
  //
  state:{
    //主状态
    statu:States.NORMAL,
    //加载百分比
    present:100,
    //设置页状态
    settingView:{
      active:false,
      func:'save',
      isMusicPlay:true,
      musicVolum:0.5,
      isAudioPlay:true,
      audioVolum:0.8,
      isVoicalPlay:false,
      voicalVolum:0.7,
      isFlower:false,//是否开启花里胡哨特效
      autoReadSpead: 5, //自动速度，0-10
    },
    //用户名称
    user:'',
    //游戏界面通用
    game:{
      title:'',
      charTitle:'',
      charactorMap:{},
      charactorColor:{},
      charaDefaultPosition:{},
      gameEmotion:{}
    },
    audio:'yes',
  },
  getters:{
    isSettingActive(state){
      return state.settingView.active;
    },
    settViewFunc(state){
      return state.settingView.func;
    },
    isMusicPlay(state){
      return state.settingView.isMusicPlay;
    },
    musicVolum(state){
      return state.settingView.musicVolum;  
    },
    isAudioPlay(state){
      return state.settingView.isAudioPlay;
    },
    audioVolum(state){
      return state.settingView.audioVolum;  
    },
    isVoicalPlay(state){
      return state.settingView.isVoicalPlay;
    },
    voicalVolum(state){
      return state.settingView.voicalVolum;  
    },
    isFlower(state){
      return state.settingView.isFlower;  
    },
    getPresent(state){
      return state.present;
    },
    getUser(state){
      return state.user;
    },
    gameName(state){
      return state.game.title;
    },
    charactorMap(state){
      return state.game.charactorMap
    },
    charactorColor(state){
      return state.game.charactorColor;
    },
    charaDefaultPosition(state){
      return state.game.charaDefaultPosition;
    },
    gameEmotion(state){
      return state.game.gameEmotion;
    },
    audio(state){
      return state.audio;
    },
    autoReadSpead(state){
      return state.settingView.autoReadSpead;
    },
    charTitle(state){
      return state.game.charTitle;
    }
  },
  mutations:{
    switchSettView(state,func?){
      state.settingView.active=!state.settingView.active;
      if(func){
        state.settingView.func=func;
      }
    },
    closeSetting(state){
      state.settingView.active=false;
    },
    setSettingViewFunc(state,func){
      state.settingView.func=func;
    },
    musicPlay(state,play:boolean){
      let music = document.getElementById('music') as HTMLAudioElement;
      if(play){
        music.play();
      }
      else music.pause();
      state.settingView.isMusicPlay=play;
    },
    musicVolum(state,page:number){
      let music = document.getElementById('music') as HTMLAudioElement;
      music.volume = page;
      state.settingView.musicVolum=page;
    },
    audioVolum(state,page:number){
      let music = document.getElementById('audio') as HTMLAudioElement;
      music.volume = page;
      state.settingView.audioVolum=page;
    },
    voicalVolum(state,page:number){
      let music = document.getElementById('voical') as HTMLAudioElement;
      music.volume = page;
      state.settingView.voicalVolum=page;
    },
    audioPlay(state,play:boolean){
      state.settingView.isAudioPlay=play;
    },
    playAudio(state, audio:string = 'hover'){
      if(!state.settingView.isAudioPlay)return;
      state.audio = audio;
      let au = document.getElementById('audio') as HTMLAudioElement;
      au.load();
      setTimeout(() => {
        au.play();
      }, 20);
    },
    voicalPlay(state,play:boolean){
      state.settingView.isVoicalPlay=play;
    },
    switchFlower(state,play:boolean){
      state.settingView.isFlower=play;
    },
    setPresent(state,pre:number){
      state.present=pre;
    },
    setUser(state,pre:string){
      state.user=pre;
    },
    setGame(state,pre:string){
      state.game.title=pre;
    },
    setGameObj(state,obj:object){
      state.game.charactorMap = obj['charactorMap'];
      state.game.charactorColor = obj['charactorColor'];
      state.game.charaDefaultPosition = obj['charaDefaultPosition'];
      state.game.gameEmotion = obj['gameEmotion'];
    },
    autoReadSpead(state,num:number){
      state.settingView.autoReadSpead = num;
    },
    charTitle(state,str:string){
      state.game.charTitle = str;
    }
  }

})

var vue=new Vue({
  render: h => h(App),
  store
}).$mount('#app')

export default vue