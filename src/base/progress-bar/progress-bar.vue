<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/dom";

const progressBtnWidth = 8;
const progressBtnHalfWidth = 4;
const transform = prefixStyle("transform");

export default {
  data(){
    return{
      barWidth:0
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newP) {
      if (newP >= 0 && !this.touch.initiated) {
        this.barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newP * this.barWidth;
        this._offSet(offsetWidth);
      }
    }
  },
  created(){
    this.touch = {};
  },
  methods: {
    progressTouchStart(e){
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e){
      if(!this.touch.initiated) return
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), (this.barWidth))
      this._offSet(offsetWidth)
    },
    progressTouchEnd(){
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick(e){
      // 因为用户想看到精准点击,_offset垫了一下进度条会后一点,所以这里减掉+
      this._offSet(e.offsetX - progressBtnHalfWidth);
      this._triggerPercent();
    },
    _offSet(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      // 需要垫一下，不然圆点拖不到最后，并且圆点一开始超前了一点
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth + progressBtnHalfWidth}px, 0, 0)`;
    },
    _triggerPercent(){
      // 靠拖动进度条得到的percent
      const percent = this.$refs.progress.clientWidth / this.barWidth;
      this.$emit('percentChange', percent);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.progress-bar {
  height: 30px;
  // padding: 0 7px;

  .bar-inner {
    width 100%
    position: relative;
    top: 13px;
    height: 3px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -15px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 12px;
        left: 12px;
        box-sizing: border-box;
        width: 8px;
        height: 8px;
        border: 1px solid $color-theme-l;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>