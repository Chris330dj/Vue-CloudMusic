<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="scroll">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.coverImgUrl" width="100" height="100">
          </div>
          <ul class="top3List">
            <li class="song" v-for="(song,index) in item.top3" :key="index">
              <span>{{index + 1}}.</span>
              <span>{{song.name}}-{{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-wrapper" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from 'base/loading/loading'
import { getTop } from "api/rank";
import { ERR_OK } from "api/config";
import {playListMixin} from "common/js/mixin"
import {mapMutations, mapActions} from "vuex"

// 共有34类/0-33,太多了所以选几个
const TOP_IDX = [0, 1, 3, 6, 9, 22, 24];

export default {
  mixins:[playListMixin],
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    selectItem(item){
      this.$router.push({
        path:`/rank/${item.id}`
      })
      this.setTopList(item)
    },
    handlePlayList(playlist){
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _getTopList() {
      // 这里因为异步请求，并不能按照循环顺序执行，只能将结果插入对应位置了
      for (let i = 0; i < TOP_IDX.length; i++) {
        getTop(TOP_IDX[i]).then(res => {
          if (res.status === ERR_OK) {
            let list = res.data.playlist;
            list.top3 = list.tracks.slice(0,3);
            this.topList.splice(i, 1, list)
          }
        });
      }
    },
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
  @import '~common/styles/variable';
  @import '~common/styles/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  background-color: $color-background
  .toplist{
    height 100%
    overflow hidden
    .item{
      display flex
      margin 0 10px
      padding 10px 0
      border-bottom 1px solid $color-background-d
      height 100px
      &:last-child{
        padding-bottom 20px
        }

      .icon{
        flex 0 0 100px
        height 100px
        width 100px
        }
      .top3List{
        flex 1
        display flex
        box-sizing border-box
        flex-direction column
        justify-content space-around
        padding 5px 15px
        height 100px
        overflow hidden
        color: $color-text;
        font-size: $font-size-small;
        .song{
          no-wrap()
          }
        }
      }
    }
    .loading-wrapper{
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
      }
}
</style>