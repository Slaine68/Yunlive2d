<template>
  <div id="saveViewMain" class="flex-col-center flex-father-full">
    <div id="saveIndex" class="mouse-hover">
      <span
        v-for="index in pageSum"
        :key="index"
        :class="{'outspan':true,'active':index==curpage}"
        @click="curpage = index"
      >
        <span></span>
      </span>
    </div>
    <div id="saveBodyMask">
      <div
        id="saveBody"
        :class="['flex-row-center','flex-father-full',$store.getters.getSettingViewFunc]"
        @mouseover="mouseOver"
        @click="mouseClick"
        :style="{'transform':'translateX(-'+(curpage-1)*(100/pageSum)+'%)','width':(100*pageSum)+'%'}"
      >
        <section v-for="pg in pageSum" :key="pg">
          <!-- 1-6,7-12.... -->
          <span
            v-for="(item,index) in currentSaves(pg)"
            :key="index+numPerPage*(pg-1)"
            :class="{'flex-col-center':true,'saveSmallBlock':true,'no-info':item==null,'has-info':item!=null}"
          >
            <span
              class="full-screen mousehover pointer"
              style="z-index: 10;"
              @click="clickSmallBlock(index+numPerPage*(pg-1))"
            ></span>
            <span class="top-line small-title-font small-number-font">
              <span class="top-line-text">~{{index+numPerPage*(pg-1)}}~</span>
            </span>
            <span class="bottom-line">
              <span class="text">{{item==null?'':item.chapter_name}}</span>
            </span>
            <span class="middle-number litter-font">-{{index+numPerPage*(pg-1)}}-</span>
            <div v-if="item==null" class="litter-font">NO INFO</div>
            <span
              v-else
              class="block-img"
              :style="{backgroundImage: 'url('+phpPath+'save/'+gameName+'/'+$store.getters.getUser+'/'+(index+numPerPage*(pg-1))+item.id+'.jpg)'}"
            >
              <span class="both-block"></span>
            </span>
          </span>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//:style="{backgroundImage: 'url(./other/' + (item==null?'':item.bkg) + '.jpg)'}"
import Vue from "vue";
import { ajax } from "../ajax";
import { phpPath,gameSetting,DebugLogEnable } from "../lappdefine";
export default Vue.extend({
  data() {
    return {
      numPerPage: 6,
      curpage:1,
      pageSum: DebugLogEnable?8:3,
      saves: [],
      phpPath:phpPath,
      gameName:gameSetting.gameName
    };
  },
  props: ["setting"],
  methods: {
    mouseOver(event) {
      if (event.target.className.indexOf("mousehover") > -1) {
        this.$emit("playAudio", "yes");
      }
    },
    mouseClick(event) {
      if (event.target.className.indexOf("mousehover") > -1) {
        this.$emit("playAudio");
      }
    },
    clickSmallBlock(num:number){
      if(this.$store.getters.getSettingViewFunc=="save"){
        this.$emit('saveUserData',num);
      }
      else{
        this.$emit('loadUserData',num);
      }
    }
    ,
    //获取全部存档
    getAllUserSave() {
      ajax({
        type: "post",
        url: phpPath + "t_findsave.php",
        dataType: "json",
        data: JSON.stringify({
          game: gameSetting.gameName,
          user:this.$store.getters.getUser,
        })
      }).then(
        data => {
          try {
            data = JSON.parse(data).result;
            for (let i = 0; i < this.numPerPage * this.pageSum; i++) {
              this.saves.push(null);
            }
            for (let save of data) {
              this.saves[save["position"]] = save;
            }
          } catch (error) {
            console.log(error);
            for (let i = 0; i < this.numPerPage * this.pageSum; i++) {
              this.saves.push(null);
            }
          }
        },
        () => {
          console.log("获取存档失败!");
        }
      );
    }
  },
  //当前页：this.$store.getters.getPag
  computed: {
    currentSaves() {
      return function(page) {
        return this.saves.slice(
          this.numPerPage * (page - 1),
          this.numPerPage * page
        );
      };
    }
  },
  mounted() {
    //图片
    //章节名称
    //位置
    //存档时间
    //this.getAllUserSave();
  }
});
</script>

<style scoped lang="less">


#saveIndex {
  .outspan {
    padding: 0 0.5rem;
    //小方块
    span {
      background: #3a3a3c8a;
      width: 0.4rem;
      border-radius: 50%;
      display: inline-block;
      height: 0.4rem;
    }
    &.active {
      span {
        background: #eef7ff6b;
      }
    }
    &:hover {
      span {
        background: #eef7ff6b;
      }
    }
  }

  display: flex;
  text-align: center;
  justify-content: center;
  height: 2rem;
  line-height: 2rem;
  cursor: pointer;
}
@img-frame: {
  color: white;
  background: @bright-darkopa;
  position: absolute;
  z-index: 1;
  width: 100%;
  display: block;
  padding: 0px 0.5rem;
  box-sizing: border-box;
};

.topline-open() {
  height: 1rem;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    calc(100% - 2.5rem) 100%,
    calc(100% - 3rem) 50%,
    0 45%
  );
  .top-line-text {
    animation: dispear-and-show 0.8s;
    right: 0rem;
    opacity: 1;
  }
}
.topline-close() {
  height: 50%;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    calc(100% - 3.5rem) 100%,
    calc(100% - 4rem) 100%,
    0 100%
  );
  .top-line-text {
    opacity: 0;
  }
}
.middle-text-open() {
  opacity: 0;
  top: -0.5rem;
}
.middle-text-close() {
  opacity: 1;
  top: 0;
}
.bottomline-open() {
  height: 1rem;
  .text {
    opacity: 0.9;
    left: 0.5rem;
  }
}
.bottomline-close() {
  height: 50%;
  .text {
    opacity: 0;
    left: -0.5rem;
  }
}
.all-open() {
  .top-line {
    .topline-open();
  }
  .middle-number {
    .middle-text-open();
  }
  .bottom-line {
    .bottomline-open();
  }
}
.all-close() {
  .top-line {
    .topline-close();
  }
  .middle-number {
    .middle-text-close();
  }
  .bottom-line {
    .bottomline-close();
  }
}
#saveBodyMask {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#saveBody {
  //flex-wrap: wrap;
  overflow: visible;
  height: 100%;
  transition: transform 1s cubic-bezier(0.86, 0, 0.03, 1);
  -webkit-transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.03, 1);
  section {
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    overflow: hidden;
    align-content: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .saveSmallBlock {
    background: repeating-linear-gradient(30deg, #d8d8d812, transparent 6rem),
      linear-gradient(0deg, #131313ad, #0000007d);
    .sub-corner-right-bottom();
    height: 35%;
    position: relative;
    width: 27%;
    box-shadow: #ffffff66 -2px 4px 0px 0px;
    margin: 0.5rem 1%;
    .top-line {
      .top-line-text {
        position: relative;
        transition: opacity 0.4s cubic-bezier(0, 0.82, 0.58, 1),
          right 0.4s ease-out;
      }
      @img-frame();
      color: #d5d6d8;
      line-height: 1rem;
      text-align: right;
      top: 0;
      transition: clip-path 0.5s cubic-bezier(0.03, 0.74, 0.58, 1),
        height 0.4s ease, color 1.5s ease;
    }
    .middle-number {
      color: #fff;
      font-size: 1.2rem;
      width: 100%;
      position: relative;
      z-index: 9;
      text-align: center;
      box-sizing: border-box;
      text-shadow: #ffffff 0px 0px 20px;
      transition: opacity 0.5s cubic-bezier(0, 0.63, 0.58, 1),
        top 0.3s cubic-bezier(0.74, 0.01, 0.38, 1);
    }
    .block-img {
      display: inline-block;
      width: 100%;
      height: 100%;
      position: absolute;
      background-repeat: no-repeat;
      background-position-x: center;
      background-size: cover;
      box-sizing: border-box;
      transition: width 0.5s ease, height 0.5s ease;
    }
    .bottom-line {
      @img-frame();
      bottom: 0;
      font-size: 0.5rem;
      line-height: 200%;
      height: 50%;
      transition: height 0.4s ease-out;
      .text {
        position: absolute;
        bottom: 0%;
        transition: opacity 0.4s cubic-bezier(0, 0.82, 0.58, 1),
          left 0.4s ease-out;
      }
    }
    //在无对象的情况下：
    &.no-info {
      div {
        color: #ffffffbf;
        font-size: 0.9rem;
        position: absolute;
        width: 100%;
        top: calc(50% + 0.4rem);
        text-align: center;
        box-sizing: border-box;
        opacity: 0;
        text-shadow: #ffffff 0px 0px 20px;
        transition: opacity 0.5s cubic-bezier(1, 0, 0.99, 0.81),
          top 0.3s cubic-bezier(0.74, 0.01, 0.38, 1);
      }
    }
    //有对象的情况下
    &.has-info {
      .block-img {
        .both-block {
          display: inline-block;
          position: absolute;
          width: 70%;
          top: 15%;
          height: 70%;
          left: 15%;
          opacity: 0;
          box-sizing: border-box;
          border: 2px solid white;
          .lefttop-rightbottom(30%, 30%);
          transition: 0.4s ease-in;
          z-index: 8;
        }
      }
    }
  }
  &.save {
    //全部是关
    .saveSmallBlock {
      .all-close();
      &:hover {
        div {
          opacity: 0.8;
          top: calc(50% - 0.4rem);
          font-size: 0.9rem;
          text-shadow: #c13e3e99 0px 0px 11px;
        }
        .all-open();
        .top-line {
          .top-line-text {
            animation: dispear-and-show 0.8s;
          }
        }
        .bottom-line {
          .text {
            animation: dispear-and-show-left 0.8s;
          }
        }
      }
    }
  }
  &.load {
    //全部是开
    .saveSmallBlock {
      div {
        top: calc(50% - 0.4rem);
        opacity: 0.9;
      }
      .all-open();
      .top-line-text {
        right: 0rem;
      }
      &:hover {
        div {
          top: 50%;
          opacity: 0;
        }
        .block-img {
          .both-block {
            animation: both-block-ani 0.6s;
            width: 60%;
            top: 20%;
            height: 60%;
            left: 20%;
            opacity: 1;
          }
        }
        .all-close();
        .top-line-text {
          right: 0.5em;
        }
        .middle-number {
          animation: dispear-and-show-top 0.6s;
        }
      }
    }
  }
}
@keyframes dispear-and-show {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
    right: 0.5rem;
  }
}
@keyframes dispear-and-show-left {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
    left: 0.5rem;
  }
}
@keyframes dispear-and-show-top {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
    top: -0.5rem;
  }
}
@keyframes both-block-ani {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
    width: 70%;
    top: 15%;
    height: 70%;
    left: 15%;
  }
}
</style>
