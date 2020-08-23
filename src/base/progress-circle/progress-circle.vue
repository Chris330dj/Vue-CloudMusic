<template>
  <div class="progress-circle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
    >
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
      :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data(){
    return{
      dashArray: Math.PI * 100
    }
  },
  computed:{
    dashOffset(){
      return (1-this.percent) * this.dashArray
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.progress-circle {
  position: relative;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      stroke: $color-text-d;
    }

    &.progress-bar {
      z-index 100
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-sub-theme;
    }
  }
}
</style>