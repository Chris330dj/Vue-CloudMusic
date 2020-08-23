<template>
  <transition name="slide">
    <div class="user-center">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <p class="text">用户中心</p>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
      </div>
      <div class="playBtn" @click="play">
        <i class="icon-play"></i>
        <span class="text">播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll :data="favoriteList" class="list-scroll" v-if="currentIndex===0" ref="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll :data="playHistory" class="list-scroll" v-if="currentIndex===1" ref="playList">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import NoResult from "base/no-result/no-result";
import { mapGetters, mapActions } from "vuex";
import { playerMixin, playListMixin } from "common/js/mixin";
import Song from "common/js/song";

export default {
  mixins: [playerMixin, playListMixin],
  data() {
    return {
      switches: [
        {
          name: "我喜欢的"
        },
        {
          name: "最近播放"
        }
      ],
      currentIndex: 0
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "快去发掘你喜欢的歌曲吧~！";
      } else {
        return "快去听歌吧~！";
      }
    },
    ...mapGetters(["playHistory", "favoriteList"])
  },
  methods: {
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    play() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (list.length === 0) return;
      list = list.map(song => {
        return new Song(song);
      });
      this.sequencePlay({ list });
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    back() {
      this.$router.back();
    },
    ...mapActions(["sequencePlay", "insertSong"])
  },
  components: { Switches, Scroll, SongList, NoResult }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    position: relative;
    text-align: center;

    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;

      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large;
        color: $color-theme;
      }
    }

    .text {
      display: block;
      padding: 10px;
      font-size: $font-size-large;
    }
  }

  .switches-wrapper {
    margin: 10px 0 20px 0;
  }

  .playBtn {
    box-sizing: border-box;
    width: 120px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-theme;
    border-radius: 100px;
    color: $color-theme;
    font-size: 0;

    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      font-size: $font-size-medium-x;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-medium-x;
    }
  }

  .list-wrapper {
    position: absolute;
    top: 140px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>