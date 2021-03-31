<template>
  <div
    id="dialog-normal"
    :class="['dialog','anime'+anime]"
    :style="{opacity:opa,fontSize:(1+font)+'rem',fontFamily:'dialogfont'}"
  >
    <div id="dialogName" :class="getcolor" v-show="name.length>0">{{name}}</div>
    <div id="dialog_padding" :class="{sideSpeack:name.length==0}">
      <div id="dialogText" class="dialogActiveText" v-html="text"></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { charactorColor } from "../lappdefine";
export default Vue.extend({
  props: ["text", "name", "opa", "font", "fontfamily", "anime"],
  computed: {
    getcolor: function() {
      return "blocks_" + charactorColor[this.name]; //this.name;
    }
  }
});
</script>
<style scoped lang="less">
#dialog-normal {
  width: 33rem;
  position: absolute;
  bottom: 10px;
  line-height: 130%;
}
#dialog-normal,
#dialogName {
  transition: opacity 0.8s ease;
}

#dialog_padding {
  height: 8rem;
  position: relative;
  top: -1px;
  padding: 1rem 2rem 1rem 3rem;
  box-sizing: border-box;
  background: repeating-linear-gradient(35deg, #6161610a, transparent 8rem),
    repeating-linear-gradient(145deg, #a5a5a508, transparent 8rem), #252525eb;
}

#dialogName {
  height: 2rem;
  line-height: 2rem;
  padding-left: 3rem;
  clip-path: polygon(
    9rem 0%,
    10rem 2.1rem,
    100% 2.1rem,
    100% 100%,
    0 100%,
    0 0
  );
}
.blocks(@name,@color) {
  .blocks_@{name} {
    background: linear-gradient(
        to right,
        transparent 0.8rem,
        @color 0.8rem,
        @color 1.1rem,
        transparent 1.1rem
      ),
      #222222;
  }
}

.blocks(green, @green);
.blocks(blue, @blue);
.blocks(yellow, @yellow);
.blocks(gold,@gold);
.blocks(pink,@pink);
.blocks(black, @black);
.blocks(brown, @brown);
.blocks(red, @red);
.blocks(undefined, @white);

.animeright {
  animation: dialogmoveright 0.3s cubic-bezier(0.43, 0.24, 0.42, 0.98);;
  #dialog_padding {
    //animation: dialogbottom 0.3s ease-out;
    #dialogText {
      animation: dialogfadeindelay 0.7s ease-out;
    }
  }
}
.animeleft {
  animation: dialogmoveleft 0.3s cubic-bezier(0.43, 0.24, 0.42, 0.98);
  #dialog_padding {
    //animation: dialogbottom 0.3s ease-out;
    #dialogText {
      animation: dialogfadeindelay 0.7s ease-out;
    }
  }
}
.animemiddle {
  animation: dialogmovemiddle 0.3s cubic-bezier(0.43, 0.24, 0.42, 0.98);
  #dialog_padding {
    animation: dialogbottom 0.3s ease-out;
    #dialogText {
      animation: dialogfadeindelay 0.7s ease-out;
    }
  }
}
#dialog-normal {
  width: 65%;
  max-width: 1000px;
}
#dialog_padding {
  height: 9rem;
  border-top: #222222 0.2rem solid;
  &.sideSpeack {
    color: #444;
    background: repeating-linear-gradient(35deg, #ffffff24, transparent 8rem),
      repeating-linear-gradient(145deg, #ffffff14, transparent 8rem),
      linear-gradient(0deg, #ffffff00, #ecececde 50%);
    border-top: #eaeaead9 0.2rem solid;
  }
}
@keyframes dialogmoveright {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
    padding-left: 5rem;
  }

  100% {
    opacity: 1;
    padding-left: 0rem;
  }
}
@keyframes dialogmoveleft {
    0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
    padding-right: 5rem;
  }

  100% {
    opacity: 1;
    padding-right: 0rem;
  }

}
@keyframes dialogmovemiddle {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
    padding-bottom: 2rem;
  }

  100% {
    opacity: 1;
    padding-bottom: 0rem;
  }
}
@keyframes dialogfadein {
  0% {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
@keyframes dialogfadeindelay {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes dialogbottom {
  0% {
    height: 3rem;
    padding-top: 4rem;
  }
  100% {
    height: 9rem;
    padding-top: 1rem;
  }
}
</style>