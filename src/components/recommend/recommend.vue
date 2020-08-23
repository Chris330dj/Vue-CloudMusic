<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll">
      <div>
        <div v-if="banners.length" class="decorate" :data="discList"></div>
        <div v-if="banners.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="(item, index) in banners" :key="index">
              <img :src="item.imageUrl" />
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="title">推荐歌单</h1>
          <ul>
            <li class="item" v-for="item in discList" :key="item.id" @click.stop="selectItem(item)">
              <div class="icon">
                <div class="gradients"></div>
                <img v-lazy="item.picUrl" />
              </div>
              <div class="play-count">
                <div class="music-icon"></div>
                {{Math.floor(item.playCount/10000)}}万
              </div>
              <div class="text">
                <p class="name">{{item.name}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading"
import { getBanner, getRecommendList } from "api/recommend";
import { ERR_OK } from "api/config";
import {playListMixin} from "common/js/mixin"
import {mapMutations} from "vuex"

export default {
  mixins:[playListMixin],
  data() {
    return {
      banners: [],
      discList: []
    };
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getBanner();
    this._getDiscList();
  },
  methods: {
    handlePlayList(playlist){
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh()
    },
    selectItem(item){
      this.$router.push({
        path: `/recommend/${item.id}`
      });
      // console.log(item)
      this.setDisc(item);
    },
    _getBanner() {
      getBanner().then(res => {
        if (res.status === ERR_OK) {
          this.banners = res.data.banners;
        } else {
          console.error("Banner 获取失败");
        }
      });
    },
    _getDiscList() {
      getRecommendList().then(res => {
        if (res.status === ERR_OK) {
          this.discList = res.data.result;
        } else {
          console.error("getRecommendList 获取失败");
        }
      });
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  // z-index: -10;

  .recommend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .decorate {
      position: absolute;
      // z-index: -10;
      width: 100%;
      // height: 45vh;
      // top: -30vh;
      height: 15vh;
      background: $color-theme;
    }

    .slider-wrapper {
      position: relative;
      width: 96%;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 5px;
    }

    .recommend-list {
      width: 96%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;

      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }

      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;

        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;

          .gradients {
            position: absolute;
            top: 0;
            width: 100%;
            height: 35px;
            border-radius: 3px;
            background: linear-gradient(rgba(109, 109, 109, 0.4), rgba(255, 255, 255, 0));
          }

          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }

        .play-count {
          position: absolute;
          top: 5px;
          right: 8px;
          font-size: $font-size-small;
          color: $color-theme-l;

          .music-icon {
            display: inline-block;
            vertical-align: top;
            width: 10px;
            height: 10px;
            background-image: url('./music-icon.png');
            background-size: 10px 10px;
          }
        }

        .text {
          float: left;
          font-size: $font-size-small;
          line-height: 16px;
          text-align: left;
          height: 34px;
          overflow: hidden;
          margin-bottom: 12px;
        }
      }
    }
    .loading-container{
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
      }
  }
}
</style>