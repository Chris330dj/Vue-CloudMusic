<template>
  <transition name="slide">
    <music-list :singer-name="title" :bg-img="bgImg" :songs="normalizedSongs" v-if="show"></music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { getSongUrl } from "api/song";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import { mergeList } from "common/js/util";

export default {
  data() {
    return {
      show: false,
      songs: [],
      urlList: [],
      normalizedSongs: []
    };
  },
  watch: {
    urlList(newUrl) {
      this.normalizedSongs = this._normalizeSongs(this.songs, newUrl);
    }
  },
  computed: {
    title() {
      return this.disc.name;
    },
    bgImg() {
      return this.disc.picUrl;
    },
    ...mapGetters(["disc"])
  },
  created() {
    setTimeout(() => {
      this.show = true;
    }, 20);
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.disc.id) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.id).then(res => {
        if (res.status === ERR_OK) {
          this.songs = res.data.playlist.tracks;
          let idList = this.songs.map(item => {
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
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>