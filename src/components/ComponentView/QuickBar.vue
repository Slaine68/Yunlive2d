<template>
  <div class="quick-bar">
    <template v-for="cont in content">
      <div v-if="cont.type == 'text'" :class="cont.type">{{ cont.vars }}</div>
      <div
        v-else-if="cont.type == 'active'"
        :class="{ unactive: !cont.vars, button: true }"
        @click="cont.callback()"
      >
        {{ cont.name }}
        <!-- 自动阅读特殊进度条 -->
        <span style="font-size: 0" v-if="cont.name == '自动阅读（A）'">
          <div class="timer-out">
            <div
             v-show="animeShow"
              :class="{
                timerinner: true,
                animefalse: !animechange,
                animetrue: animechange,
              }"
              :style="translate"
            ></div>
          </div>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Array,
      default: [
        {
          name: "", //描述
          type: "text", //类型：text，button，active
          vars: "", //真正的内容,
          style: "",
          callback: () => {},
        },
      ],
    },
    autotimer: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      animechange: true,
      animeShow: true,
    };
  },
  methods: {
    activeanime() {
      if (!this.animeShow) this.animeShow = true;
      this.animechange = !this.animechange;
    },
    stopanime() {
      this.animeShow = false;
    },
  },
  computed: {
    translate() {
      return `animation-duration: ${this.autotimer / 1000}s`;
    },
  },
};
</script>

<style scoped lang="less">
.quick-bar {
  padding: 3px;
  padding-bottom: 5px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 101;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0.7;
  font-size: 0.7rem;
  & > div {
    position: relative;
    display: inline-block;
    padding: 0 0.8rem;
    border-right: white 1px solid;
    &:last-child {
      border-right: none !important;
    }
    &.text {
      cursor: default;
    }
    &.button {
      cursor: pointer;
    }
  }
}
.unactive {
  color: gray;
}
.timer-out {
  width: 100%;
  bottom: -3px;
  left: 0;
  height: 3px;
  position: absolute;
}
@keyframes changewidthtrue {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
@keyframes changewidthfalse {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
.animetrue {
  animation-name: changewidthtrue;
}
.animefalse {
  animation-name: changewidthfalse;
}
.timerinner {
  background: gray;
  height: 100%;
  display: inline-block;
  animation-fill-mode: backwards;
  animation-timing-function: linear;
  //animation-iteration-count:infinite;
}
</style>