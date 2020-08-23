<template>
  <transition name="slide">
    <music-list :singer-name="title" :bg-img="bgImg" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { getSongUrl } from "api/song";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import MusicList from "components/music-list/music-list";
import { mergeList } from "common/js/util";

export default {
  data() {
    return {
      topSongs: [],
      urlList: [],
      songs: [],
      rank: true
    };
  },
  created() {
    this._getMusicList();
  },
  watch: {
    urlList(newUrl) {
      this.songs = this._normalizeSongs(this.topSongs, newUrl);
    }
  },
  computed: {
    title() {
      return this.topList.name;
    },
    bgImg() {
      if (this.topSongs.length) {
        return this.topSongs[0].al.picUrl;
      }
      return ''
    },
    ...mapGetters(["topList"])
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      this.topSongs = this.topList.tracks.slice();
      let idList = this.topSongs.map(item => {
        return item.id;
      });
      this._getSongUrl(idList);
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