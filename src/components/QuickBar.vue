<template>
  <div class="quick-bar">
      <div v-for="cont in content" :key='cont.name'>
          <span v-if="cont.type == 'text'">{{cont.name+' : '+cont.vars}}</span>
          <span v-else-if="cont.type == 'active'" :class="{unactive:!cont.vars}">{{cont.name}}</span>
          <button v-else>{{cont.vars}}</button>
      </div>
      <div class="timer-out">
          <div :class="{timerinner:true,animefalse:!animechange,animetrue:animechange}" :style="translate"></div>
      </div>
  </div>
</template>

<script>
export default {
    props:{
        content:{
            type: Array,
            default:[{
                name:'',//描述
                type:'text',//类型：text，button，active
                vars:'',//真正的内容,
                style:'',
                callback:''
            }]
        },
        autotimer:{
            type:Number,
            default:0
        }
    },
    data(){
        return {
            animechange:true
        }
    },
    methods:{
        activeanime(){
            this.animechange = !this.animechange;
        }
    },
    computed:{
        translate(){
            return `animation-duration: ${this.autotimer/1000}s`;
        }
    }
}
</script>

<style scoped lang="less">
.quick-bar{
    height:1.5rem;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    opacity: 0.7;
    font-size: 0.7rem;
    &>div{
        display: inline-block;
        margin:2px 0.4rem;
        border-right: white 1px solid;
    }
}
.unactive{
    color: gray;
}
.timer-out{
    width: 4rem;
    height: 0.7rem;
}
@keyframes changewidthtrue {
  0%   {width: 0%;}
  100% {width: 100%}
}
@keyframes changewidthfalse {
  0%   {width: 0%;}
  100% {width: 100%}
}
.animetrue{
    animation-name: changewidthtrue;
}
.animefalse{
    animation-name: changewidthfalse;
}
.timerinner{
    background:gray;
    height:0.7rem;
    display:inline-block;
    animation-fill-mode:backwards;
    animation-timing-function:linear;
    //animation-iteration-count:infinite;
}
</style>