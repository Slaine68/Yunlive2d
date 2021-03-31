<template>
  <div
    :class="{ slideOuter: true, unusable }"
    :style="{ width, marginRight: '2.5rem' }"
    ref="slide"
    @touchstart="move($event)"
    @touchmove="move($event)"
    @touchend="end($event)"
    @mousedown="start($event)"
    @mousemove="drag($event)"
    @mouseup="up($event)"
    @mouseleave="up($event)"
  >
    <div class="slide-solid" :style="{ clipPath: getPolygon }"></div>
    <div class="slide-bkg"></div>
    <span
      class="slider"
      :style="{ opacity: unusable ? 0 : 1, clipPath: getPolygon2 }"
    ></span>
    <span class="slider-text small-number-font">
      {{ realValue }}
    </span>
  </div>
</template>

<script>
export default {
  name: "SettingSlide",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    maxValue: {
      type: Number,
      default: 100,
    },
    initValue: {
      type: Number,
      default: 100,
    },
    unusable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      progressWidth: this.initPercent, // 进度条当前的的宽度
      clientX: 0,
      clientWidth: 1,
      isClickSlider: false,
      Xstart: 0, //touch时上一次offset的绝对位置
      offsetLeft: 0, //组件拖拽点
      oldOffset: 0,
    };
  },
  mounted() {
    this.clientX = this.$refs.slide.getClientRects()[0].x;
    this.clientWidth = this.$refs.slide.getClientRects()[0].width;
    this.offsetLeft = (this.initValue / this.maxValue) * this.clientWidth;
  },
  computed: {
    present() {
      return Math.round((this.offsetLeft / this.clientWidth) * 100);
    },
    realValue() {
      return Math.round((this.present / 100) * this.maxValue);
    },
    getPolygon: function () {
      return `polygon(${this.present}% 0%, ${this.present}% 100%, 0 100%, 0 0)`;
    },
    getPolygon2: function () {
      return `polygon(${this.present}% 0%, ${this.present}% 100%, ${
        this.present - 2
      }% 100%, ${this.present - 2}% 0)`;
    },
  },
  methods: {
    end(e) {
      this.$emit("changevalue", this.realValue);
    },
    move(e) {
      this.setOffset(e.touches[0].clientX - this.clientX); //与组件的相对位移
    },
    start(e) {
      this.isClickSlider = true;
      this.setOffset(e.clientX - this.clientX);
    },
    drag(e) {
      if (this.isClickSlider) {
        this.setOffset(e.clientX - this.clientX);
      }
    },
    up(e) {
      this.isClickSlider = false;
      this.end();
    },
    setOffset(offset) {
      if (offset < 0) {
        this.offsetLeft = 0;
      } else if (offset > this.clientWidth) {
        this.offsetLeft = this.clientWidth;
      } else this.offsetLeft = offset;
    },
  },
};
</script>

<style scoped lang="less">
.slideOuter,
.slide-solid,
.slide-bkg {
  display: inline-block;
  height: 0.5rem;
}
.slideOuter {
  position: relative;
  padding: 1rem 0;
}
.slide-solid {
  z-index: 1;
  position: absolute;
  width: 100%;
  background: linear-gradient(90deg, #399471, #3b6b86, #533f5a);
}
.slide-bkg {
  position: absolute;
  width: 100%;
  background: gray;
}
.slider {
  z-index: 2;
  display: inline-block;
  width: 100%;
  height: 1rem;
  background: white;
  position: relative;
  top: -0.25rem;
  z-index: 100;
}
.slider-text {
  position: absolute;
  right: -2rem;
}
.unusable {
  .slide-bkg {
    background: #5d5c5c;
  }
  .slide-solid {
    background: gray;
  }
}
</style>