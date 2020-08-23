<template>
  <transition name="slide">
    <div class="add-song" v-show="isShow" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到当前播放列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- <div class="search-box-wrapper">
        <keep-alive>
          <search-box placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox"></search-box>
        </keep-alive>
      </div> -->
      <div class="shortcut" v-show="!query.length">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem" class="switches"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll" v-if="currentIndex===0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex===1" :data="searchHistory">
            <div class="history-list-inner">
              <search-list
                :searches="searchHistory"
                @select="addQuery"
                @delete="deleteSearchHistory"
              ></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <!-- <div class="search-result" v-show="query" ref="searchResult">
        <suggest :query="query" @listSrcoll="blurInput" @select="saveSearch"></suggest>
      </div> -->
    </div>
  </transition>
</template>

<script>
import SearchBox from "base/search-box/search-box";
import Switches from "base/switches/switches";
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import SearchList from "base/search-list/search-list";
import Suggest from "components/suggest/suggest";
import { mapGetters, mapActions } from "vuex";
import Song from "common/js/song";
import { searchMixin } from "common/js/mixin";

export default {
  mixins: [searchMixin],
  data() {
    return {
      isShow: false,
      switches: [{ name: "最近播放" }, { name: "搜索历史" }],
      currentIndex: 0
    };
  },
  computed: {
    ...mapGetters(["playHistory", "searchHistory"])
  },
  methods: {
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));
      }
    },
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    ...mapActions(["insertSong"])
  },
  components: {
    SearchBox,
    Switches,
    SongList,
    Scroll,
    SearchList,
    Suggest
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';
@import '~common/styles/mixin';

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      color: $color-text;
      font-size: $font-size-large;
    }

    .close {
      position: absolute;
      top: 0;
      right: 5px;

      .icon-close {
        display: block;
        padding: 13px;
        font-size: $font-size-large;
        color: $color-theme;
      }
    }
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut {
    .switches{
      position relative
      top 15px
      }
    .list-wrapper {
      position: absolute;
      top: 100px;
      bottom: 0;
      width: 100%;

      .list-scroll {
        height: 100%;
        overflow: hidden;

        .history-list-inner {
          padding: 0 30px;
        }
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}
</style>