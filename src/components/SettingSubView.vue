<template>
  <div style="padding-left:2rem">
    <header>音乐设置</header>
    <!-- 大小的滑动条 -->
    <settingSlide 
      :width="'70%'"
      :unusable="!$store.getters.isMusicPlay"
      :initValue="$store.getters.musicVolum * 100"
      :maxValue="100"
      @changevalue="musicVolumchange"/>
    <settingButton
      :state="$store.getters.isMusicPlay"
      :callback="changeMusic"
    ></settingButton>

    <header>音效设置</header>
    <!-- 大小的滑动条，开关 -->
    <settingSlide 
      :width="'70%'"
      :unusable="!$store.getters.isAudioPlay"
      :initValue="$store.getters.audioVolum * 100"
      :maxValue="100"
      @changevalue="audioVolumchange"/>
    <settingButton
      :state="$store.getters.isAudioPlay"
      :callback="changeAudio"
    ></settingButton>

    <header>语音设置</header>
    <!-- 大小的滑动条，开关 -->
    <settingSlide 
      :width="'70%'"
      :unusable="!$store.getters.isVoicalPlay"
      :initValue="$store.getters.voicalVolum * 100"
      :maxValue="100"
      @changevalue="voicalVolumchange"/>
    <settingButton
      :state="$store.getters.isVoicalPlay"
      :callback="changeVoical"
    ></settingButton>

    <header>自动翻页速度</header>
    <!-- 滑动条 -->
    <settingSlide 
      :width="'70%'"
      :initValue="$store.getters.autoReadSpead"
      :maxValue="10"
      @changevalue="autoReadSpead"/>

    <header>性能模式</header>
    <settingButton
      :state="$store.getters.isFlower"
      :callback="switchFlower"
    ></settingButton>
  </div>
</template>

<script>
import settingButton from "./SettingButton";
import settingSlide from "./SettingSlide";
export default {
  components: {
    settingButton,
    settingSlide
  },
  methods:{
      changeMusic(){
        this.$store.commit("musicPlay", !this.$store.getters.isMusicPlay);
      },
      changeAudio(){
        this.$store.commit("audioPlay", !this.$store.getters.isAudioPlay);
      },
      changeVoical(){
        this.$store.commit("voicalPlay", !this.$store.getters.isVoicalPlay);
      },
      switchFlower(){
        this.$store.commit("switchFlower", !this.$store.getters.isFlower);
      },
      musicVolumchange(value){
        this.$store.commit("musicVolum", value/100);
      },
      audioVolumchange(value){
        this.$store.commit("audioVolum", value/100);
      },
      voicalVolumchange(value){
        this.$store.commit("voicalVolum", value/100);
      },
      autoReadSpead(value){
        this.$store.commit("autoReadSpead", value);
      }
  }
  };
</script>

<style scoped lang="less">
header{
  padding-top: 1rem;
  padding-bottom: 0.6rem;
}
</style>