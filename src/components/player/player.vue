<template>
  <div class="player" v-show="playList.length">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div class="filter"></div>
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  class="text"
                  :class="{'current': currentLineNum === index}"
                  ref="lyricLine"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow==='cd'}"></span>
            <span class="dot" :class="{'active': currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <!-- 播放模式 -->
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <!-- 上一首 -->
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <!-- 播放/暂停 -->
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <!-- 下一首 -->
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <!-- 心标 -->
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openPlayer">
        <div class="icon">
          <img :src="currentSong.image" :class="cdClass" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <div class="desc" v-html="currentSong.singer"></div>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import Scroll from "base/scroll/scroll";
import PlayList from "components/playlist/playlist";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { PlayMode } from "common/js/config";
import { shuffle } from "common/js/util";
import Lyric from "common/js/lyric-parser";
import { prefixStyle } from "common/js/dom";
import {playerMixin} from "common/js/mixin"

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  mixins:[playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      duration: 0,
      radius: 25,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: "",
      currentShow: "cd"
    };
  },
  watch: {
    currentSong(newV, oldV) {
      if (!newV.id) return;
      // 保证在暂停时切换模式不会自动播放
      if (newV.id === oldV.id) return;

      // fix-bug:切歌时没有清除计时器
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentTime = 0;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
      clearTimeout(this.timer)
      // 主逻辑
      this.timer = setTimeout(()=>{
        this.$refs.audio.play();
        this.getLyric();
        // 这里就能得到歌词了
      },1000)
    },
    playing(newV) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newV ? audio.play() : audio.pause();
      });
    },
    songReady() {
      this.duration = this.$refs.audio.duration;
    }
  },
  computed: {
    cdClass() {
      return this.playing ? "play" : "play pause";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    percent() {
      return this.currentTime / this.duration;
    },
    ...mapGetters([
      "fullScreen",
      "playing",
      "currentIndex"
    ])
  },
  created() {
    this.touch = {};
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    openPlayer() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      this.setPlayingState(!this.playing);
      this.currentLyric && this.currentLyric.togglePlay();
    },
    prev() {
      if (!this.songReady) return;

      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    next() {
      if (!this.songReady) return;

      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    end() {
      if (this.mode === PlayMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.currentLyric && this.currentLyric.seek(0);
    },
    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong)
    },
    error() {
      // 功能上保证可以切换，比如没网时还是可以切，但是没有办法播放
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      interval = interval | 0;
      let minute = this._pad((interval / 60) | 0);
      let second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    onProgressBarChange(percent) {
      const currentTime = this.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      this.currentLyric && this.currentLyric.seek(currentTime * 1000);
    },
    getLyric() {
      this.currentSong.getLyric().then(lyric => {
        // 防止切换过快,获取歌词异步加载还没结束就下一首了
          if(this.currentSong.lyric !== lyric) return
          
          // TODO:刷新后歌词消失
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList &&
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList && this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      // this.playingLyric = txt
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) return;
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      // 判定为上下滑动
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      const Screenleft = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        Math.max(Screenleft + deltaX, -window.innerWidth),
        0
      );

      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      // 控制lyric组件移动
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      // 及时切换无需过渡时间
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      // 控制cd组件渐隐渐显/opacity=0时消失
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd(e) {
      let offsetWidth, opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }

      const time = 300;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      this.touch.initiated = false;
    },
    showPlayList(){
      this.$refs.playlist.show()
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN"
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  components: { ProgressBar, ProgressCircle, Scroll, PlayList }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';
@import '~common/styles/mixin';

&.normal-enter-active, &.normal-leave-active {
  transition: all 0.4s;

  .top, .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}

&.normal-enter, &.normal-leave-to {
  opacity: 0;

  .top {
    transform: translate3d(0, -100px, 0);
  }

  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}

&.mini-enter-active, &.mini-leave-active {
  transition: all 0.4s;
}

&.mini-enter, &.mini-leave-to {
  opacity: 0;
}

.player {
  .normal-player {
    z-index: 150;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(10px);

      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          // TODO: 原先是5 9, 等把三角转过来再改
          padding: 10px 9px;
          font-size: $font-size-large-x;
          color: $color-text-ll;
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 20px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text-ll;
      }

      .subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text-ll;
      }
    }

    .middle {
      position: fixed;
      // display: flex;
      // align-items: center;
      // position: fixed;
      width: 100%;
      top: 90px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        // display: none;
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        // overflow hidden
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            // border: 15px solid rgba(255, 255, 255, 0.2)
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              box-sizing: border-box;
              border: 15px solid rgba(255, 255, 255, 0.2);
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text-ll;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          width: 8px;
          height: 6px;
          margin: 0 2px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 85%;
        margin: 0 auto;
        padding: 10px 0;

        .time {
          color: $color-text-ll;
          font-size: $font-size-medium;
          flex: 0 0 45px;
          line-height: 45px;
          width: 45px;
          text-align: center;
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-text-ll;

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }
      }
    }
  }

  .mini-player {
    z-index: 180;
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: $color-background-l;

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 18px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 5px;

      .icon-mini {
        font-size: 25px;
        color: $color-text;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>