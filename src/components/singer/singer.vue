<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { ERR_OK } from "api/config";
import { getSingerList } from "api/singer";
import Singer from "common/js/singer";
import ListView from "base/listview/listview";
import { mapMutations } from "vuex";
import {playListMixin} from "common/js/mixin"

let pinyin = require("js-pinyin");
pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
const HOT_NAME = "#";
const HOT_LENS = 10;

export default {
  mixins:[playListMixin],
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlayList(playlist){
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.status === ERR_OK) {
          let temp_s = res.data.artists;
          temp_s.map(item => {
            let py = pinyin.getCamelChars(item.name);
            item.initial = py[0].toUpperCase();
          });
          this.singers = this._normalizeSinger(temp_s);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };

      list.forEach((item, index) => {
        // hot
        if (index < HOT_LENS) {
          map.hot.items.push(
            new Singer(item.id, item.name, item.img1v1Url, item.alias[0])
          );
        }
        // rest
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer(item.id, item.name, item.img1v1Url, item.alias[0])
        );
      });

      // 需要按顺序排出结果
      let hot = [];
      let rest = [];
      for (const key in map) {
        let val = map[key];
        if (val.title.match(/[A-Z]/)) {
          rest.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(rest);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
};
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>