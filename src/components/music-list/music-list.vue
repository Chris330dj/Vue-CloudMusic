<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="singer-name" v-html="singerName"></h1>
    <div class="bg-img" :style="bgStyle" ref="bgImg">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      class="list"
      ref="list"
      @scroll="scroll"
      :probeType="probeType"
      :listenScroll="listenScroll"
    >
      <div class="song-list-wrapper">
        <div class="sequence-play" @click="sequence">
          <i class="icon-play"></i>
          <span class="text">播放全部</span>
          <span class="count">(共{{songs.length}}首)</span>
        </div>
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import SongList from "base/song-list/song-list";
import { prefixStyle } from "common/js/dom";
import { mapActions } from "vuex";
import {playListMixin} from "common/js/mixin"

// 单曲列表的边框圆角大小
const RADIUS = 10;
const RESERVED_HEIGHT = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins:[playListMixin],
  props: {
    bgImg: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: () => {
        return [];
      }
    },
    singerName: {
      type: String,
      default: ""
    },
    rank:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`;
    }
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      let translateY = Math.max(newY, this.minTranslateY);

      // 背景图跟随下拉放大
      const percent = Math.abs(newY / this.imgHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }

      // 背景跟随list上滑
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;

      // 上滑时背景高斯模糊
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;

      // 当list滑动超过预留高度/即hidden超过部分的list
      if (newY < translateY) {
        zIndex = 10;
        this.$refs.bgImg.style.paddingTop = 0;
        this.$refs.bgImg.style.height = `${RESERVED_HEIGHT}px`;
      } else {
        this.$refs.bgImg.style.paddingTop = "70%";
        this.$refs.bgImg.style.height = 0;
      }
      this.$refs.bgImg.style.zIndex = zIndex;
      this.$refs.bgImg.style[transform] = `scale(${scale})`;
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    // 缓存下来,不用每次都计算
    this.imgHeight = this.$refs.bgImg.clientHeight;
    this.minTranslateY = -this.imgHeight + RESERVED_HEIGHT;
    //因为这个得到的是VueComponent，而不是元素，所以我们这里还需要加上$el
    this.$refs.list.$el.style.top = `${this.imgHeight - RADIUS}px`;
  },
  methods: {
    handlePlayList(playlist){
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh()
    },
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item, index){
      this.selectPlay({
        list: this.songs,
        index
        })
    },
    sequence(){
      let list = this.songs;
      this.sequencePlay({
        list
      })
    },
    ...mapActions([
      'selectPlay',
      'sequencePlay'
    ])
  },
  components: {
    Scroll,
    Loading,
    SongList
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';
@import '~common/styles/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;

  .back {
    z-index: 20;
    position: absolute;
    top: 0;
    left: 6px;
    color: $color-text-ll;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
    }
  }

  .singer-name {
    z-index: 20;
    position: absolute;
    top: 0;
    left: 50%;
    transform translateX(-50%)
    width: 75%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text-ll;
  }

  .bg-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    // 这样宽高比为10:7
    background-size: cover;
    // 这样下拉放大图片有种向下放大的感觉，不然就是从中心放大
    transform-origin: top;

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    border-radius: 10px;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    border-radius: 10px;
    background: $color-background;

    // overflow hidden
    .song-list-wrapper {
      z-index: 10;
      padding: 10px 0 0 0;

      .sequence-play {
        position: relative;
        top: -5px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        border-bottom: 1px solid rgb(228, 228, 228);

        .icon-play {
          font-size: $font-size-large-x;
          color: $color-text;
          padding-right: 12px;
        }

        .text {
          font-size: $font-size-large;
          color: $color-text;
        }

        .count {
          padding-left: 5px;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>