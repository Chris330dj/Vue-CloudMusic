<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    // 手动派发点击事件
    click: {
      type: Boolean,
      default: true
    },
    // 需要动态监听数据
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll:{
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
      // 监听scroll事件
      if (this.listenScroll) {
        let _this = this;
        this.scroll.on("scroll", pos => {
          // 其实这里的this和_this是一样的
          // listview实例
          _this.$emit("scroll", pos);
        });
      }
      // 监听上拉刷新事件
      if(this.pullup){
        this.scroll.on("scrollEnd", ()=>{
          if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
            this.$emit('scrollToEnd')
            // console.log('hey!')
          }
        })
      }
      // 监听滚动事件/用于滑动失焦收小键盘
      if(this.beforeScroll){
        this.scroll.on('beforeScrollStart', ()=>{
          this.$emit('beforeScroll')
        })
      }
    },
    //   方法代理 & 向外界暴露better-scroll中的一些方法
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh;
      }, this.refreshDelay);
    }
  }
};
</script>

<style>
</style>