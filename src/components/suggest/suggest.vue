<template>
  <scroll class="suggest-wrapper" ref="scroll" :pullup="pullup" 
  @scrollToEnd="searchMore"
  :beforeScroll = "beforeScroll"
  @beforeScroll="listScroll"
  >
    <div class="suggest-content">
      <div class="search-suggest">
        <ul v-if="singers.length">
          <li
            v-for="(singer, index) in singers"
            :key="index"
            class="search-suggest-item"
            @click="selectSinger(singer)"
          >
            <img :src="singer.img1v1Url" width="40" height="40" />
            <span>歌手 - {{singer.name}}</span>
          </li>
        </ul>
        <!-- <ul v-if="albums.length">
          <li
            v-for="(album, index) in albums"
            :key="index"
            class="search-suggest-item"
            @click="selectAlbum(album)"
          >
            <i class="icon icon-playlist"></i>
            <div class="name">
              <span class="song">{{album.name}}</span>
              <span class="singer">{{album.artist.name}}</span>
            </div>
          </li>
        </ul>-->
      </div>
      <ul class="suggest-list">
        <li
          v-for="(song, index) in songs"
          :key="index"
          class="suggest-item"
          @click="selectSong(song)"
        >
          <i class="icon icon-music"></i>
          <div class="name">
            <span class="song">{{song.name}}</span>
            <span class="singer">{{song.artists[0].name}}</span>
          </div>
        </li>
        <loading v-show="hasMore"></loading>
      </ul>
      <no-result class="no-result-wrapper" v-show="!hasMore && !songs.length" title="抱歉,没有更多搜索结果！"></no-result>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script>
import Loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import NoResult from "base/no-result/no-result";
import { searchSongs, searchSuggest } from "api/search";
import { ERR_OK } from "api/config";
import { mapMutations, mapActions } from "vuex";
import Singer from "common/js/singer";
import { getSongUrl, getSongDetail } from "api/song";
import { createSong } from "common/js/song";

const LIMIT = 15;

export default {
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      order: [],
      singers: [],
      songCount: 0,
      songs: [],
      albums: [],
      offset: 1,
      pullup: true,
      hasMore: true,
      selectedSong: {},
      beforeScroll: true
    };
  },
  watch: {
    query(val) {
      if (val === "") {
        return;
      } else {
        this.search();
      }
    }
  },
  methods: {
    refresh(){
      this.$refs.scroll.refresh()
    },
    search() {
      this.$refs.scroll.scrollTo(0, 0);
      searchSongs(this.query, this.offset, LIMIT).then(res => {
        if (res.status === ERR_OK) {
          // console.log('songs',res.data.result)
          let newSongs = res.data.result
          this.songCount = newSongs.songCount;
          this.songs = newSongs.songs;
          if(this.songs){
          this._checkMore(newSongs.songs);
          }else{
            this.hasMore = false
            this.songs = []
          }
        }
      });
      searchSuggest(this.query).then(res => {
        if (res.status === ERR_OK) {
          // console.log(res.data.result)
          this.order = res.data.result.order;
          if (JSON.stringify(this.order) == "{}") {
            if (this.order.indexOf("artists") !== -1) {
              this.singers = res.data.result.artists;
            }
            if (this.order.indexOf("albums") !== -1) {
              this.albums = res.data.result.albums;
            }
          }
        }else{
          // 返回值为空
          this.singers = []
          this.albums = []
        }
      });
    },
    searchMore() {
      if (!this.hasMore) return;
      this.offset++;
      searchSongs(this.query, this.offset, LIMIT).then(res => {
        if (res.status === ERR_OK) {
          let newSongs = res.data.result.songs;
          this.songs = this.songs.concat(newSongs);
          this._checkMore(newSongs);
        }
      });
    },
    selectSinger(originSinger) {
      // console.log('singer', singer)
      const singer = new Singer(
        originSinger.id,
        originSinger.name,
        originSinger.img1v1Url,
        originSinger.alias[0]
      );
      this.$router.push({
        path: `/search/singer/${singer.id}`
      });
      this.setSinger(singer);
      // this.$emit('select', originSinger)
      this.$emit('select')
    },
    selectAlbum(album) {
      // console.log('album', album)
      // this.$router.push({
      //   path: `/recommend/${item.id}`
      // });
      // this.setDisc(album);

      this.$router.push({
        path: `/search/disc/${album.id}`
      });
    },
    selectSong(originSong) {
      this.selectedSong = originSong;
      this.selectedSong.ar = originSong.artists;
      this.selectedSong.al = originSong.album;
      // 获取歌曲图片信息
      getSongDetail(this.selectedSong.id).then(res => {
        if (res.status === ERR_OK) {
          this.selectedSong.al.picUrl = res.data.songs[0].al.picUrl;
          // 获取url信息
          getSongUrl(this.selectedSong.id).then(res => {
            if (res.status === ERR_OK) {
              this.selectedSong.url = res.data.data[0].url;
              // 规整song格式
              const song = createSong(this.selectedSong);
              this.insertSong(song);
            }
          });
        }
      });
      // this.$emit('select', originSong)
      this.$emit('select')
    },
    listScroll(){
      this.$emit('listScroll')
    },
    _checkMore(data) {
      if (
        data === undefined ||
        !data.length ||
        this.offset * LIMIT > this.songCount
      ) {
        this.hasMore = false;
      }
    },
    ...mapMutations({
      setSinger: "SET_SINGER",
      setDisc: "SET_DISC"
    }),
    ...mapActions(["insertSong"])
  },
  components: { Loading, Scroll, NoResult }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';
@import '~common/styles/mixin';

.suggest-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: $color-background;

  .suggest-content {
    position: relative;

    // width: 100%;
    .icon {
      text-align: center;
      font-size: 24px;
      flex: 0 0 40px;
      padding-right: 10px;
    }

    .search-suggest {
      .search-suggest-item {
        display: flex;
        align-items: center;
        height: 45px;
        padding: 8px 15px;
        border-bottom: 1px solid $color-background-d;
        font-size: $font-size-medium-x;

        img {
          flex: 0 0 40px;
          border-radius: 5px;
          padding-right: 10px;
        }

        span {
          padding: 3px 5px 3px 0;
          no-wrap();
        }

        .album {
          display: block;
          font-size: $font-size-medium-x;
          color: $color-text;
          no-warp();
        }
      }
    }

    .suggest-list {
      padding-bottom: 138px;

      .suggest-item {
        display: flex;
        align-items: center;
        padding: 8px 15px;
        border-bottom: 1px solid $color-background-d;
        font-size: $font-size-medium;
      }
    }

    .name {
      .song {
        display: block;
        font-size: $font-size-medium-x;
        color: $color-text;
        no-warp();
      }

      .singer {
        display: block;
        font-size: $font-size-medium;
        padding-top: 2px;
        color: $color-theme-d;
        no-warp();
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      // transform: translateY(-50%);
    }
  }
}
</style>