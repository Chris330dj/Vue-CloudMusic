<template>
  <transition name="slide">
    <music-list :singer-name="singerName" :bg-img="bgImg" :songs="songs" v-if="show"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { getSongUrl } from "api/song";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import MusicList from "components/music-list/music-list";
import {mergeList} from "common/js/util"

export default {
  data() {
    return {
      show: false,
      hotSongs: [],
      urlList: [],
      songs:[]
    };
  },
  watch: {
    urlList(newUrl) {
      this.songs = this._normalizeSongs(this.hotSongs, newUrl);
    }
  },
  computed: {
    singerName() {
      return this.singer.name;
    },
    bgImg() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    setTimeout(() => {
      this.show = true;
    }, 20);
    this._getDetail();
  },
  methods: {
    _getDetail() {
      // this.singer是vuex中来的
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      // console.log('hi,',this.singer.id)
      getSingerDetail(this.singer.id).then(res => {
        if (res.status === ERR_OK) {
          this.hotSongs = res.data.hotSongs;
          let idList = this.hotSongs.map(item => {
            return item.id;
          });
          this._getSongUrl(idList);
        }
      });
    },
    _getSongUrl(idList) {
      let urlList = [];
      getSongUrl(idList).then(res => {
        if (res.status === ERR_OK) {
          this.urlList = res.data.data;
        } else {
          console.log("歌曲播放地址获取失败");
        }
      });
    },
    _normalizeSongs(musicList, urlList) {
      let ret = [];
      // 将两个list并到一起
      const merged = mergeList(musicList, urlList);
      merged.forEach(item => {
        ret.push(createSong(item));
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>